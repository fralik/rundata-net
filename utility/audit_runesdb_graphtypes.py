#!/usr/bin/env python3
"""Audit RuneS find pages for graphtype analyses.

The script checks RuneS find pages, classifies whether they contain graphtype
analysis, records image availability separately, extracts sigla, and matches
them against local Rundata signatures. It writes CSV reports only; it does not
modify the database.
"""

from __future__ import annotations

import argparse
import csv
import html
import re
import sqlite3
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = ROOT / "rundatanet/static/runes/runes.sqlite3"
DEFAULT_REPORT_DIR = ROOT / "audit/runesdb_graphtypes"
BASE_URL = "http://www.runesdb.de/de/find/{find_no}"

SIGLA_RE = re.compile(
    r"<td[^>]*>\s*<span[^>]*class=\"font-bold\"[^>]*>(?P<main>.*?)</span>(?P<rest>.*?)</td>",
    re.S,
)
TAG_RE = re.compile(r"<[^>]+>")
GRAPHTYPE_RE = re.compile(r"alt=\"Graphtyp\s+(\d+)\"")
INSCRIPTION_RE = re.compile(r"=\s*Inschrift/Eintrag\s+([^<\n]+)")


@dataclass
class PageAudit:
    find_no: int
    url: str
    http_status: int | str
    status: str
    has_image: bool
    has_graphtypes: bool
    graphtype_count: int
    main_siglum: str
    all_sigla: list[str]
    matched_signature: str
    match_status: str
    error: str = ""


def strip_tags(value: str) -> str:
    return html.unescape(TAG_RE.sub(" ", value)).replace("\xa0", " ").strip()


def compact_spaces(value: str) -> str:
    return " ".join(value.split())


def extract_sigla(page_html: str) -> tuple[str, list[str]]:
    match = SIGLA_RE.search(page_html)
    if not match:
        citation_match = INSCRIPTION_RE.search(page_html)
        if citation_match:
            siglum = compact_spaces(strip_tags(citation_match.group(1)))
            return siglum, [siglum]
        return "", []

    main_siglum = compact_spaces(strip_tags(match.group("main")))
    rest_text = compact_spaces(strip_tags(match.group("rest")))
    sigla = [main_siglum] if main_siglum else []
    for part in rest_text.split("|"):
        siglum = compact_spaces(part)
        if siglum and siglum not in sigla:
            sigla.append(siglum)
    return main_siglum, sigla


def load_signature_lookup(db_path: Path) -> dict[str, str]:
    conn = sqlite3.connect(db_path)
    try:
        rows = conn.execute("SELECT signature_text FROM signatures").fetchall()
    finally:
        conn.close()
    return {row[0]: row[0] for row in rows}


def match_signature(sigla: list[str], lookup: dict[str, str]) -> tuple[str, str]:
    for siglum in sigla:
        if siglum in lookup:
            return lookup[siglum], "exact"
    return "", "unmatched"


def fetch_page(url: str, timeout: int) -> tuple[int, str]:
    request = Request(
        url,
        headers={
            "User-Agent": "Rundata audit script; research data link check",
            "Accept": "text/html,application/xhtml+xml",
        },
    )
    with urlopen(request, timeout=timeout) as response:
        raw = response.read()
        charset = response.headers.get_content_charset() or "utf-8"
        return response.status, raw.decode(charset, errors="replace")


def audit_page(find_no: int, html_text: str, http_status: int | str, lookup: dict[str, str]) -> PageAudit:
    url = BASE_URL.format(find_no=find_no)
    main_siglum, sigla = extract_sigla(html_text)
    matched_signature, match_status = match_signature(sigla, lookup)
    has_no_image_marker = "Kein Bild vorhanden" in html_text
    has_image = not has_no_image_marker and "/image-service/" in html_text
    graphtype_ids = set(GRAPHTYPE_RE.findall(html_text))
    has_graphtypes = 'href="#gts"' in html_text or 'id="gts"' in html_text or bool(graphtype_ids)

    if has_graphtypes:
        status = "eligible"
    elif not has_image:
        status = "no_image"
    else:
        status = "image_without_graphtypes"

    return PageAudit(
        find_no=find_no,
        url=url,
        http_status=http_status,
        status=status,
        has_image=has_image,
        has_graphtypes=has_graphtypes,
        graphtype_count=len(graphtype_ids),
        main_siglum=main_siglum,
        all_sigla=sigla,
        matched_signature=matched_signature,
        match_status=match_status,
    )


def write_csv(path: Path, rows: list[PageAudit]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fields = [
        "find_no",
        "url",
        "http_status",
        "status",
        "has_image",
        "has_graphtypes",
        "graphtype_count",
        "main_siglum",
        "all_sigla",
        "matched_signature",
        "match_status",
        "error",
    ]
    with path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fields)
        writer.writeheader()
        for row in rows:
            writer.writerow(
                {
                    "find_no": row.find_no,
                    "url": row.url,
                    "http_status": row.http_status,
                    "status": row.status,
                    "has_image": "yes" if row.has_image else "no",
                    "has_graphtypes": "yes" if row.has_graphtypes else "no",
                    "graphtype_count": row.graphtype_count,
                    "main_siglum": row.main_siglum,
                    "all_sigla": " | ".join(row.all_sigla),
                    "matched_signature": row.matched_signature,
                    "match_status": row.match_status,
                    "error": row.error,
                }
            )


def write_import_candidates(path: Path, rows: list[PageAudit]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(
            fh,
            fieldnames=["signature", "reference_label", "url", "find_no", "main_siglum", "all_sigla"],
        )
        writer.writeheader()
        for row in rows:
            if row.status != "eligible" or row.match_status != "exact":
                continue
            writer.writerow(
                {
                    "signature": row.matched_signature,
                    "reference_label": "Graftyper i denna inskrift.",
                    "url": row.url,
                    "find_no": row.find_no,
                    "main_siglum": row.main_siglum,
                    "all_sigla": " | ".join(row.all_sigla),
                }
            )


def write_unmatched_eligible(path: Path, rows: list[PageAudit]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(
            fh,
            fieldnames=["find_no", "url", "main_siglum", "all_sigla", "graphtype_count"],
        )
        writer.writeheader()
        for row in rows:
            if row.status == "eligible" and row.match_status != "exact":
                writer.writerow(
                    {
                        "find_no": row.find_no,
                        "url": row.url,
                        "main_siglum": row.main_siglum,
                        "all_sigla": " | ".join(row.all_sigla),
                        "graphtype_count": row.graphtype_count,
                    }
                )


def write_new_import_candidates(db_path: Path, report_dir: Path) -> None:
    candidates_path = report_dir / "runesdb_graphtypes_import_candidates.csv"
    new_path = report_dir / "runesdb_graphtypes_new_import_candidates.csv"
    existing_path = report_dir / "runesdb_graphtypes_existing_refs.csv"
    with candidates_path.open("r", encoding="utf-8", newline="") as fh:
        candidates = list(csv.DictReader(fh))

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        existing_refs = conn.execute(
            """
            SELECT s.signature_text, r.text
            FROM meta_information mi
            JOIN signatures s ON s.id = mi.signature_id
            JOIN meta_information_references mr ON mr.metainformation_id = mi.id
            JOIN "references" r ON r.id = mr.reference_id
            WHERE r.text LIKE '%runesdb.de%'
            """
        ).fetchall()
    finally:
        conn.close()

    existing_by_signature: dict[str, list[str]] = {}
    for row in existing_refs:
        existing_by_signature.setdefault(row["signature_text"], []).append(row["text"])

    fields = ["signature", "reference_label", "url", "find_no", "main_siglum", "all_sigla"]
    with new_path.open("w", encoding="utf-8", newline="") as new_fh, existing_path.open(
        "w", encoding="utf-8", newline=""
    ) as existing_fh:
        new_writer = csv.DictWriter(new_fh, fieldnames=fields)
        existing_writer = csv.DictWriter(existing_fh, fieldnames=[*fields, "existing_reference"])
        new_writer.writeheader()
        existing_writer.writeheader()
        for row in candidates:
            refs = existing_by_signature.get(row["signature"], [])
            if any(row["url"].replace("/de/", "/") in ref.replace("/de/", "/") or row["url"] in ref for ref in refs):
                existing_writer.writerow({**row, "existing_reference": " | ".join(refs)})
            else:
                new_writer.writerow(row)


def write_summary(path: Path, rows: list[PageAudit]) -> None:
    counts: dict[str, int] = {}
    for row in rows:
        counts[row.status] = counts.get(row.status, 0) + 1
        counts[f"{row.status}_{row.match_status}"] = counts.get(f"{row.status}_{row.match_status}", 0) + 1
    lines = ["{"]
    for index, key in enumerate(sorted(counts)):
        comma = "," if index < len(counts) - 1 else ""
        lines.append(f'  "{key}": {counts[key]}{comma}')
    lines.append("}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def run(args: argparse.Namespace) -> int:
    db_path = Path(args.db)
    lookup = load_signature_lookup(db_path)
    rows: list[PageAudit] = []
    for find_no in range(args.start, args.end + 1):
        url = BASE_URL.format(find_no=find_no)
        try:
            http_status, page_html = fetch_page(url, args.timeout)
            rows.append(audit_page(find_no, page_html, http_status, lookup))
        except HTTPError as exc:
            rows.append(
                PageAudit(find_no, url, exc.code, "http_error", False, False, 0, "", [], "", "unmatched", str(exc))
            )
        except (URLError, TimeoutError, OSError) as exc:
            rows.append(
                PageAudit(find_no, url, "error", "fetch_error", False, False, 0, "", [], "", "unmatched", str(exc))
            )

        if find_no % args.progress_every == 0:
            print(f"checked {find_no - args.start + 1}/{args.end - args.start + 1}", flush=True)
        if args.delay_ms:
            time.sleep(args.delay_ms / 1000)

    report_dir = Path(args.report_dir)
    write_csv(report_dir / "runesdb_graphtypes_audit.csv", rows)
    write_import_candidates(report_dir / "runesdb_graphtypes_import_candidates.csv", rows)
    write_unmatched_eligible(report_dir / "runesdb_graphtypes_eligible_unmatched.csv", rows)
    write_new_import_candidates(db_path, report_dir)
    write_summary(report_dir / "runesdb_graphtypes_summary.json", rows)

    eligible = [row for row in rows if row.status == "eligible"]
    matched = [row for row in eligible if row.match_status == "exact"]
    print("pages_checked", len(rows))
    print("eligible", len(eligible))
    print("eligible_exact_matches", len(matched))
    print("report_dir", report_dir)
    return 0


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start", type=int, default=1)
    parser.add_argument("--end", type=int, default=1239)
    parser.add_argument("--db", default=str(DEFAULT_DB))
    parser.add_argument("--report-dir", default=str(DEFAULT_REPORT_DIR))
    parser.add_argument("--timeout", type=int, default=20)
    parser.add_argument("--delay-ms", type=int, default=100)
    parser.add_argument("--progress-every", type=int, default=100)
    return parser.parse_args(argv)


if __name__ == "__main__":
    raise SystemExit(run(parse_args(sys.argv[1:])))
