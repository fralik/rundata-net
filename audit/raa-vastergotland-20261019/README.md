> **Importerad 19 oktober 2026:** 46 nya bildkopplingar för 15 signum. Nedanstående auditantal beskriver läget före import. De nya rad-ID:na finns i `imported-links.csv`, importutfallet i `import-result.json`.

# RAÄ Västergötland: saknade bildlänkar, 19 oktober 2026

## Resultat

- 322 huvudsignum med prefix `Vg` sökta i RAÄ Arkivsök; samtliga resultatsidor kontrollerade.
- 1023 befintliga RAÄ-länkposter för dessa signum i databasen.
- 675 signum/dokumentkopplingar i sökresultaten; 60 unika saknade dokument hämtade och kontrollerade mot egen metadata.
- **46 föreslagna nya bildlänkkopplingar för 15 signum**, till 45 unika RAÄ-poster.
- Materialtyper bland förslagen: {'Tryck': 4, 'Teckning': 1, 'Fotografi': 40, 'Plansch': 1}.
- 1 av förslagen är fotografiska planscher.
- 3 ytterligare relevanta bildkopplingar över femtongränsen, för 2 signum.
- 29 kart-/textkopplingar uteslutna; 0 kopplingar utan tillgänglig bildfil exkluderade; 0 kopplingar kräver separat bedömning.
- 597 sökträffskopplingar finns redan i databasen.
- 103 signum gav inga indexerade träffar.
- 0 kvarstående hämtningsfel.
- **Ingen databasimport har gjorts.**

## Regler och begränsningar

Fotografier, teckningar, bildplanscher och tryckta avbildningar får ingå. Kartor och textmaterial hålls utanför. Exakt aktuellt signum måste finnas i RAÄ-postens strukturerade runsignum och en publik fullstor bildresurs måste vara tillgänglig. Dokument-ID jämförs även mot URL-kodade äldre Arkivsök-länkar för att undvika dubbletter.

Högst **15 RAÄ-bildlänkar totalt per signum**, befintliga länkar inräknade. Fotografiska planscher (Plansch med teknik Fotografi) prioriteras först inom denna gräns, sedan färre angivna signum, titel och dokument-ID. Undantag utan antalsgräns: Vg 119.

8 signum utan undantag har redan minst 15 RAÄ-länkar; 6 av dessa har fler än 15. Dessa befintliga kopplingar lämnas oförändrade och får inga nya förslag. Befintliga länkar har inte granskats på nytt för korrekthet. Undantagna signum får samtliga relevanta nya bildkopplingar oavsett befintligt antal.

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
python3 utility/audit_raa_missing_images.py --province Vg --images-only --max-total 15 --output audit/raa-vastergotland-20261019
```

Vid återkörning med undantag läggs `--unlimited-signum "SIGNUM"` till för varje undantaget signum.

API-svar cachas i `/tmp/rundata-raa-pilot-cache`. Verktyget öppnar databasen endast för läsning. Hela förslaget har kontrollerats för unika meta_id/dokumentpar, rätt signum och numeriskt meta_id, tillgänglig bildfil och miniatyr, frånvaro av befintliga dokumentkopplingar, femtongränsen och prioritet för fotografiska planscher.

## Undantaget Vg 119

Vg 119 är undantaget från antalsgränsen. Signumet har 36 befintliga RAÄ-länkposter till 36 unika dokument. Sökningen gav 32 träffar men inga saknade relevanta bildkopplingar efter kontroll av dokument-ID och materialtyp. Alla befintliga kopplingar lämnas kvar. Att det inte föreslås några tillägg för Vg 119 beror alltså inte på antalsgränsen.

## Genomförd import

Importen gjordes i en gemensam transaktion för Östergötland och Västergötland. Alla föreslagna signum och numeriska meta_id kontrollerades. Inga befintliga bildrader ändrades eller togs bort, inga dubbletter av signum/dokument-ID infördes och inget signum utan undantag passerade 15 RAÄ-länkar; Ög 136 och Vg 119 är undantagna. SQLite integrity_check: ok; inga nya foreign_key_check-avvikelser. Full säkerhetskopia före import finns lokalt på sökvägen i `import-result.json`.
