> **Importerad 19 oktober 2026:** 76 nya bildkopplingar för 63 signum. Nedanstående auditantal beskriver läget före import. De nya rad-ID:na finns i `imported-links.csv`, importutfallet i `import-result.json`.

# RAÄ Östergötland: saknade bildlänkar, 19 oktober 2026

## Resultat

- 491 huvudsignum med prefix `Ög` sökta i RAÄ Arkivsök; samtliga resultatsidor kontrollerade.
- 1724 befintliga RAÄ-länkposter för dessa signum i databasen.
- 709 signum/dokumentkopplingar i sökresultaten; 57 unika saknade dokument hämtade och kontrollerade mot egen metadata.
- **76 föreslagna nya bildlänkkopplingar för 63 signum**, till 37 unika RAÄ-poster.
- Materialtyper bland förslagen: {'Tryck': 9, 'Fotografi': 3, 'Teckning': 12, 'Plansch': 52}.
- 43 av förslagen är fotografiska planscher.
- 0 ytterligare relevanta bildkopplingar över femtongränsen, för 0 signum.
- 36 kart-/textkopplingar uteslutna; 8 kopplingar utan tillgänglig bildfil exkluderade; 0 kopplingar kräver separat bedömning.
- 589 sökträffskopplingar finns redan i databasen.
- 226 signum gav inga indexerade träffar.
- 0 kvarstående hämtningsfel.
- **Ingen databasimport har gjorts.**

## Regler och begränsningar

Fotografier, teckningar, bildplanscher och tryckta avbildningar får ingå. Kartor och textmaterial hålls utanför. Exakt aktuellt signum måste finnas i RAÄ-postens strukturerade runsignum och en publik fullstor bildresurs måste vara tillgänglig. Dokument-ID jämförs även mot URL-kodade äldre Arkivsök-länkar för att undvika dubbletter.

Högst **15 RAÄ-bildlänkar totalt per signum**, befintliga länkar inräknade. Fotografiska planscher (Plansch med teknik Fotografi) prioriteras först inom denna gräns, sedan färre angivna signum, titel och dokument-ID. Undantag utan antalsgräns: Ög 136.

9 signum utan undantag har redan minst 15 RAÄ-länkar; 9 av dessa har fler än 15. Dessa befintliga kopplingar lämnas oförändrade och får inga nya förslag. Befintliga länkar har inte granskats på nytt för korrekthet. Undantagna signum får samtliga relevanta nya bildkopplingar oavsett befintligt antal.

Detta är en kontroll mot metadata och bildtillgänglighet, inte en fullständig visuell kvalitetsgranskning. Material utan indexerat signum eller med enbart äldre beteckningar/ortsangivelser kan fortfarande saknas.

## Filer

- `proposed-additions.csv`: aktuellt förslag med källänkar, signum, numeriskt meta_id, dokument-ID, bildfil, miniatyr, beskrivning och licens.
- `per-signum.csv`: befintliga och föreslagna antal för varje signum.
- `all-search-hits.csv`: hela underlaget med beslut och metadata.
- `over-limit.csv` och `over-limit-per-signum.csv`: bildkopplingar över antalsgränsen och deras fördelning.
- `excluded-maps-and-text.csv`: bortvalda kartor och textposter.
- `excluded-without-images.csv`: exkluderade poster utan tillgänglig bildfil.
- `needs-review.csv`: kopplingar för separat bedömning.
- `no-search-hits.csv`, `errors.csv`, `summary.json`: övriga sammanställningar.

## Återkörning

```bash
python3 utility/audit_raa_missing_images.py --province Ög --images-only --max-total 15 --output audit/raa-ostergotland-20261019
```

Vid återkörning med undantag läggs `--unlimited-signum "SIGNUM"` till för varje undantaget signum.

API-svar cachas i `/tmp/rundata-raa-pilot-cache`. Verktyget öppnar databasen endast för läsning. Hela förslaget har kontrollerats för unika meta_id/dokumentpar, rätt signum och numeriskt meta_id, tillgänglig bildfil och miniatyr, frånvaro av befintliga dokumentkopplingar, femtongränsen och prioritet för fotografiska planscher.

## Undantaget Ög 136 och slutlig kontroll

Ög 136 har 201 befintliga RAÄ-länkposter till 200 unika dokument. Alla relevanta nya bildkopplingar tillåts enligt användarens undantag: tre nya förslag (ett fotografi, ett tryck och en teckning), vilket skulle ge 204 länkposter efter import. Ingen befintlig länk är ändrad.

RAÄ:s söksvar för Ög 136 angav totalElements 196 och pageSize 100 men totalPages 1. Verktyget har rättats och testats för detta: sidantalet räknas även fram från totalElements och den första sidans kapacitet. Båda sidorna och alla 196 träffar har kontrollerats. Inga kvarstående hämtningsfel finns.

Två träffkopplingar till samma Ritning för Ög 118 och Ög 121 har granskats visuellt i fullstor bild. Den visar en lägeskarta över Slaka kyrkojord och fornlämningar, inte en avritning av ristningarna, och har därför uteslutits som karta. Beslutet finns i `manual-decisions.csv`. Vid återkörning behöver detta manuella beslut återappliceras efter det automatiska urvalet.

Åtta automatiska tester passerar, inklusive felet med nedavrundat sidantal. Databasen är inte ändrad.

## Genomförd import

Importen gjordes i en gemensam transaktion för Östergötland och Västergötland. Alla föreslagna signum och numeriska meta_id kontrollerades. Inga befintliga bildrader ändrades eller togs bort, inga dubbletter av signum/dokument-ID infördes och inget signum utan undantag passerade 15 RAÄ-länkar; Ög 136 och Vg 119 är undantagna. SQLite integrity_check: ok; inga nya foreign_key_check-avvikelser. Full säkerhetskopia före import finns lokalt på sökvägen i `import-result.json`.
