# RAÄ: Södermanlandspilot, 17 oktober 2026

> Det aktuella urvalet med både fotografier och teckningar finns i `../raa-sodermanland-images-20261017/`. Denna mapp är historiskt underlag.

> Historiskt underlag: detta breda urval har ersatts av fotografiurvalet i `../raa-sodermanland-photos-20261017/`. Använd inte denna mapps förslag för import.

## Resultat

- 460 huvudsignum med prefix `Sö` sökta i RAÄ Arkivsök.
- 813 kopplingar mellan signum och dokument i sökresultaten.
- 607 unika saknade dokument kontrollerade mot dokumentens egna metadata.
- **580 föreslagna nya länkkopplingar för 343 signum**, till 498 unika dokument.
- 102 ytterligare metadataförankrade kopplingar utelämnade från förslaget på grund av tiogränsen.
- 99 kopplingar avskilda för manuell bedömning: 94 arkivvolymer och fem poster utan publik fullstor bildresurs.
- 32 sökträffar var redan länkade till respektive signum.
- 88 signum gav inga träffar i denna sökning.
- Inga sök- eller hämtningsfel.
- **Databasen är inte ändrad.** Detta är ett granskningsunderlag inför import.

## Gränsen på tio länkar

Gränsen gäller befintliga RAÄ-bildlänkposter plus föreslagna nya RAÄ-länkar per signum. Andra bildkällor påverkar inte gränsen. Befintliga kopplingar räknas med även om de inte finns bland de aktuella sökträffarna.

26 signum har redan minst tio RAÄ-länkar och får inga tillägg i förslaget. Av dessa har 19 redan fler än tio; inga befintliga länkar tas bort i piloten. För övriga signum överskrider föreslagna tillägg aldrig tio totalt. Vi fyller inte upp till tio om det inte finns tillräckligt med relevanta träffar.

När inte alla saknade träffar ryms prioriteras dokument med färre angivna signum, därefter andra bildtyper före planscher, därefter titel och dokument-ID. Detta är ett konsekvent urval, inte en visuell kvalitetsbedömning.

## Kontrollmetod

Sökningen använder RAÄ:s strukturerade sökfält `runsignum` och läser samtliga resultatsidor med kontroll mot `totalElements`. Varje saknat dokument hämtas från `https://pub.raa.se/dokumentation/<uuid>`.

För att föreslås måste dokumentet:

1. Ha exakt aktuellt signum i sitt eget strukturerade `runsignum`-fält, efter normalisering av blanksteg, Unicode och versaler.
2. Vara publikt och ha minst en publik fullstor bildresurs.
3. Inte vara en arkivvolym.
4. Saknas på aktuellt signum, jämfört med dokument-ID, även i äldre Arkivsök-länkar med URL-kodad dokumentadress.
5. Rymmas under gränsen på tio totalt.

Delade bilder och planscher kan föreslås för flera signum om dokumentets egna metadata uttryckligen anger dessa. Varje plansch räknas som en dokumentlänk, även när den innehåller flera delbilder. JPG-visningsbild prioriteras framför större arkivformat när sådana finns.

Detta är en metadatakontroll, inte en fullständig visuell identifiering. Material utan rätt indexerat signum, med enbart äldre signum eller bara ortsangivelse kan saknas även efter denna pilot. De befintliga länkarna har räknats och jämförts men inte granskats på nytt för korrekthet.

## Exemplet Sö 82 och Sö 84

RAÄ-dokumentet `9013430b-9222-429e-b615-f5d56f9c48aa` föreslås för båda signum. Titel: *Tumbo kyrkogård. Runsignum Sö 84 och Sö 82*. Beskrivningen anger fem delbilder; bild 2 visar Sö 82 och Sö 84 tillsammans.

https://pub.raa.se/visa/dokumentation/9013430b-9222-429e-b615-f5d56f9c48aa

Sö 82 har en befintlig RAÄ-länk och får tre föreslagna tillägg (totalt fyra). Sö 84 har en befintlig RAÄ-länk och får två föreslagna tillägg (totalt tre).

## Filer

- `proposed-additions.csv`: de 580 föreslagna tilläggen, med signum, numeriskt meta_id, dokument-ID, källänk, miniatyr, bildfil, titel, beskrivning och licens.
- `per-signum.csv`: befintligt antal, sökträffar, saknade relevanta kopplingar, föreslaget antal och beräknad totalsumma för vart och ett av de 460 signumen.
- `all-search-hits.csv`: samtliga 813 sökträffskopplingar med status.
- `needs-review.csv`: de 99 kopplingarna som kräver separat bedömning.
- `over-limit.csv`: de 102 ytterligare kopplingarna som inte ryms under tiogränsen.
- `no-search-hits.csv`: de 88 signum utan träffar.
- `errors.csv`: endast rubrikrad; inga fel uppstod.
- `summary.json`: sammanfattande antal.

CSV-filerna använder UTF-8 med BOM för svenska tecken i Excel. Status och antal beskriver databasen före eventuell import.

## Återkörning

```bash
python3 utility/audit_raa_missing_images.py --province Sö --max-total 10 --output audit/raa-sodermanland-20261017
```

Verktyget öppnar databasen endast för läsning. API-svar cachas i `/tmp/rundata-raa-pilot-cache`; använd en ny `--cache`-mapp för en ny hämtning från RAÄ.

## Verifiering

Fem automatiska tester kontrollerar paginering, upptäckt av upprepade resultatsidor, dokument-ID i kodade länkar, avskiljning av arkivvolymer samt urval med befintliga länkar, exakta signum, delade dokument och oförändrad databas.

Dessutom har hela resultatet kontrollerats för unika par av meta_id och dokument-ID, frånvaro av befintliga dokumentkopplingar bland tilläggen, tiogränsen och att exemplet ovan finns för båda signum.
