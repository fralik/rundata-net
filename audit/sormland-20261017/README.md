# Sörmlands museum image-link audit — 2026-10-17

Checked 1,017 database image rows covering 758 distinct museum object pages. All 758 pages were fetched successfully. The report preserves the pre-correction inventory, with removed rows explicitly marked.

## Evidence and limits

Only the object title and `.objectInfo` metadata fields were searched for runic inscription identifiers. Related-object recommendations, navigation, and scripts were excluded. Lists such as “Sö 167 och 168” and short ranges are recognized.

A mentioned signum is supporting evidence, not proof that the stone appears in the photograph: descriptions may mention nearby stones or historical context. An absent or different signum does not prove a wrong link, especially for group photographs. No automatic deletion is based on these statuses.

- `exact_signum_mentioned`: 753 rows; assigned signum is mentioned in the object metadata. Visual verification has not been completed for all of these.
- `different_signum_review`: 92 remaining rows; metadata mentions other signa. Requires review of the photograph and description.
- `no_signum_review`: 170 rows; no recognized signum in object metadata. Requires manual identification, including older/alternative notation where relevant.
- `removed_confirmed_so356`: 2 rows; confirmed incorrect associations removed.

`needs-review.csv` contains the 262 unresolved rows, not 262 confirmed errors. `page-evidence.json` preserves the extracted metadata from every page; `link-audit.csv` includes per-row evidence and status.

## Confirmed correction

Removed image rows 8124 and 8125, both assigned to Sö 356 (meta_id 1040):

- https://sokisamlingar.sormlandsmuseum.se/objects/c24-349801/ — note explicitly identifies Sö 357; caption “Runsten”.
- https://sokisamlingar.sormlandsmuseum.se/objects/c24-363388/ — description identifies the stone at Slottsskolan; note explicitly identifies Sö 357.

Both links remain assigned to Sö 357 (rows 8138 and 8139). Complete removed rows, including original fields, are preserved in `removed-confirmed-so356.csv`. No substitute link for Sö 356 has been established.

Example of a valid shared image preserved: https://sokisamlingar.sormlandsmuseum.se/objects/c24-362154/ explicitly describes “Sö 167 och 168”.

## Verification

SQLite `PRAGMA integrity_check` returned `ok`. Compared all image rows against the pre-correction backup: only IDs 8124 and 8125 were removed, no image rows were added or modified. There are now 1,015 Sörmlands museum image-link rows. No resolver code changed.

Full local database backup: `/tmp/runes.before-sormland-so356-fix-20261017.sqlite3`.

## User-requested removal of 92 additional associations

On 2026-10-17, removed exactly the 92 image rows listed in `different-signum-92.csv`, as explicitly requested by the user. This is a user-directed removal of text mismatches, not a claim that visual review established all 92 to be wrong. Complete deleted database rows are saved in `removed-different-signum-92.csv`. The original audit CSVs preserve their original statuses as historical evidence. The 170 rows without recognized signa were not removed.

Verified all image rows before and after: only the 92 requested IDs were removed; every remaining row is unchanged. SQLite integrity check: ok. Remaining Sörmlands museum image-link rows: 923. Full database backup: `/tmp/runes.before-sormland-remove92-20261017-212644.sqlite3`.
