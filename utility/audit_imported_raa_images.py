#!/usr/bin/env python3
"""Read-only verification of RAÄ image associations recorded in import reports."""

import argparse
from collections import Counter
import csv
import json
from pathlib import Path
import re
import sqlite3

try:
    from .audit_raa_missing_images import (
        ROOT, document_id, has_conflicting_text_signum, inspect_document, normalize,
    )
except ImportError:
    from audit_raa_missing_images import (
        ROOT, document_id, has_conflicting_text_signum, inspect_document, normalize,
    )


def write_csv(path, rows, fields):
    with path.open('w', encoding='utf-8-sig', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=fields, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(rows)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--db', type=Path, default=ROOT / 'rundatanet/static/runes/runes.sqlite3')
    parser.add_argument('--cache', type=Path, default=Path('/tmp/rundata-raa-pilot-cache'))
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    imports = {}
    removals = {}
    for path in sorted((ROOT / 'audit').glob('raa*/removed*.csv')):
        with path.open(encoding='utf-8-sig', newline='') as stream:
            for row in csv.DictReader(stream):
                ident = row.get('id') or row.get('image_id')
                if ident:
                    removals[int(ident)] = dict(row, removal_report=str(path.relative_to(ROOT)))
    for path in sorted((ROOT / 'audit').glob('raa*/imported-links.csv')):
        with path.open(encoding='utf-8-sig', newline='') as stream:
            for row in csv.DictReader(stream):
                ident = int(row['image_id'])
                if ident in imports:
                    raise ValueError(f'Duplicate import report for image ID {ident}')
                imports[ident] = dict(row, import_report=str(path.relative_to(ROOT)))
    db = sqlite3.connect(args.db.resolve().as_uri() + '?mode=ro', uri=True)
    db.row_factory = sqlite3.Row
    documents = {}
    rows = []
    for ident, imported in imports.items():
        row = dict(imported)
        actual = db.execute('''SELECT i.meta_id,i.link_url,i.direct_url,s.signature_text
            FROM runes_imagelink i JOIN meta_information m ON m.id=i.meta_id
            JOIN signatures s ON s.id=m.signature_id WHERE i.id=?''', (ident,)).fetchone()
        removed = removals.get(ident)
        if not actual and removed and removed.get('meta_id') == imported['meta_id'] and \
                removed.get('link_url') == imported['link_url'] and \
                removed.get('direct_url') == imported['direct_url']:
            row.update(status='removed_by_request', reason='Documented removal: ' + removed['removal_report'])
            rows.append(row)
            continue
        if not actual or actual['signature_text'] != imported['signature'] or \
                actual['meta_id'] != int(imported['meta_id']) or \
                document_id(actual['link_url']) != imported['document_id'] or \
                actual['link_url'] != imported['link_url'] or \
                actual['direct_url'] != imported['direct_url']:
            row.update(status='database_mismatch', reason='Database row differs from its import report')
            rows.append(row)
            continue
        doc_id = imported['document_id']
        try:
            if doc_id not in documents:
                documents[doc_id] = inspect_document(doc_id, args.cache)
            doc = documents[doc_id]
        except Exception as error:
            row.update(status='fetch_error', reason=str(error))
            rows.append(row)
            continue
        row.update(doc)
        sig = imported['signature']
        text = doc['title'] + ' ' + doc['description']
        exact = r'(?<!\w)' + re.escape(sig).replace(r'\ ', r'\s*') + r'(?!\w)'
        if normalize(sig) not in {normalize(s) for s in doc['signa']}:
            row.update(status='structured_signum_mismatch', reason='Assigned signum absent from structured metadata')
        elif has_conflicting_text_signum(sig, doc['title'], doc['description']):
            row.update(status='text_conflict_review', reason='Structured signum conflicts with explicit signa in caption; visual/context review required')
        elif not doc['image_url']:
            row.update(status='no_image_review', reason='No public full-size image resource')
        elif re.search(exact, text, re.I):
            row.update(status='text_and_structured_match', reason='Assigned signum supported by structured metadata and explicit text')
        else:
            row.update(status='structured_match_only', reason='Structured signum matches; caption gives no conflicting explicit same-prefix signum')
        rows.append(row)
    db.close()
    fields = ['image_id', 'signature', 'meta_id', 'document_id', 'status', 'reason',
              'title', 'description', 'museum_signa', 'genre', 'technique',
              'link_url', 'direct_url', 'image_url', 'import_report']
    write_csv(args.output / 'all-imported-links.csv', rows, fields)
    write_csv(args.output / 'structured-only.csv',
              [r for r in rows if r['status'] == 'structured_match_only'], fields)
    accepted = {'text_and_structured_match', 'structured_match_only', 'removed_by_request'}
    write_csv(args.output / 'needs-review.csv', [r for r in rows if r['status'] not in accepted], fields)
    write_csv(args.output / 'removed-by-request.csv', [r for r in rows if r['status'] == 'removed_by_request'], fields)
    summary = dict(imported_links=len(rows), unique_documents=len(documents),
                   affected_signa=len({r['meta_id'] for r in rows}),
                   statuses=dict(Counter(r['status'] for r in rows)), database_changed=False)
    (args.output / 'summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == '__main__':
    main()
