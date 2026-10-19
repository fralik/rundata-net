> **Importerad 19 oktober 2026:** 4 nya bildkopplingar för 2 signum. Nedanstående auditantal beskriver läget före import. De nya rad-ID:na finns i `imported-links.csv`, importutfallet i `import-result.json`.

# RAÄ Gotland: saknade bildlänkar, 19 oktober 2026

## Resultat

- 423 huvudsignum med prefix `G` sökta i RAÄ Arkivsök; samtliga resultatsidor kontrollerade.
- 6445 befintliga RAÄ-länkposter för dessa signum i databasen.
- 101 signum/dokumentkopplingar i sökresultaten; 23 unika saknade dokument hämtade och kontrollerade mot egen metadata.
- **4 föreslagna nya bildlänkkopplingar för 2 signum**, till 4 unika RAÄ-poster.
- Materialtyper bland förslagen: {'Teckning': 1, 'Tryck': 3}.
- 0 av förslagen är fotografiska planscher.
- 0 ytterligare relevanta bildkopplingar över femtongränsen, för 0 signum.
- 49 kart-/textkopplingar uteslutna; 5 kopplingar kräver separat bedömning.
- 43 sökträffskopplingar finns redan i databasen.
- 368 signum gav inga indexerade träffar.
- 0 kvarstående hämtningsfel.
- **Ingen databasimport har gjorts.**

## Regler och begränsningar

Fotografier, teckningar, bildplanscher och tryckta avbildningar får ingå. Kartor och textmaterial hålls utanför. Exakt aktuellt signum måste finnas i RAÄ-postens strukturerade runsignum och en publik fullstor bildresurs måste vara tillgänglig. Dokument-ID jämförs även mot URL-kodade äldre Arkivsök-länkar för att undvika dubbletter.

Högst **15 RAÄ-bildlänkar totalt per signum**, befintliga länkar inräknade. Fotografiska planscher (Plansch med teknik Fotografi) prioriteras först inom denna gräns, sedan färre angivna signum, titel och dokument-ID. Inga undantag har begärts för Gotland.

38 signum har redan minst 15 RAÄ-länkar; 36 av dessa har fler än 15. Dessa befintliga kopplingar lämnas oförändrade och får inga nya förslag. Befintliga länkar har inte granskats på nytt för korrekthet.

Detta är en kontroll mot metadata och bildtillgänglighet, inte en fullständig visuell kvalitetsgranskning. Material utan indexerat signum eller med enbart äldre beteckningar/ortsangivelser kan fortfarande saknas.

## Filer

- `proposed-additions.csv`: aktuellt förslag med källänkar, signum, numeriskt meta_id, dokument-ID, bildfil, miniatyr, beskrivning och licens.
- `per-signum.csv`: befintliga och föreslagna antal för varje signum.
- `all-search-hits.csv`: hela underlaget med beslut och metadata.
- `over-limit.csv` och `over-limit-per-signum.csv`: bildkopplingar över antalsgränsen och deras fördelning.
- `excluded-maps-and-text.csv`: bortvalda kartor och textposter.
- `needs-review.csv`: kopplingar för separat bedömning.
- `no-search-hits.csv`, `errors.csv`, `summary.json`: övriga sammanställningar.

## Återkörning

```bash
python3 utility/audit_raa_missing_images.py --province G --images-only --max-total 15 --output audit/raa-gotland-20261019
```

API-svar cachas i `/tmp/rundata-raa-pilot-cache`. Verktyget öppnar databasen endast för läsning. Hela förslaget har kontrollerats för unika meta_id/dokumentpar, rätt signum och numeriskt meta_id, tillgänglig bildfil och miniatyr, frånvaro av befintliga dokumentkopplingar, femtongränsen och prioritet för fotografiska planscher.

## De fyra föreslagna tilläggen

- G 280: en osignerad teckning samt ett tryckt bildark där G 280 uttryckligen anges som bild 2. G 280 har fem befintliga RAÄ-länkar och skulle få sju totalt.
- G 92: två separata poster med osignerade frottage. G 92 saknar befintliga RAÄ-länkar och skulle få två totalt.

Fem fotografiska poster för G 106, G 114 (två poster), G 134 och G 135 saknar bildresurser i RAÄ:s dokumentmetadata. De finns i `needs-review.csv` och har inte räknats som importklara. Detta är inte ett sökfel: metadata kunde hämtas men någon publik fullstor bild fanns inte angiven.

## Uppdaterad regel: uteslut poster utan bildfil

Poster utan tillgänglig publik fullstor bildresurs ska exkluderas enligt användarens beslut den 19 oktober 2026. 5 tidigare kontrollfall har därför flyttats från `needs-review.csv` till `excluded-without-images.csv` och har status `excluded_no_image` i hela sökunderlaget. Tidigare beskrivningar av dessa som väntande kontrollfall är historiska. Importförslaget är oförändrat, eftersom de inte ingick där. Inga befintliga databasposter har tagits bort.

## Genomförd import

Importen gjordes i en gemensam transaktion för Uppland, Öland och Gotland. Alla föreslagna signum och numeriska meta_id kontrollerades. Inga befintliga bildrader ändrades eller togs bort, inga dubbletter av signum/dokument-ID infördes och inget berört signum passerade 15 RAÄ-länkar. SQLite integrity_check: ok; inga nya foreign_key_check-avvikelser. Full säkerhetskopia före import finns lokalt på sökvägen i `import-result.json`.
