# Aktuellt RAÄ-urval för Södermanland — 17 oktober 2026

Ersätter de tidigare breda respektive fotografibegränsade förslagen. Användaren har valt att behålla fotografier, fotografiska planscher och rena teckningar, men utesluta kartor och textmaterial. Även tryckta avbildningar som träsnitt och litografier ingår som bildmaterial.

## Resultat

594 föreslagna nya länkkopplingar för 344 signum, till 512 unika RAÄ-poster. Exakta strukturerade signum och tillgång till publik fullstor bild har kontrollerats. Urvalet gäller metadata och innebär inte att varje enskild delbild har granskats visuellt.

Gränsen på tio RAÄ-länkar totalt per signum inkluderar befintliga RAÄ-länkar oavsett deras typ. Befintliga länkar har varken omklassificerats eller tagits bort. Sö 101 är undantaget från antalsgränsen enligt användarens beslut: alla tillgängliga fotografier och ritningar får ingå. Där föreslås 15 nya länkar, utöver 100 befintliga länkposter till 96 unika fotografiska poster. Övriga signum som redan har fler än tio får inga tillägg; inget annat signum passerar tio genom förslaget.

Fotografi, Teckning, Plansch och Tryck godtas som bildmaterial. Karta, Handskrift och Arkivvolym utesluts enligt källans klassificering. Detta hindrar inte att en godkänd blandad plansch även innehåller någon karta eller textdel. Hela arkivvolymer kan innehålla illustrationer, men ingår inte som fristående bildlänkar i detta urval. Okända materialtyper och poster utan användbar bild hålls för separat bedömning.

CSV-filerna innehåller:

- `proposed-additions.csv`: aktuellt importförslag.
- `per-signum.csv`: antal befintliga och föreslagna länkar per signum.
- `all-search-hits.csv`: fullständigt sökunderlag med beslut och metadata.
- `excluded-maps-and-text.csv`: bortvalda kartor och textposter.
- `over-limit.csv`: bildkopplingar som inte ryms under tiogränsen.
- `needs-review.csv`: poster som behöver separat bedömning.
- `no-search-hits.csv`: signum utan indexerade träffar.
- `errors.csv`: inga fel.
- `summary.json`: sammanfattning.

De 594 föreslagna länkarna har importerats till databasen den 17 oktober 2026 på användarens begäran. Inga befintliga bildposter ändrades eller togs bort. Auditfilerna, inklusive `summary.json` och `per-signum.csv`, bevarar läget före import; importutfallet finns i `import-result.json` och de nya rad-ID:na i `imported-links.csv`.

## Återkörning

```bash
python3 utility/audit_raa_missing_images.py --images-only --unlimited-signum "Sö 101" --output audit/raa-sodermanland-images-20261017
python3 -m unittest rundatanet.tests.test_raa_image_audit
```

Sju tester passerar. Dessutom är tiogränsen och unika signum/dokumentpar kontrollerade i hela resultatet, kartor och textposter saknas bland förslagen, och planschen för både Sö 82 och Sö 84 ingår.

## Sö 101: obegränsat bildurval

`so101-proposed-additions.csv` innehåller de 15 nya bildposterna för Sö 101. De befintliga 100 länkposterna har granskats som 96 unika fotografiska poster; metadata finns i `so101-existing-audit.csv`. Inga befintliga länkar väljs bort. Efter en eventuell import blir det 115 länkposter till 111 unika RAÄ-poster för Sö 101. En ytterligare plansch saknar publik fullstor bild och ligger kvar i `needs-review.csv`. Arkivvolymen hålls fortsatt utanför. Importen är nu genomförd; se importutfallet nedan.

## Genomförd import

- 594 nya bildlänkposter för 344 signum.
- Sö 101: 15 nya bildposter, 115 länkposter totalt (111 unika RAÄ-poster).
- Övriga signum höll sig inom tiogränsen för nya tillägg.
- Både Sö 82 och Sö 84 har fått länken till den gemensamma fotografiska planschen.
- Samtliga befintliga bildrader är oförändrade; inga dubbletter av samma signum/dokument-ID infördes.
- Importen genomfördes i en transaktion med kontroll av numeriska meta_id och motsvarande signum. SQLite integrity_check: ok; inga nya foreign_key_check-avvikelser.
- Full säkerhetskopia före import finns lokalt på sökvägen i `import-result.json`.
- `imported-links.csv` innehåller alla 594 nya rad-ID:n och källänkar.
