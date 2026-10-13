#!/usr/bin/env python3
"""Audit and import Runer.ku.dk image links for Danish inscriptions.

The script reads DR inscriptions with Danish Runic Inscriptions Database
references, opens each Runer.ku.dk object page in a real Playwright browser,
extracts image URLs from the page's Billeder section, writes CSV reports, and
optionally imports verified ImgCache images into runes_imagelink.

Default mode is dry-run. Use --apply to write verified image rows.
"""

from __future__ import annotations

import argparse
import csv
import re
import sqlite3
import sys
import time
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = ROOT / "rundatanet/static/runes/runes.sqlite3"
DEFAULT_REPORT_DIR = ROOT / "audit/runer_ku_images"
CAPTION = "Source: Runer.ku.dk"

VISGENSTAND_RE = re.compile(r"https?://runer\.ku\.dk/VisGenstand\.aspx\?Titel=([^\s,;]+)", re.I)
Q_PAGE_RE = re.compile(r"https?://runer\.ku\.dk/q\.php\?p=runer/genstande/genstand/[0-9]+", re.I)


@dataclass
class Candidate:
    signature: str
    meta_id: int
    reference_url: str
    page_url: str


def canonical_runer_url(reference_text: str) -> str | None:
    """Return a modern Runer object URL or title-redirect URL from a reference."""
    q_match = Q_PAGE_RE.search(reference_text)
    if q_match:
        return q_match.group(0).replace("http:", "https:")

    old_match = VISGENSTAND_RE.search(reference_text)
    if old_match:
        title = old_match.group(1)
        return f"https://runer.ku.dk/q.php?p=runer/genstande/genstandfratitel&Titel={title}"

    return None


def connect(db_path: Path) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def ensure_image_caption_columns(conn: sqlite3.Connection) -> None:
    columns = {row["name"] for row in conn.execute("PRAGMA table_info(runes_imagelink)")}
    if "info" not in columns:
        conn.execute("ALTER TABLE runes_imagelink ADD COLUMN info varchar(1500) NOT NULL DEFAULT ''")
    if "original_info" not in columns:
        conn.execute("ALTER TABLE runes_imagelink ADD COLUMN original_info varchar(1500) NOT NULL DEFAULT ''")
    conn.commit()


def load_candidates(conn: sqlite3.Connection, *, include_existing: bool = False, limit: int | None = None) -> list[Candidate]:
    existing_filter = ""
    if not include_existing:
        existing_filter = """
        HAVING COUNT(img.id) = 0
        """

    limit_sql = f"LIMIT {int(limit)}" if limit else ""
    rows = conn.execute(
        f"""
        SELECT
            s.signature_text,
            mi.id AS meta_id,
            r.text AS dk_reference
        FROM meta_information mi
        JOIN signatures s ON s.id = mi.signature_id
        JOIN meta_information_references mr ON mr.metainformation_id = mi.id
        JOIN "references" r ON r.id = mr.reference_id
        LEFT JOIN runes_imagelink img
            ON img.meta_id = mi.id
            AND (img.link_url LIKE '%runer.ku.dk%' OR img.direct_url LIKE '%runer.ku.dk%')
        WHERE s.signature_text LIKE 'DR %'
            AND r.text LIKE '%runer.ku.dk%'
        GROUP BY mi.id
        {existing_filter}
        ORDER BY
            CASE WHEN s.signature_text GLOB 'DR [0-9]*' THEN 0 ELSE 1 END,
            s.signature_text
        {limit_sql}
        """
    ).fetchall()

    candidates: list[Candidate] = []
    for row in rows:
        page_url = canonical_runer_url(row["dk_reference"])
        if page_url:
            candidates.append(
                Candidate(
                    signature=row["signature_text"],
                    meta_id=row["meta_id"],
                    reference_url=row["dk_reference"],
                    page_url=page_url,
                )
            )
    return candidates


def load_candidates_from_csv(path: Path, *, start: int = 0, limit: int | None = None) -> list[Candidate]:
    candidates: list[Candidate] = []
    with path.open("r", encoding="utf-8", newline="") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            page_url = canonical_runer_url(row["dk_reference"])
            if not page_url:
                continue
            candidates.append(
                Candidate(
                    signature=row["signature"],
                    meta_id=int(row["meta_id"]),
                    reference_url=row["dk_reference"],
                    page_url=page_url,
                )
            )
    sliced = candidates[start:]
    if limit:
        sliced = sliced[:limit]
    return sliced


def load_missing_danish_reference_signatures(conn: sqlite3.Connection) -> list[sqlite3.Row]:
    return conn.execute(
        """
        SELECT s.signature_text
        FROM meta_information mi
        JOIN signatures s ON s.id = mi.signature_id
        WHERE s.signature_text LIKE 'DR %'
          AND NOT EXISTS (
              SELECT 1
              FROM meta_information_references mr
              JOIN "references" r ON r.id = mr.reference_id
              WHERE mr.metainformation_id = mi.id
                AND r.text LIKE '%runer.ku.dk%'
          )
        ORDER BY s.signature_text
        """
    ).fetchall()


def write_csv(path: Path, fieldnames: list[str], rows: Iterable[dict[str, object]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def append_csv_row(path: Path, fieldnames: list[str], row: dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    exists = path.exists()
    with path.open("a", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        if not exists:
            writer.writeheader()
        writer.writerow(row)


def extract_images(page) -> list[str]:
    """Extract real Runer image URLs from the loaded object page."""
    images = page.evaluate(
        """
        () => Array.from(document.images).map((img) => ({
            src: img.src || "",
            width: img.naturalWidth || 0,
            height: img.naturalHeight || 0,
            parentText: img.parentElement ? (img.parentElement.innerText || "") : ""
        }))
        """
    )
    urls: list[str] = []
    for image in images:
        src = image.get("src", "")
        if "/ImgCache/" not in src:
            continue
        if image.get("width", 0) < 80 or image.get("height", 0) < 80:
            continue
        if src not in urls:
            urls.append(src)
    return urls


def load_runer_page(page, url: str, timeout_ms: int) -> tuple[str, str]:
    page.goto(url, wait_until="domcontentloaded")
    if "genstandfratitel" in page.url:
        try:
            page.wait_for_url(re.compile(r".*/genstand/[0-9]+.*"), timeout=timeout_ms)
        except Exception:
            pass
    try:
        page.wait_for_load_state("networkidle", timeout=timeout_ms)
    except Exception:
        pass
    return page.url, page.title()


def extract_images_with_retry(page) -> list[str]:
    try:
        return extract_images(page)
    except Exception:
        try:
            page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        return extract_images(page)


def import_images(conn: sqlite3.Connection, candidate: Candidate, final_url: str, image_urls: list[str]) -> int:
    inserted = 0
    for image_url in image_urls:
        exists = conn.execute(
            """
            SELECT 1
            FROM runes_imagelink
            WHERE meta_id = ?
              AND (direct_url = ? OR link_url = ?)
            LIMIT 1
            """,
            (candidate.meta_id, image_url, final_url),
        ).fetchone()
        if exists:
            continue
        conn.execute(
            """
            INSERT INTO runes_imagelink (link_url, direct_url, meta_id, info, original_info)
            VALUES (?, ?, ?, ?, ?)
            """,
            (final_url, image_url, candidate.meta_id, CAPTION, CAPTION),
        )
        inserted += 1
    return inserted


def run(args: argparse.Namespace) -> int:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print(
            "Playwright is not installed in this Python environment.\n"
            "Install it in a controlled environment, then run:\n"
            "  python -m pip install playwright\n"
            "  python -m playwright install chromium\n",
            file=sys.stderr,
        )
        return 2

    db_path = Path(args.db)
    report_dir = Path(args.report_dir)
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    report_prefix = report_dir / f"runer_ku_images_{timestamp}"

    conn = connect(db_path)
    ensure_image_caption_columns(conn)
    if args.candidates_csv:
        candidates = load_candidates_from_csv(Path(args.candidates_csv), start=args.start, limit=args.limit)
    else:
        candidates = load_candidates(conn, include_existing=args.include_existing, limit=args.limit)
    missing_danish_refs = load_missing_danish_reference_signatures(conn)

    print(f"Candidates to check: {len(candidates)}")
    print(f"DR signatures without runer.ku.dk reference: {len(missing_danish_refs)}")
    print("Mode:", "APPLY" if args.apply else "DRY-RUN")

    found_rows: list[dict[str, object]] = []
    no_image_rows: list[dict[str, object]] = []
    error_rows: list[dict[str, object]] = []
    inserted_total = 0

    found_path = report_prefix.with_name(report_prefix.name + "_found_images.csv")
    no_image_path = report_prefix.with_name(report_prefix.name + "_no_images_on_runer.csv")
    error_path = report_prefix.with_name(report_prefix.name + "_errors.csv")
    missing_ref_path = report_prefix.with_name(report_prefix.name + "_missing_danish_reference.csv")
    found_fields = ["signature", "meta_id", "reference_url", "page_url", "final_url", "image_url", "imported"]
    no_image_fields = ["signature", "meta_id", "reference_url", "page_url", "final_url", "page_title"]
    error_fields = ["signature", "meta_id", "reference_url", "page_url", "error"]

    with sync_playwright() as p:
        browser_type = getattr(p, args.browser)
        launch_kwargs = {"headless": not args.headed}
        if args.executable_path:
            launch_kwargs["executable_path"] = args.executable_path
        browser = browser_type.launch(**launch_kwargs)
        page = browser.new_page()
        page.set_default_timeout(args.timeout_ms)

        for index, candidate in enumerate(candidates, start=1):
            try:
                final_url, title = load_runer_page(page, candidate.page_url, args.timeout_ms)
                if "Checking your browser" in title:
                    page.wait_for_timeout(3000)
                    title = page.title()
                image_urls = extract_images_with_retry(page)

                if image_urls:
                    inserted = 0
                    if args.apply:
                        inserted = import_images(conn, candidate, final_url, image_urls)
                        conn.commit()
                    inserted_total += inserted
                    for image_url in image_urls:
                        found_rows.append(
                            found_row := {
                                "signature": candidate.signature,
                                "meta_id": candidate.meta_id,
                                "reference_url": candidate.reference_url,
                                "page_url": candidate.page_url,
                                "final_url": final_url,
                                "image_url": image_url,
                                "imported": "yes" if args.apply else "dry-run",
                            }
                        )
                        append_csv_row(found_path, found_fields, found_row)
                else:
                    no_image_rows.append(
                        no_image_row := {
                            "signature": candidate.signature,
                            "meta_id": candidate.meta_id,
                            "reference_url": candidate.reference_url,
                            "page_url": candidate.page_url,
                            "final_url": final_url,
                            "page_title": title,
                        }
                    )
                    append_csv_row(no_image_path, no_image_fields, no_image_row)
            except Exception as exc:  # noqa: BLE001 - report and continue the batch
                error_rows.append(
                    error_row := {
                        "signature": candidate.signature,
                        "meta_id": candidate.meta_id,
                        "reference_url": candidate.reference_url,
                        "page_url": candidate.page_url,
                        "error": str(exc)[:1000],
                    }
                )
                append_csv_row(error_path, error_fields, error_row)

            if index % args.progress_every == 0:
                print(
                    f"{index}/{len(candidates)} checked; "
                    f"with_images={len({r['signature'] for r in found_rows})}; "
                    f"no_images={len(no_image_rows)}; errors={len(error_rows)}; "
                    f"inserted={inserted_total}"
                )
            if args.delay_ms:
                time.sleep(args.delay_ms / 1000)

        browser.close()

    write_csv(
        missing_ref_path,
        ["signature"],
        [{"signature": row["signature_text"]} for row in missing_danish_refs],
    )

    print("REPORT_PREFIX", report_prefix)
    print("found_image_rows", len(found_rows))
    print("found_signatures", len({row["signature"] for row in found_rows}))
    print("no_image_signatures", len(no_image_rows))
    print("error_signatures", len(error_rows))
    print("inserted_rows", inserted_total)
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--db", default=str(DEFAULT_DB))
    parser.add_argument("--report-dir", default=str(DEFAULT_REPORT_DIR))
    parser.add_argument("--apply", action="store_true", help="Insert verified image rows into runes_imagelink.")
    parser.add_argument("--include-existing", action="store_true", help="Re-check inscriptions that already have Danish images.")
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--start", type=int, default=0, help="Start offset when using --candidates-csv.")
    parser.add_argument("--candidates-csv", default="", help="CSV with signature, meta_id, dk_reference columns.")
    parser.add_argument("--headed", action="store_true", help="Run browser visibly.")
    parser.add_argument(
        "--browser",
        choices=["chromium", "webkit", "firefox"],
        default="chromium",
        help="Playwright browser engine to use.",
    )
    parser.add_argument(
        "--executable-path",
        default="",
        help="Use an installed browser executable instead of Playwright's bundled browser.",
    )
    parser.add_argument("--timeout-ms", type=int, default=15000)
    parser.add_argument("--delay-ms", type=int, default=150)
    parser.add_argument("--progress-every", type=int, default=25)
    return parser.parse_args()


if __name__ == "__main__":
    raise SystemExit(run(parse_args()))
