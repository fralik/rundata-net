> **Importerad 19 oktober 2026:** 47 nya bildkopplingar för 30 signum. Nedanstående auditantal beskriver läget före import. De nya rad-ID:na finns i `imported-links.csv`, importutfallet i `import-result.json`.

# RAÄ: återstående databasgrupper, 19 oktober 2026

## Omfattning och resultat

Samtliga 3 412 återstående huvudsignum i 36 prefixgrupper har sökts i RAÄ Arkivsök. Sö, U, Öl, G, Ög och Vg har uteslutits här eftersom de redan kontrollerats. Dessa sex grupper omfattar 3 403 signum; tillsammans täcker genomgångarna databasens samtliga 6 815 huvudsignum. Det finns inga ytterligare metadataposter kopplade till underordnade aliassignaturer.

- 6 681 befintliga RAÄ-bildlänkposter i de återstående grupperna.
- 1 133 signum/dokumentkopplingar i sökresultaten.
- 88 unika saknade dokument kontrollerade mot metadata och publik bildresurs.
- **47 föreslagna nya bildkopplingar för 30 signum**, till 44 unika RAÄ-poster.
- Förslag per grupp: Bo 2, DR 29, Hs 6, M 3, Nä 1 och Sm 6. De övriga 30 grupperna gav inga importklara nya kopplingar inom reglerna.
- Materialtyper bland förslagen: 25 fotografier, elva teckningar, nio tryckta avbildningar och tre fotografiska planscher.
- Sex ytterligare relevanta bildkopplingar ligger över femtongränsen: Hs tre, J en, Sm en och Vs en.
- 110 kart-/textkopplingar uteslutna, nio kopplingar utan tillgänglig bildfil exkluderade.
- Inga kvarstående kontrollfall eller sök-/hämtningsfel.
- 960 sökträffskopplingar var redan införda i databasen; 3 018 signum gav inga indexerade träffar.
- **Ingen databasimport har gjorts.**

35 sökningar fick tillfälligt timeout i första omgången. Samtliga kördes om med återanvändning av lyckade API-svar och kunde slutföras; återförsöken gav en ytterligare relevant bildkoppling. Inga misslyckade sökningar har behandlats som tomma resultat.

## Urvalsregler

Högst 15 RAÄ-bildlänkposter totalt per signum, befintliga länkar inräknade. Fotografiska planscher (Plansch med teknik Fotografi) prioriteras först. Fotografier, avritningar och tryckta avbildningar får ingå; kartor, textmaterial och poster utan publik fullstor bildresurs utesluts. Några nya undantag har inte begärts för dessa grupper. De tidigare undantagen Sö 101, Ög 136 och Vg 119 ligger i redan granskade grupper.

Exakt aktuellt signum måste finnas i dokumentets strukturerade runsignum. Dokument-ID jämförs med befintliga kopplingar, inklusive äldre URL-kodade Arkivsök-adresser. Alla resultatsidor hämtas, även när RAÄ:s totalPages är nedavrundat i förhållande till totalElements och den första sidans kapacitet.

Befintliga länkar har inte omprövats eller rensats. Ett signum som redan har fler än 15 lämnas oförändrat och får inga nya förslag. Material utan indexerat signum, med enbart äldre signum eller ortsangivelser kan fortfarande saknas trots genomgången. Detta är en metadata- och resurskontroll, inte en visuell kvalitetsbedömning av varje bild.

## Manuella kartbeslut

Tre tidigare kontrollkopplingar har uteslutits enligt tydliga källbeskrivningar:

- DR 344 och DR 345: en osignerad placeringsskiss över runstenarna vid Simris kyrka.
- Sm 121: en karta med förslag till ny placering av runstenen vid Rogberga kyrkogård.

Besluten finns i `manual-decisions.csv`. De grundas på RAÄ:s beskrivning och ska inte tolkas som en visuell bildgranskning. Vid automatisk återkörning behöver besluten återappliceras.

## Filer

- `proposed-additions.csv`: de 47 importförslagen.
- `proposed-additions-by-group.csv`: samma förslag med en extra prefixkolumn.
- `per-group.csv`: samtliga 36 grupper, inklusive grupper utan nya träffar.
- `per-signum.csv`: samtliga 3 412 signum och antalskontroller.
- `scope.csv`: inventering före kontrollen.
- `all-search-hits.csv`: samtliga träffkopplingar med metadata och beslut.
- `over-limit.csv`, `over-limit-per-signum.csv`: bildkopplingar över antalsgränsen.
- `excluded-maps-and-text.csv`, `excluded-without-images.csv`: bortvalda poster.
- `needs-review.csv`, `errors.csv`: endast rubrikrader efter slutförd kontroll.
- `no-search-hits.csv`, `summary.json`: övriga sammanställningar.

## Återkörning

```bash
python3 utility/audit_raa_missing_images.py --all-provinces --exclude-province Sö --exclude-province U --exclude-province Öl --exclude-province G --exclude-province Ög --exclude-province Vg --images-only --max-total 15 --output audit/raa-remaining-20261019
```

API-svar cachas i `/tmp/rundata-raa-pilot-cache`. Verktyget öppnar databasen endast för läsning. Nio tester passerar, inklusive exakt prefixuteslutning (G utesluter inte Gs), hantering av nedavrundat sidantal, femtongränsen och prioritering av fotografiska planscher. Hela förslaget har kontrollerats för unika signum/dokumentpar, rätt numeriskt meta_id, tillgänglig bild/miniatyr och frånvaro av redan befintliga dokumentkopplingar.

## Skärpt signumkontroll efter användarens rättelse

RAÄ-posten `cafd83ba-467a-41f1-ade1-79d60fe6f0ef` har felaktigt DR 32 i sitt strukturerade runsignum men anger DR 328 i titel och samtliga bildbeskrivningar. Förslaget att koppla den till DR 32 är borttaget. Dokumentet finns redan korrekt på DR 328 i databasen; ingen databasändring behövdes för detta fall.

Kontrollen jämför nu även uttryckliga signum i titel och beskrivning och skiljer exempelvis DR 32 från DR 328. Saknat signum i en generell bildtext räknas inte automatiskt som fel, och uttryckliga delade listor/intervall tillåts.

En annan plansch, `79097cc4-01d7-4978-a32c-874e755d35a5`, är tills vidare undanlagd för Sö 47 eftersom titel/beskrivning anger andra signum. Den innehåller också omärkta exempel på lönnrunor; visuell granskning räcker inte för säker identifiering av dessa. Dess befintliga koppling till Sö 170 är markerad för separat granskning men har inte tagits bort. Det är en misstanke, inte ett bekräftat fel. Inga befintliga databasrader har ändrats.

## Genomförd import

Importen gjordes i en gemensam transaktion för resterande grupper och Södermanlands komplettering. Alla föreslagna signum och numeriska meta_id kontrollerades. Inga befintliga bildrader ändrades eller togs bort, inga dubbletter av signum/dokument-ID infördes och inget berört signum passerade 15 RAÄ-länkar. SQLite integrity_check: ok; inga nya foreign_key_check-avvikelser. Full säkerhetskopia före import finns lokalt på sökvägen i `import-result.json`.
