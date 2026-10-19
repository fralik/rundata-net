import contextlib
import csv
import io
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest.mock import patch

from utility import audit_raa_missing_images as audit
from utility import audit_imported_raa_images as imported_audit


def uuid(number):
    return f'00000000-0000-0000-0000-{number:012d}'


class RaaAuditTests(unittest.TestCase):
    def test_import_verification_recognizes_only_matching_documented_removals(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            folder = root / 'audit/raa-test'
            folder.mkdir(parents=True)
            dbpath = root / 'test.sqlite3'
            db = sqlite3.connect(dbpath)
            db.executescript('''
                CREATE TABLE signatures(id INTEGER, signature_text TEXT);
                CREATE TABLE meta_information(id INTEGER, signature_id INTEGER);
                CREATE TABLE runes_imagelink(id INTEGER, meta_id INTEGER, link_url TEXT, direct_url TEXT);
                INSERT INTO signatures VALUES(1,'Sö 1'),(2,'Sö 2');
                INSERT INTO meta_information VALUES(101,1),(102,2);
            ''')
            rows = [dict(image_id=str(i), meta_id=str(100+i), signature=f'Sö {i}', document_id=uuid(i),
                         link_url='https://pub.raa.se/visa/dokumentation/' + uuid(i),
                         direct_url='https://pub.raa.se/dokumentation/' + uuid(i) + '/visning/1/miniatyr')
                    for i in [1, 2]]
            db.execute('INSERT INTO runes_imagelink VALUES(?,?,?,?)',
                       (2, 102, rows[1]['link_url'], rows[1]['direct_url']))
            db.commit()
            before = list(db.iterdump())
            with (folder / 'imported-links.csv').open('w', newline='') as stream:
                writer = csv.DictWriter(stream, fieldnames=rows[0].keys())
                writer.writeheader()
                writer.writerows(rows)
            removal = {key: value for key, value in rows[0].items() if key != 'image_id'}
            removal['id'] = '1'
            args = ['audit', '--db', str(dbpath), '--cache', str(root / 'cache'), '--output', str(root / 'out')]
            for matches in [True, False]:
                removal['link_url'] = rows[0]['link_url'] if matches else 'https://example.com/wrong'
                with (folder / 'removed-test.csv').open('w', newline='') as stream:
                    writer = csv.DictWriter(stream, fieldnames=removal.keys())
                    writer.writeheader()
                    writer.writerow(removal)
                doc = dict(signa=['Sö 2'], title='Sö 2', description='', image_url='https://pub.raa.se/image')
                with patch('sys.argv', args), patch.object(imported_audit, 'ROOT', root), \
                        patch.object(imported_audit, 'inspect_document', return_value=doc), \
                        contextlib.redirect_stdout(io.StringIO()):
                    imported_audit.main()
                summary = json.loads((root / 'out/summary.json').read_text())
                expected = 'removed_by_request' if matches else 'database_mismatch'
                self.assertEqual(summary['statuses'][expected], 1)
                self.assertEqual(summary['statuses']['text_and_structured_match'], 1)
                self.assertEqual(list(db.iterdump()), before)
            db.close()

    def test_text_conflicts_catch_wrong_metadata_without_substring_matches(self):
        self.assertTrue(audit.has_conflicting_text_signum('DR 32', 'Runsignum DR 328', 'Bild 1: DR 328.'))
        self.assertFalse(audit.has_conflicting_text_signum('DR 328', 'Runsignum DR 328', ''))
        self.assertFalse(audit.has_conflicting_text_signum('Sö 168', 'Runstenar', 'Sö 167 och 168'))
        self.assertFalse(audit.has_conflicting_text_signum('Sö 90', 'Sö 89–91', ''))
        self.assertFalse(audit.has_conflicting_text_signum('DR 303', 'Kamskena av horn', 'Arngunn gav mig kammen.'))
        self.assertTrue(audit.has_conflicting_text_signum('Sö 47', 'Bild 9: Sö 32', ''))

    def test_remaining_groups_exclude_exact_prefix_without_excluding_similar_prefix(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            dbpath = root / 'test.sqlite3'
            db = sqlite3.connect(dbpath)
            db.executescript('''
                CREATE TABLE signatures(id INTEGER, signature_text TEXT, parent_id INTEGER);
                CREATE TABLE meta_information(id INTEGER, signature_id INTEGER);
                CREATE TABLE runes_imagelink(meta_id INTEGER, link_url TEXT, direct_url TEXT);
                INSERT INTO signatures VALUES(1,'G 1',NULL),(2,'Gs 1',NULL),(3,'N 1',NULL),
                    (4,'U 1',NULL),(5,'Sö 1',NULL),(6,'G 1a',1);
                INSERT INTO meta_information VALUES(1,1),(2,2),(3,3),(4,4),(5,5),(6,6);
            ''')
            db.commit()
            before = list(db.iterdump())
            args = ['audit', '--db', str(dbpath), '--output', str(root / 'out'),
                    '--cache', str(root / 'cache'), '--all-provinces',
                    '--exclude-province', 'G', '--exclude-province', 'U', '--exclude-province', 'Sö']
            with patch('sys.argv', args), patch.object(audit, 'search', return_value={}) as search, \
                    contextlib.redirect_stdout(io.StringIO()):
                audit.main()
            self.assertEqual({call.args[0] for call in search.call_args_list}, {'Gs 1', 'N 1'})
            self.assertEqual(list(db.iterdump()), before)
            db.close()

    def test_visual_material_includes_drawings_but_excludes_maps_and_text(self):
        for genre in ['Fotografi', 'Teckning', 'Plansch', 'Tryck']:
            self.assertTrue(audit.is_visual_material(genre), genre)
        for genre in ['Karta', 'Handskrift', 'Arkivvolym', '']:
            self.assertFalse(audit.is_visual_material(genre), genre)

    def test_photographic_plates_are_kept_but_reproduced_drawings_are_not(self):
        self.assertEqual(audit.photographic_status('Plansch', 'Fotografi'), 'photographic_plate')
        self.assertEqual(audit.photographic_status('Fotografi', 'Glas'), 'photograph')
        self.assertEqual(audit.photographic_status('Fotografi', ''), 'photograph')
        self.assertEqual(audit.photographic_status('Fotografi', 'Teckning'), 'non_photographic')
        self.assertEqual(audit.photographic_status('Plansch', 'Träsnitt'), 'non_photographic')
        self.assertEqual(audit.photographic_status('Plansch', 'Tryck'), 'needs_photo_review')
        self.assertEqual(audit.photographic_status('Karta', 'Teckning'), 'non_photographic')

    def test_encoded_archive_link_matches_document_identity(self):
        url = 'https://arkivsok.raa.se/document?uri=https%3A%2F%2Fpub.raa.se%2Fdokumentation%2F' + uuid(1)
        self.assertEqual(audit.document_id(url), uuid(1))

    def test_pagination_reads_beyond_first_page(self):
        pages = [dict(indexResults=[{'uri': 'https://pub.raa.se/dokumentation/' + uuid(i)}],
                      totalPages=2, totalElements=2) for i in [1, 2]]
        with patch.object(audit, 'fetch_json', side_effect=pages) as fetch:
            self.assertEqual(set(audit.search('Sö 1', Path('/unused'))), {uuid(1), uuid(2)})
        self.assertEqual([call.args[2]['page'] for call in fetch.call_args_list], [0, 1])

    def test_repeated_page_is_reported_as_incomplete(self):
        page = dict(indexResults=[{'uri': 'https://pub.raa.se/dokumentation/' + uuid(1)}],
                    totalPages=2, totalElements=2)
        with patch.object(audit, 'fetch_json', return_value=page):
            with self.assertRaisesRegex(ValueError, 'repeated'):
                audit.search('Sö 1', Path('/unused'))

    def test_rounded_down_page_count_does_not_hide_last_page(self):
        def hit(i):
            return {'uri': 'https://pub.raa.se/dokumentation/' + uuid(i)}

        pages = [
            dict(indexResults=[hit(i) for i in range(1, 101)], pageSize=100,
                 totalPages=1, totalElements=101),
            dict(indexResults=[hit(101)], pageSize=1, totalPages=1, totalElements=101),
        ]
        with patch.object(audit, 'fetch_json', side_effect=pages) as fetch:
            self.assertEqual(len(audit.search('Ög 136', Path('/unused'))), 101)
        self.assertEqual([call.args[2]['page'] for call in fetch.call_args_list], [0, 1])

    def test_archive_volume_is_not_an_automatic_candidate(self):
        doc = dict(securityLevel='PUBLIC', attributes=[
            dict(name='runsignum', value=['Sö 1']),
            dict(name='genre_form_strikt', value=['Arkivvolym']),
        ], resourceGroups=[])
        with patch.object(audit, 'fetch_json', return_value=doc):
            result = audit.inspect_document(uuid(1), Path('/unused'))
        self.assertIn('volume', result['reason'])

    def test_import_proposals_respect_existing_links_and_exact_signa(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            dbpath = root / 'test.sqlite3'
            db = sqlite3.connect(dbpath)
            db.executescript('''
                CREATE TABLE signatures(id INTEGER, signature_text TEXT, parent_id INTEGER);
                CREATE TABLE meta_information(id INTEGER, signature_id INTEGER);
                CREATE TABLE runes_imagelink(meta_id INTEGER, link_url TEXT, direct_url TEXT);
                INSERT INTO signatures VALUES(1,'Sö 1',NULL),(2,'Sö 2',NULL);
                INSERT INTO meta_information VALUES(101,1),(102,2);
            ''')
            # Nine existing rows leave one slot under the total cap of ten.
            db.executemany('INSERT INTO runes_imagelink VALUES(?,?,?)', [
                (101, 'https://pub.raa.se/visa/dokumentation/' + uuid(i), '') for i in range(1, 10)
            ])
            db.commit()
            before = list(db.iterdump())
            hits = {uuid(i): {'titel': str(i)} for i in [1, 10, 11, 12]}

            def inspect(ident, cache):
                return dict(document_id=ident, signa=['Sö 10'] if ident == uuid(12) else ['Sö 1', 'Sö 2'],
                            reason='', title=ident, genre='Plansch', image_url='https://pub.raa.se/image')

            args = ['audit', '--db', str(dbpath), '--output', str(root / 'out'),
                    '--cache', str(root / 'cache'), '--max-total', '10']
            with patch('sys.argv', args), patch.object(audit, 'search', return_value=hits), \
                    patch.object(audit, 'inspect_document', side_effect=inspect), \
                    contextlib.redirect_stdout(io.StringIO()):
                audit.main()
            import csv
            with (root / 'out/proposed-additions.csv').open(encoding='utf-8-sig') as stream:
                rows = list(csv.DictReader(stream))
            self.assertEqual(sum(r['signature'] == 'Sö 1' for r in rows), 1)
            self.assertFalse(any(r['signature'] == 'Sö 1' and r['document_id'] == uuid(1) for r in rows))
            self.assertFalse(any(r['document_id'] == uuid(12) for r in rows))
            # A correctly matched shared image can be proposed for both inscriptions.
            self.assertTrue(any(r['signature'] == 'Sö 2' and r['document_id'] == uuid(10) for r in rows))
            self.assertEqual(list(db.iterdump()), before)
            self.assertFalse(json.loads((root / 'out/summary.json').read_text())['database_changed'])
            with patch('sys.argv', args + ['--unlimited-signum', 'Sö 1']), \
                    patch.object(audit, 'search', return_value=hits), \
                    patch.object(audit, 'inspect_document', side_effect=inspect), \
                    contextlib.redirect_stdout(io.StringIO()):
                audit.main()
            with (root / 'out/proposed-additions.csv').open(encoding='utf-8-sig') as stream:
                unlimited_rows = list(csv.DictReader(stream))
            self.assertEqual(sum(r['signature'] == 'Sö 1' for r in unlimited_rows), 2)
            self.assertEqual([r for r in unlimited_rows if r['signature'] == 'Sö 2'],
                             [r for r in rows if r['signature'] == 'Sö 2'])
            self.assertFalse(any(r['document_id'] == uuid(12) for r in unlimited_rows))
            self.assertEqual(list(db.iterdump()), before)
            # At the new default of fifteen, a photographic plate must win the
            # last slot even when a single-signum photograph is also available.
            db.executemany('INSERT INTO runes_imagelink VALUES(?,?,?)', [
                (101, 'https://pub.raa.se/visa/dokumentation/' + uuid(i), '') for i in range(13, 18)
            ])
            db.commit()
            before = list(db.iterdump())

            def inspect_with_photographic_plate(ident, cache):
                row = inspect(ident, cache)
                row['technique'] = 'Fotografi'
                if ident == uuid(11):
                    row.update(genre='Fotografi', signa=['Sö 1'])
                return row

            with patch('sys.argv', args[:-2]), patch.object(audit, 'search', return_value=hits), \
                    patch.object(audit, 'inspect_document', side_effect=inspect_with_photographic_plate), \
                    contextlib.redirect_stdout(io.StringIO()):
                audit.main()
            with (root / 'out/proposed-additions.csv').open(encoding='utf-8-sig') as stream:
                preferred_rows = list(csv.DictReader(stream))
            self.assertEqual([r['document_id'] for r in preferred_rows if r['signature'] == 'Sö 1'],
                             [uuid(10)])
            self.assertEqual(list(db.iterdump()), before)
            db.close()


if __name__ == '__main__':
    unittest.main()
