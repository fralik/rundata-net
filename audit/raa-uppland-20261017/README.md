# RAÄ Uppland — kontroll av saknade bildlänkar, 17 oktober 2026

> Importförslaget med femtongräns och prioritet för fotografiska planscher finns i `../raa-uppland-20261019/`. Denna mapp bevarar tiogränsens resultat och kompletterande granskningsunderlag.

## Resultat

- 1 517 huvudsignum med prefix `U` sökta i RAÄ:s Arkivsök.
- 4 552 befintliga RAÄ-bildlänkposter i databasen för dessa signum.
- Samtliga resultatsidor hämtade; 2 831 signum/dokumentkopplingar i sökresultaten.
- 273 unika dokument som saknade minst en koppling hämtade och kontrollerade mot egen metadata.
- **222 föreslagna nya bildlänkkopplingar för 97 signum**, till 213 unika RAÄ-poster.
- Förslagen omfattar 188 fotografier, tio teckningar, elva planscher och tretton tryckta avbildningar.
- 51 ytterligare relevanta bildkopplingar får inte plats under tiogränsen.
- 40 kopplingar uteslutna som kartor eller textmaterial: 36 arkivvolymer, tre kartor och ett dokument.
- Tre kopplingar hålls för separat bedömning: två ritningar som beskrivs som läges-/orienteringsskisser och ett fotografi utan tillgänglig fullstor bildresurs.
- 2 515 sökträffskopplingar finns redan i databasen.
- 235 signum gav inga indexerade träffar i denna sökning.
- Inga kvarstående sök- eller dokumenthämtningsfel. Tillfälliga timeouter löstes genom återkörning från cache; förfrågningstakten har begränsats över samtliga arbetstrådar.
- **Databasen är inte ändrad och inga nya länkar har importerats.**

## Regler

Samma materialurval som i Södermanland: fotografier, teckningar, bildplanscher och tryckta avbildningar får ingå; kartor och textmaterial utesluts. Källans materialklassificering och beskrivning används. Det är en metadatakontroll, inte en fullständig visuell bedömning av varje bild.

Ett förslag kräver exakt aktuellt signum i dokumentets strukturerade `runsignum`, en publik fullstor bildresurs och att dokumentets unika ID inte redan är kopplat till signumet. Äldre URL-kodade Arkivsök-länkar räknas som samma dokument.

Högst tio RAÄ-länkposter totalt per signum, befintliga länkar inräknade. Inga undantag för Uppland har begärts. De 112 signum som redan har minst tio får inga tillägg; av dessa har 76 fler än tio och lämnas oförändrade. Befintliga länkar har inte granskats på nytt för korrekthet eller tagits bort.

När utrymmet inte räcker prioriteras dokument med färre angivna signum, därefter andra bildtyper före planscher, därefter titel och dokument-ID. Detta är ett konsekvent metadataurval, inte en bedömning av bildkvalitet.

Material som saknar indexerat signum eller bara har äldre signum/ortsangivelser kan fortfarande saknas efter denna sökning.

## Exempel på större luckor

| Signum | Befintliga RAÄ-länkar | Nya förslag | Ytterligare över gränsen |
|---|---:|---:|---:|
| U Fv1912;8 | 0 | 10 | 0 |
| U NOR2000;27A | 0 | 10 | 0 |
| U NOR2001;19 | 0 | 10 | 6 |
| U Fv1992;166 | 0 | 8 | 0 |
| U NOR2000;22 | 0 | 8 | 0 |

## Filer

- `proposed-additions.csv`: de 222 föreslagna tilläggen med signum, numeriskt meta_id, dokument-ID, källänk, miniatyr, bildfil, titel, beskrivning, materialtyp och licens.
- `per-signum.csv`: befintliga antal, saknade relevanta kopplingar och föreslagna totaler för alla 1 517 signum.
- `all-search-hits.csv`: alla 2 831 sökträffskopplingar med status.
- `over-limit.csv`: de 51 relevanta bildkopplingarna över tiogränsen.
- `excluded-maps-and-text.csv`: de 40 bortvalda kart-/textkopplingarna.
- `needs-review.csv`: de tre kopplingarna för separat bedömning.
- `no-search-hits.csv`: de 235 signum som saknade träffar.
- `errors.csv`: endast rubrikrad; inga kvarstående fel.
- `summary.json`: sammanfattande antal.

CSV-filerna använder UTF-8 med BOM. Antal gäller länkkopplingar till RAÄ-poster, inte antalet enskilda fotografier på planscher.

## Återkörning och verifiering

```bash
python3 utility/audit_raa_missing_images.py --province U --images-only --output audit/raa-uppland-20261017
python3 -m unittest rundatanet.tests.test_raa_image_audit
```

Verktyget öppnar databasen endast för läsning. API-svar cachas i `/tmp/rundata-raa-pilot-cache`; använd en ny `--cache`-mapp för helt ny hämtning.

Sju tester passerar. Hela förslaget har kontrollerats för unika par av meta_id/dokument-ID, exakt signum, rätt numeriskt meta_id, tillgänglig bild/miniatyr, frånvaro av befintliga dokumentkopplingar och tiogränsen. Databasfilen är oförändrad jämfört med senaste commit.

## Större bildgrupper och kopplingar över gränsen, 18 oktober 2026

De 51 kopplingarna över tiogränsen gäller 15 signum; fördelningen finns i `over-limit-per-signum.csv`. För U NOR2001;19 finns 16 nya relevanta bildkopplingar: tio i importförslaget och sex över gränsen. Övriga 14 signum i denna lista får inga tillägg med nuvarande gräns.

Kompletterande metadata har hämtats för samtliga befintliga unika RAÄ-poster på U 58, U 287 och U 855. Underlaget finns i `largest-existing-image-audit.csv`. Alla dessa poster har publika bildresurser.

- U 58: 63 unika befintliga poster, klassade som 61 fotografier och två planscher. Alla har U 58 i strukturerat runsignum. Tio nya relevanta bildkopplingar skulle ge 73 unika RAÄ-poster totalt.
- U 287: 63 unika befintliga poster, klassade som 61 fotografier och två planscher. 62 har strukturerat U 287; den återstående beskriver uttryckligen “Runstenen U287 i miljön”. Inga nya metadataförankrade träffar i piloten.
- U 855: 47 unika befintliga poster, klassade som 43 fotografier, en teckning och tre planscher. 45 har strukturerat U 855. Två saknar strukturerat signum men har titel U855 Böksta respektive beskriver en Dybeckteckning med inskriften. En av posterna klassad som fotografi beskriver alltså en reproducerad blyertsteckning, vilket också ryms i användarens valda materialurval. Sexton nya relevanta bildkopplingar skulle ge 63 unika RAÄ-poster totalt.

U 58 och U 287 delar inga dokument-ID:n med varandra. Detta är kontroll mot källans metadata och tillgängliga bildresurser, inte en visuell kvalitetsbedömning av varje fotografi. Ingen databaskoppling har ändrats.
