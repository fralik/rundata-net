"""Import image-backed RuneS graphtype references from saved audit reports."""
import csv
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'audit/runesdb_graphtypes'
LABEL = 'Graphtype analysis (RuneS)'


def run():
    rows = []
    for path in [REPORTS / 'runesdb_graphtypes_audit.csv',
                 REPORTS / 'extension_5001_7999/runesdb_graphtypes_audit.csv']:
        with path.open(newline='', encoding='utf-8') as stream:
            rows.extend(csv.DictReader(stream))
    candidates = [r for r in rows if r['has_image'] == 'yes'
                  and r['has_graphtypes'] == 'yes' and r['match_status'] == 'exact']
    conn = sqlite3.connect(ROOT / 'rundatanet/static/runes/runes.sqlite3')
    inserted = 0
    imported = []
    review = []
    with conn:
        for row in candidates:
            if int(row['graphtype_count']) == 0:
                review.append(row)
                continue
            matches = conn.execute('SELECT mi.id FROM meta_information mi JOIN signatures s '
                                   'ON s.id=mi.signature_id WHERE s.signature_text=?',
                                   (row['matched_signature'],)).fetchall()
            if len(matches) != 1:
                review.append(row)
                continue
            imported.append(row)
            url = row['url']
            ref = conn.execute('SELECT id FROM "references" WHERE text=? AND kind=? AND label=?',
                               (url, 'link', LABEL)).fetchone()
            if not ref:
                ref = (conn.execute('INSERT INTO "references" (text,kind,label) VALUES (?,?,?)',
                                    (url, 'link', LABEL)).lastrowid,)
            exists = conn.execute('SELECT 1 FROM meta_information_references '
                                  'WHERE metainformation_id=? AND reference_id=?',
                                  (matches[0][0], ref[0])).fetchone()
            if not exists:
                conn.execute('INSERT INTO meta_information_references '
                             '(metainformation_id,reference_id) VALUES (?,?)',
                             (matches[0][0], ref[0]))
                inserted += 1
    conn.close()
    for name, selected in [('imported_graphtype_references.csv', imported),
                           ('graphtype_references_needing_review.csv', review)]:
        with (REPORTS / name).open('w', newline='', encoding='utf-8') as stream:
            writer = csv.DictWriter(stream, fieldnames=['matched_signature', 'url', 'graphtype_count'])
            writer.writeheader()
            writer.writerows({k: r[k] for k in writer.fieldnames} for r in selected)
    print(f'New reference associations: {inserted}')


if __name__ == '__main__':
    run()
