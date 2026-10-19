> **Importerad 19 oktober 2026:** 240 nya bildkopplingar för 105 signum. Nedanstående auditantal beskriver läget före import. De nya rad-ID:na finns i `imported-links.csv`, importutfallet i `import-result.json`.

# Uppland: uppdaterat RAÄ-urval, 19 oktober 2026

Detta urval ersätter importförslaget med tiogräns i `../raa-uppland-20261017/`.

## Nya regler

- Högst **15 RAÄ-bildlänkposter totalt per signum**, befintliga länkar inräknade.
- **Fotografiska planscher prioriteras först**, före andra bilder och före urval efter antal signum. Planscherna räknas inom gränsen, inte som extra länkar utanför den.
- Fotografier, teckningar och tryckta avbildningar får ingå; kartor och textmaterial hålls utanför.
- Undantaget utan antalsgräns för Sö 101 gäller fortsatt i Södermanland; inga Upplandssignum är undantagna.

Fotografiska planscher identifieras med RAÄ:s materialtyp Plansch och teknik Fotografi. Därefter sorteras kandidater efter färre angivna signum, titel och dokument-ID. Prioriteringen gäller nya tillägg i tillgängliga platser; inga befintliga länkar byts ut automatiskt.

## Resultat

**240 föreslagna nya länkkopplingar för 105 signum**, till 223 unika RAÄ-poster. Det är 18 fler kopplingar och åtta fler signum än förslaget med tiogräns. 33 ytterligare relevanta bildkopplingar ligger över femtongränsen.

Alla 1 517 signum har sökts. Samma sparade API-svar från den tidigare kontrollen har använts; detta är en ny beräkning med ändrade regler, inte en helt ny arkivhämtning. Inga kvarstående hämtningsfel.

22 signum har redan fler än 15 RAÄ-länkar och lämnas oförändrade. Befintliga länkar har inte tagits bort eller ersatts, och ingen databasimport har gjorts. Metadata och tillgänglig bildresurs är kontrollerade; samtliga fotografier är inte visuellt granskade.

## Filer

- `proposed-additions.csv`: det aktuella förslaget med 240 tillägg.
- `per-signum.csv`: befintliga antal, föreslagna tillägg, gräns och beräknade totalsummor.
- `all-search-hits.csv`: hela sökunderlaget med status och metadata.
- `over-limit.csv`: de 33 bildkopplingarna utanför antalsgränsen.
- `excluded-maps-and-text.csv`: bortvalda kartor och textposter.
- `needs-review.csv`: material för separat bedömning.
- `no-search-hits.csv`, `errors.csv`, `summary.json`: övrigt granskningsunderlag.

## Återkörning

```bash
python3 utility/audit_raa_missing_images.py --province U --images-only --max-total 15 --output audit/raa-uppland-20261019
```

15 är även verktygets nya standardgräns. Vid en framtida Södermanlandskontroll används dessutom `--unlimited-signum "Sö 101"`.

Sju automatiska tester passerar, inklusive att en fotografisk plansch vinner den sista tillgängliga platsen framför ett fotografi med färre angivna signum. Hela resultatet är kontrollerat för unika meta_id/dokumentpar, antalsgränsen och att inga andra bildtyper valts före fotografiska planscher som hamnat över gränsen. Databasen är oförändrad.

## Uppdaterad regel: uteslut poster utan bildfil

Poster utan tillgänglig publik fullstor bildresurs ska exkluderas enligt användarens beslut den 19 oktober 2026. 1 tidigare kontrollfall har därför flyttats från `needs-review.csv` till `excluded-without-images.csv` och har status `excluded_no_image` i hela sökunderlaget. Tidigare beskrivningar av dessa som väntande kontrollfall är historiska. Importförslaget är oförändrat, eftersom de inte ingick där. Inga befintliga databasposter har tagits bort.

## Genomförd import

Importen gjordes i en gemensam transaktion för Uppland, Öland och Gotland. Alla föreslagna signum och numeriska meta_id kontrollerades. Inga befintliga bildrader ändrades eller togs bort, inga dubbletter av signum/dokument-ID infördes och inget berört signum passerade 15 RAÄ-länkar. SQLite integrity_check: ok; inga nya foreign_key_check-avvikelser. Full säkerhetskopia före import finns lokalt på sökvägen i `import-result.json`.
