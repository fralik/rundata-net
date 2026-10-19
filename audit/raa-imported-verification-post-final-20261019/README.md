# Efterkontroll efter slutimporten, 19 oktober 2026

Samtliga RAÄ-importloggar från denna genomgång har jämförts med aktuell databas och sparad RAÄ-metadata.

- 1 124 historiskt importerade kopplingar, för 630 signum.
- 1 123 kopplingar är aktiva och överensstämmer med importloggarna.
- Rad 77557 för Sö 170 är avsiktligt borttagen; borttagningsloggen stämmer med importerad rad och flaggas inte som oväntad databasavvikelse.
- 871 aktiva kopplingar stöds av både strukturerat signum och uttrycklig textreferens.
- 252 aktiva kopplingar har matchande strukturerat signum och ingen motsägelse i texten. Allmänna bildtexter är inte i sig bevis för felaktiga länkar.
- Inga kvarstående konflikter, databasavvikelser, saknade strukturerade signum, saknade bildresurser eller metadatafel i detta urval.

`all-imported-links.csv` innehåller alla historiskt importerade rader. `needs-review.csv` har endast rubrikrad. `removed-by-request.csv` innehåller den dokumenterade borttagningen. `structured-only.csv` är en informationslista, inte en lista med konstaterade fel.

Kontrollen gäller de nya importerna i denna genomgång, inte samtliga äldre RAÄ-länkar. Metadata har återanvänts från de sparade API-svaren. Detta är inte en fullständig visuell kontroll av alla bilder. Själva kontrollverktyget öppnar databasen endast för läsning.

Elva tester passerar, inklusive skydd mot DR 32/DR 328-förväxling och att endast en exakt matchande borttagningslogg accepteras som avsiktlig borttagning. Django systemkontroll och SQLite integrity_check passerar.
