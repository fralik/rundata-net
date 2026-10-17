#!/usr/bin/env python3
"""Read-only, paginated RAÄ image audit. Writes candidate CSVs; never imports."""

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import csv
import hashlib
import json
from pathlib import Path
import re
import sqlite3
import subprocess
import unicodedata
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parents[1]
SEARCH = 'https://arkivsok.raa.se/api/dokumentation/search/advanced'
UUID = re.compile(r'[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}', re.I)


def normalize(value):
    return ' '.join(unicodedata.normalize('NFC', value).split()).casefold()


def document_id(url):
    decoded = unquote(unquote(url))
    match = re.search(r'pub\.raa\.se/(?:visa/)?dokumentation/(' + UUID.pattern + ')', decoded, re.I)
    return match.group(1).lower() if match else ''


def is_raa(url):
    host = urlparse(url).hostname or ''
    return host == 'raa.se' or host.endswith('.raa.se') or (
        host == 'kulturarvsdata.se' and urlparse(url).path.startswith('/raa/'))


def photographic_status(genre, technique):
    genre, technique = normalize(genre), normalize(technique)
    if technique in {'teckning', 'träsnitt', 'litografi', 'etsning', 'kopparstick'}:
        return 'non_photographic'
    if genre == 'fotografi':
        return 'photograph'
    if genre == 'plansch' and technique == 'fotografi':
        return 'photographic_plate'
    if genre == 'plansch':
        return 'needs_photo_review'
    return 'non_photographic'


def is_visual_material(genre):
    """Photographs and drawn/printed illustrations, including mixed plates."""
    return normalize(genre) in {'fotografi', 'teckning', 'plansch', 'tryck'}


def fetch_json(url, cache, body=None):
    key = hashlib.sha256((url + json.dumps(body, sort_keys=True)).encode()).hexdigest()
    path = cache / (key + '.json')
    if path.exists():
        return json.loads(path.read_text())
    command = ['curl', '--fail', '--silent', '--show-error', '--location',
               '--retry', '2', '--retry-delay', '1', '--max-time', '25',
               '--user-agent', 'Rundata-net RAÄ image audit']
    if body is not None:
        command += ['--header', 'Content-Type: application/json', '--data', json.dumps(body)]
    result = subprocess.run(command + [url], capture_output=True, timeout=90)
    if result.returncode:
        raise RuntimeError(result.stderr.decode(errors='replace')[:400])
    data = json.loads(result.stdout)
    path.write_text(json.dumps(data, ensure_ascii=False), encoding='utf-8')
    return data


def search(signature, cache):
    hits, seen_pages = {}, set()
    page = 0
    while True:
        data = fetch_json(SEARCH, cache, {
            'criterias': [{'key': 'runsignum', 'values': [signature]}],
            'contentOption': 'includeAll', 'page': page, 'pagesize': 100,
        })
        results = data['indexResults']
        fingerprint = tuple(hit.get('uri', '') for hit in results)
        if fingerprint in seen_pages and results:
            raise ValueError('Search repeated a page; pagination is incomplete')
        seen_pages.add(fingerprint)
        for hit in results:
            ident = document_id(hit.get('uri', ''))
            if not ident:
                raise ValueError('Search hit lacks a recognized document URI')
            hits[ident] = hit
        total_pages = int(data['totalPages'])
        if page + 1 >= total_pages:
            if len(hits) != int(data['totalElements']):
                raise ValueError('Search result count does not match totalElements')
            return hits
        if not results:
            raise ValueError('Empty page before end of search')
        page += 1


def inspect_document(ident, cache):
    doc = fetch_json('https://pub.raa.se/dokumentation/' + ident, cache)
    attrs = {a['name']: a.get('value', []) for a in doc.get('attributes', [])}
    signa = attrs.get('runsignum', [])
    genre = ' | '.join(attrs.get('genre_form_strikt', []))
    technique = ' | '.join(attrs.get('teknik', []))
    resources = []
    for group in doc.get('resourceGroups', []):
        if group.get('securityLevel') != 'PUBLIC':
            continue
        for resource in group.get('resources', []):
            uri = resource.get('uri', '')
            if resource.get('media', '').startswith('image/') and uri and 'miniatyr' not in uri:
                resources.append((resource, group.get('presentationThumbnailUrl', '')))
    reason = ''
    if doc.get('securityLevel') != 'PUBLIC':
        reason = 'Document is not public'
    elif normalize(genre) == 'arkivvolym':
        reason = 'Archive volume requires separate review'
    elif not resources:
        reason = 'No public full-size image resource'
    resources.sort(key=lambda pair: (
        pair[0].get('format') != 'visning',
        pair[0].get('media') not in ('image/jpeg', 'image/png'),
        pair[0].get('uri', ''),
    ))
    resource, thumbnail = resources[0] if resources else ({}, '')
    return dict(
        document_id=ident,
        link_url=doc.get('presentationLink') or 'https://pub.raa.se/visa/dokumentation/' + ident,
        direct_url=thumbnail,
        image_url=resource.get('uri', ''),
        title=' | '.join(attrs.get('titel', [])),
        description=' | '.join(attrs.get('innehall_beskrivning', [])),
        museum_signa=' | '.join(signa),
        signa=signa,
        genre=genre,
        technique=technique,
        photographic_status=photographic_status(genre, technique),
        license_url=(doc.get('license') or {}).get('license', ''),
        reason=reason,
    )


def write_csv(path, rows, fields):
    with path.open('w', encoding='utf-8-sig', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=fields, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(rows)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--db', type=Path, default=ROOT / 'rundatanet/static/runes/runes.sqlite3')
    parser.add_argument('--province', default='Sö')
    parser.add_argument('--max-total', type=int, default=10)
    parser.add_argument('--unlimited-signum', action='append', default=[],
                        help='Signum exempt from the total-link cap; may be repeated.')
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--cache', type=Path, default=Path('/tmp/rundata-raa-pilot-cache'))
    parser.add_argument('--workers', type=int, default=4)
    parser.add_argument('--limit', type=int, default=0)
    selection = parser.add_mutually_exclusive_group()
    selection.add_argument('--photographs-only', action='store_true',
                        help='Include photographs and photographic plates, excluding drawings and texts.')
    selection.add_argument('--images-only', action='store_true',
                           help='Include photos, drawings and printed illustrations; exclude maps and text material.')
    parser.add_argument('--photo-decisions', type=Path,
                        help='Optional reviewed CSV: document_id, decision (include/exclude), reason.')
    args = parser.parse_args()
    if args.max_total < 1 or args.workers < 1:
        parser.error('Limits must be positive')
    args.output.mkdir(parents=True, exist_ok=True)
    args.cache.mkdir(parents=True, exist_ok=True)
    decisions = {}
    if args.photo_decisions:
        with args.photo_decisions.open(encoding='utf-8-sig', newline='') as stream:
            for row in csv.DictReader(stream):
                if row['decision'] not in {'include', 'exclude'}:
                    parser.error('Photo decisions must be include or exclude')
                decisions[row['document_id']] = row
    db = sqlite3.connect(args.db.resolve().as_uri() + '?mode=ro', uri=True)
    targets = db.execute('''SELECT m.id, s.signature_text FROM meta_information m
        JOIN signatures s ON s.id=m.signature_id
        WHERE s.parent_id IS NULL AND s.signature_text LIKE ? ORDER BY s.signature_text''',
                         (args.province + ' %',)).fetchall()
    if args.limit:
        targets = targets[:args.limit]
    unlimited = {normalize(sig) for sig in args.unlimited_signum}
    unknown = unlimited - {normalize(sig) for _, sig in targets}
    if unknown:
        parser.error('Unlimited signum is not among selected targets: ' + ', '.join(sorted(unknown)))
    existing = {}
    for mid, _ in targets:
        rows = db.execute('SELECT link_url,direct_url FROM runes_imagelink WHERE meta_id=?', (mid,)).fetchall()
        existing[mid] = dict(count=sum(is_raa(link) or is_raa(direct) for link, direct in rows),
                             ids={document_id(url) for row in rows for url in row} - {''})
    db.close()
    errors, searches, docs = [], {}, {}
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(search, sig, args.cache): (mid, sig) for mid, sig in targets}
        for n, future in enumerate(as_completed(futures), 1):
            mid, sig = futures[future]
            try:
                searches[mid] = future.result()
            except Exception as error:
                errors.append(dict(stage='search', signature=sig, document_id='', error=str(error)))
            if n % 50 == 0 or n == len(targets):
                print(f'Searched {n}/{len(targets)} signa; errors={len(errors)}', flush=True)
        # Validate missing documents, including those for signa already at the cap,
        # to keep the audit complete even when no new links may be selected.
        missing_ids = {ident for mid, hits in searches.items() for ident in hits
                       if ident not in existing[mid]['ids']}
        futures = {pool.submit(inspect_document, ident, args.cache): ident for ident in sorted(missing_ids)}
        for n, future in enumerate(as_completed(futures), 1):
            ident = futures[future]
            try:
                docs[ident] = future.result()
            except Exception as error:
                errors.append(dict(stage='document', signature='', document_id=ident, error=str(error)))
            if n % 100 == 0 or n == len(missing_ids):
                print(f'Checked {n}/{len(missing_ids)} missing documents; errors={len(errors)}', flush=True)
    audit, candidates, summaries = [], [], []
    for mid, sig in targets:
        count = existing[mid]['count']
        is_unlimited = normalize(sig) in unlimited
        available = len(searches.get(mid, {})) if is_unlimited else max(0, args.max_total - count)
        eligible = []
        for ident, hit in searches.get(mid, {}).items():
            row = dict(meta_id=mid, signature=sig, document_id=ident, existing_raa_links=count)
            if ident in existing[mid]['ids']:
                row.update(status='existing', title=hit.get('titel', ''), reason='Document already linked')
            elif ident not in docs:
                row.update(status='fetch_error', reason='Document metadata could not be fetched')
            else:
                doc = docs[ident]
                row.update(doc)
                if normalize(sig) not in {normalize(s) for s in doc['signa']}:
                    row.update(status='review', reason='Assigned signum absent from structured runsignum field')
                elif args.images_only and normalize(doc['genre']) in {'karta', 'handskrift', 'arkivvolym'}:
                    row.update(status='excluded_map_or_text', reason='Map or text material excluded by selection')
                elif doc['reason']:
                    row.update(status='review')
                elif args.images_only and not is_visual_material(doc['genre']):
                    row.update(status='review', reason='Unrecognized genre requires visual-material review')
                elif args.photographs_only and ident in decisions:
                    decision = decisions[ident]
                    row['photo_decision_reason'] = decision['reason']
                    if decision['decision'] == 'include':
                        row.update(status='eligible', photographic_status='reviewed_photographic_plate')
                        eligible.append(row)
                    else:
                        row.update(status='excluded_non_photographic', reason=decision['reason'])
                elif args.photographs_only and doc['photographic_status'] == 'non_photographic':
                    row.update(status='excluded_non_photographic', reason='Not photographic material')
                elif args.photographs_only and doc['photographic_status'] == 'needs_photo_review':
                    row.update(status='review', reason='Plate requires a photographic-content decision')
                else:
                    row.update(status='eligible')
                    eligible.append(row)
            audit.append(row)
        eligible.sort(key=lambda row: (len(row['signa']), row['genre'] == 'Plansch',
                                       row['title'], row['document_id']))
        for n, row in enumerate(eligible):
            row['status'] = 'proposed_addition' if n < available else 'over_limit'
            if n < available:
                row['rank'] = n + 1
                candidates.append(row)
        summaries.append(dict(signature=sig, meta_id=mid, existing_raa_links=count,
                              link_limit='unlimited' if is_unlimited else args.max_total,
                              search_hits=len(searches.get(mid, {})),
                              eligible_missing=len(eligible), proposed_additions=min(available, len(eligible)),
                              projected_total=count + min(available, len(eligible)),
                              search_status='ok' if mid in searches else 'error'))
    fields = ['signature', 'meta_id', 'document_id', 'status', 'existing_raa_links', 'rank',
              'link_url', 'direct_url', 'image_url', 'title', 'description', 'museum_signa',
              'genre', 'technique', 'photographic_status', 'photo_decision_reason', 'license_url', 'reason']
    write_csv(args.output / 'proposed-additions.csv', candidates, fields)
    write_csv(args.output / 'all-search-hits.csv', audit, fields)
    write_csv(args.output / 'needs-review.csv', [r for r in audit if r['status'] == 'review'], fields)
    write_csv(args.output / 'over-limit.csv', [r for r in audit if r['status'] == 'over_limit'], fields)
    write_csv(args.output / 'excluded-non-photographic.csv',
              [r for r in audit if r['status'] == 'excluded_non_photographic'], fields)
    write_csv(args.output / 'excluded-maps-and-text.csv',
              [r for r in audit if r['status'] == 'excluded_map_or_text'], fields)
    summary_fields = ['signature', 'meta_id', 'existing_raa_links', 'link_limit', 'search_hits', 'eligible_missing',
                      'proposed_additions', 'projected_total', 'search_status']
    write_csv(args.output / 'per-signum.csv', summaries, summary_fields)
    write_csv(args.output / 'no-search-hits.csv',
              [s for s in summaries if s['search_status'] == 'ok' and s['search_hits'] == 0], summary_fields)
    write_csv(args.output / 'errors.csv', errors, ['stage', 'signature', 'document_id', 'error'])
    stats = dict(signa=len(targets), search_errors=sum(s['search_status'] == 'error' for s in summaries),
                 missing_documents_checked=len(docs), errors=len(errors),
                 proposed_links=len(candidates), affected_signa=len({r['meta_id'] for r in candidates}),
                 proposed_documents=len({r['document_id'] for r in candidates}),
                 already_over_limit=sum(s['existing_raa_links'] > args.max_total for s in summaries),
                 database_changed=False, max_total=args.max_total, photographs_only=args.photographs_only,
                 images_only=args.images_only, unlimited_signa=args.unlimited_signum)
    (args.output / 'summary.json').write_text(json.dumps(stats, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(stats, ensure_ascii=False), flush=True)


if __name__ == '__main__':
    main()
