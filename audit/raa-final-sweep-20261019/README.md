> Import genomförd 19 oktober 2026: alla 94 aktuella förslag är införda. Sö 170:s borttagna rad 77557 är fortsatt borttagen. Underliggande auditantal beskriver granskningsläget före import.

# Slutkontroll av RAÄ-bildlänkar, 19 oktober 2026

**94 föreslagna nya bildkopplingar för 58 signum**, efter kontroll av återstående databasgrupper samt komplettering av Södermanland från tidigare tiogräns till femtongräns.

| Grupp | Nya bildkopplingar |
|---|---:|
| Södermanland, komplettering | 47 |
| DR-gruppen | 29 |
| Hälsingland | 6 |
| Småland | 6 |
| Medelpad | 3 |
| Bohuslän | 2 |
| Närke | 1 |
| Totalt | 94 |

De återstående 3 412 signumen i 36 grupper gav 47 förslag för 30 signum. De sex tidigare kontrollerade grupperna omfattar 3 403 signum; därmed har samtliga 6 815 huvudsignum i databasen nu omfattats av genomgången. Södermanland har dessutom räknats om efter ändringen från tio till femton. Både svenska och utländska inskrifter ingår i kontrollen.

## Regler

Högst 15 RAÄ-bildlänkposter totalt per signum, befintliga länkar inräknade. Fotografiska planscher prioriteras först. Fotografier, teckningar och tryckta avbildningar får ingå. Kartor, textmaterial och poster utan tillgänglig publik bildfil utesluts.

Undantagen utan antalsgräns för Sö 101, Ög 136 och Vg 119 kvarstår. Inga befintliga länkar har rensats. Alla nya förslag kontrolleras mot strukturerat signum, tillgänglig bildresurs och befintliga dokument-ID:n. Detta är inte en fullständig visuell kvalitetsgranskning eller en garanti att oindexerat arkivmaterial hittats.

Inga sök- eller hämtningsfel återstår. De 35 tillfälliga timeouterna i första omgången för resten av databasen har samtliga lösts genom återförsök.

## Filer och nästa steg

- `proposed-additions.csv`: gemensamt aktuellt importförslag med alla 94 rader, källa, signum, numeriskt meta_id, bildlänkar, metadata och ursprungsrapport.
- `per-group.csv`: alla kontrollerade grupper i detta steg samt Södermanlands komplettering, även grupper utan nya förslag.
- `summary.json`: sammanfattning och underlagsmappar.

Detaljer, fullständiga sökträffar och bortvalda poster finns i `../raa-remaining-20261019/` respektive `../raa-sodermanland-supplement-20261019/`.

**Databasen är uppdaterad med alla 94 förslag.** De nya rad-ID:na finns i underlagsmapparnas `imported-links.csv` och importutfallet i `import-result.json`. Hela förslaget är kontrollerat för dubbletter, rätt signum/meta_id, tillgänglig bildfil, femtongränsen och planschprioriteringen.

## Skärpt signumkontroll efter användarens rättelse

RAÄ-posten `cafd83ba-467a-41f1-ade1-79d60fe6f0ef` har felaktigt DR 32 i sitt strukturerade runsignum men anger DR 328 i titel och samtliga bildbeskrivningar. Förslaget att koppla den till DR 32 är borttaget. Dokumentet finns redan korrekt på DR 328 i databasen; ingen databasändring behövdes för detta fall.

Kontrollen jämför nu även uttryckliga signum i titel och beskrivning och skiljer exempelvis DR 32 från DR 328. Saknat signum i en generell bildtext räknas inte automatiskt som fel, och uttryckliga delade listor/intervall tillåts.

En annan plansch, `79097cc4-01d7-4978-a32c-874e755d35a5`, är tills vidare undanlagd för Sö 47 eftersom titel/beskrivning anger andra signum. Den innehåller också omärkta exempel på lönnrunor; visuell granskning räcker inte för säker identifiering av dessa. Dess befintliga koppling till Sö 170 är markerad för separat granskning men har inte tagits bort. Det är en misstanke, inte ett bekräftat fel. Inga befintliga databasrader har ändrats.

## Slutlig verifiering inför commit

Databasen jämfördes med den fullständiga säkerhetskopian före borttagningen av Sö 170:s länk. Exakt 94 nya bildrader har tillkommit och endast rad 77557 har tagits bort. Alla andra bildrader är identiska. Den felaktiga DR 32-kopplingen finns inte; DR 328:s befintliga korrekta koppling är kvar. Efterkontroll av samtliga importloggar ger 1 124 historiskt importerade kopplingar, varav 1 123 aktiva och en dokumenterat borttagen på användarens begäran. Inga ytterligare avvikelser upptäcktes.
