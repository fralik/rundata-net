> **Importerad 19 oktober 2026:** 70 nya bildkopplingar för 55 signum. Nedanstående auditantal beskriver läget före import. De nya rad-ID:na finns i `imported-links.csv`, importutfallet i `import-result.json`.

# RAÄ Öland: saknade bildlänkar, 19 oktober 2026

## Resultat

- 190 huvudsignum med prefix `Öl` sökta i RAÄ Arkivsök; samtliga resultatsidor kontrollerade.
- 646 befintliga RAÄ-länkposter för dessa signum i databasen.
- 306 signum/dokumentkopplingar i sökresultaten; 37 unika saknade dokument hämtade och kontrollerade mot egen metadata.
- **70 föreslagna nya bildlänkkopplingar för 55 signum**, till 24 unika RAÄ-poster.
- Materialtyper bland förslagen: {'Plansch': 61, 'Tryck': 8, 'Fotografi': 1}.
- 54 av förslagen är fotografiska planscher.
- 11 ytterligare relevanta bildkopplingar över femtongränsen, för 4 signum.
- 3 kart-/textkopplingar uteslutna; 1 kopplingar kräver separat bedömning.
- 221 sökträffskopplingar finns redan i databasen.
- 84 signum gav inga indexerade träffar.
- 0 kvarstående hämtningsfel.
- **Ingen databasimport har gjorts.**

## Regler och begränsningar

Fotografier, teckningar, bildplanscher och tryckta avbildningar får ingå. Kartor och textmaterial hålls utanför. Exakt aktuellt signum måste finnas i RAÄ-postens strukturerade runsignum och en publik fullstor bildresurs måste vara tillgänglig. Dokument-ID jämförs även mot URL-kodade äldre Arkivsök-länkar för att undvika dubbletter.

Högst **15 RAÄ-bildlänkar totalt per signum**, befintliga länkar inräknade. Fotografiska planscher (Plansch med teknik Fotografi) prioriteras först inom denna gräns, sedan färre angivna signum, titel och dokument-ID. Inga undantag har begärts för Öland.

10 signum har redan minst 15 RAÄ-länkar; 10 av dessa har fler än 15. Dessa befintliga kopplingar lämnas oförändrade och får inga nya förslag. Befintliga länkar har inte granskats på nytt för korrekthet.

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
python3 utility/audit_raa_missing_images.py --province Öl --images-only --max-total 15 --output audit/raa-oland-20261019
```

API-svar cachas i `/tmp/rundata-raa-pilot-cache`. Verktyget öppnar databasen endast för läsning. Hela förslaget har kontrollerats för unika meta_id/dokumentpar, rätt signum och numeriskt meta_id, tillgänglig bildfil och miniatyr, frånvaro av befintliga dokumentkopplingar, femtongränsen och prioritet för fotografiska planscher.

## Delade fotografiska planscher

Flera Köping- och Hulterstadsposter innehåller delbilder med många olika kyrkofragment. Därför ger 24 nya unika RAÄ-poster 70 signumkopplingar. De delade kopplingarna stöds av explicita signum i RAÄ:s metadata och ofta även av beskrivningen för enskilda delbilder. Delade länkar har inte underkänts enbart på grund av att många signum berörs.

De elva kopplingarna över gränsen gäller Öl 1 (sju), Öl Fv1911;274C (två), Öl 18 (en) och Öl 37 (en).

## Uppdaterad regel: uteslut poster utan bildfil

Poster utan tillgänglig publik fullstor bildresurs ska exkluderas enligt användarens beslut den 19 oktober 2026. 1 tidigare kontrollfall har därför flyttats från `needs-review.csv` till `excluded-without-images.csv` och har status `excluded_no_image` i hela sökunderlaget. Tidigare beskrivningar av dessa som väntande kontrollfall är historiska. Importförslaget är oförändrat, eftersom de inte ingick där. Inga befintliga databasposter har tagits bort.

## Genomförd import

Importen gjordes i en gemensam transaktion för Uppland, Öland och Gotland. Alla föreslagna signum och numeriska meta_id kontrollerades. Inga befintliga bildrader ändrades eller togs bort, inga dubbletter av signum/dokument-ID infördes och inget berört signum passerade 15 RAÄ-länkar. SQLite integrity_check: ok; inga nya foreign_key_check-avvikelser. Full säkerhetskopia före import finns lokalt på sökvägen i `import-result.json`.
