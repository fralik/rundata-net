> Uppdatering: användaren begärde att länken för Sö 170 skulle tas bort. Rad 77557 är nu borttagen; övriga kopplingar till samma dokument är kvar. Nedanstående granskningsresultat beskriver läget före borttagningen.

# Efterkontroll av importerade RAÄ-bildkopplingar, 19 oktober 2026

## Omfattning

Samtliga **1 030 RAÄ-bildkopplingar som importerats i denna genomgång** har dubbelkontrollerats. De gäller 584 signum och 835 unika RAÄ-dokument. De sex importer som omfattas är Södermanland 594, Uppland 240, Öland 70, Gotland fyra, Östergötland 76 och Västergötland 46.

Detta är inte en kontroll av alla äldre RAÄ-länkar i databasen. Urvalet hämtas från samtliga `audit/raa*/imported-links.csv`. Databasraderna har lästs från den aktuella databasen; RAÄ:s dokumentmetadata har återanvänts från de sparade API-svaren i genomgången 17–19 oktober, inte hämtats på nytt.

## Kontroller

För varje importerad rad har följande kontrollerats:

1. Rad-ID, numeriskt meta_id, signum, källänk och miniatyrlänk överensstämmer med importloggen och den aktuella databasen.
2. Dokument-ID överensstämmer mellan källänken och importloggen.
3. Tilldelat signum finns i dokumentets strukturerade runsignum.
4. Titel och bildbeskrivning innehåller inga tydliga motstridiga signum av samma prefix utan stöd för tilldelat signum. Jämförelsen skiljer DR 32 från DR 328 och accepterar uttryckliga gemensamma listor och intervall, exempelvis Sö 311–313.
5. En publik fullstor bildresurs finns.

För de poster som enbart stöds av det strukturerade signumfältet gjordes även en separat sökning efter numeriska signum från databasens samtliga prefix i rubriker/beskrivningar. De enda sådana träffarna var fyra kopplingar där Sö 312/313 ingår i det uttryckliga intervallet Sö 311–313.

## Resultat

- **807 kopplingar** har stöd både i strukturerat signum och uttrycklig exakt textreferens.
- **222 kopplingar** har matchande strukturerat signum utan motstridig bildtext. Fyra av dessa stöds av intervallet Sö 311–313; övriga 218 har mer allmänna bildtexter. Frånvaro av ett uttryckligt signum i bildtexten bevisar inte att länken är fel.
- **En koppling behöver granskas:** Sö 170, rad-ID 77557, dokument `79097cc4-01d7-4978-a32c-874e755d35a5`.
- **Inga avvikelser** mellan importerade rad-ID:n, meta_id/signum, länkar och den aktuella databasen.
- **Inga fel** med saknat strukturerat signum, saknad publik bildresurs eller misslyckad metadatahämtning i detta urval.
- **Databasen har inte ändrats.** Ingen länk har automatiskt tagits bort.

## Sö 170: osäkert, inte bekräftat fel

Planschen har Sö 170 i sitt strukturerade signumfält, men de namngivna inskrifterna i titel och beskrivning anger andra signum. Samma plansch granskades visuellt i fullstor bild i föregående rättelsesteg. Den innehåller flera omärkta lönnruneexempel; det går därför inte att utesluta att något av dessa avser Sö 170 enbart utifrån titel/bildtext. Den befintliga kopplingen lämnas kvar tills motivet kunnat identifieras säkert.

https://pub.raa.se/visa/dokumentation/79097cc4-01d7-4978-a32c-874e755d35a5

Det ännu inte importerade förslaget för Sö 47 till samma plansch är också undanlagt för granskning i slutkontrollens underlag.

DR 32/DR 328-fallet var ett ännu inte importerat förslag och ingår därför inte bland dessa 1 030. Dokumentet finns redan korrekt på DR 328 i databasen. Förslaget för DR 32 är borttaget.

## Filer

- `all-imported-links.csv`: samtliga 1 030 rader, med originalimport, signum och metadataunderlag.
- `needs-review.csv`: endast kopplingen för Sö 170.
- `structured-only.csv`: de 222 kopplingarna utan direkt exakt signumreferens i texten. Detta är inte en lista med bekräftade fel.
- `summary.json`: sammanfattande antal.

## Återkörning

```bash
python3 utility/audit_imported_raa_images.py --output audit/raa-imported-verification-20261019
```

Verktyget öppnar databasen endast för läsning. Med en ny tom `--cache`-mapp hämtas aktuella RAÄ-dokument i stället för de sparade svaren. Rapporten är en kontroll mot metadata och bildtillgänglighet, inte en fullständig visuell verifiering av alla 835 dokument.

## Genomförd borttagning

På användarens uttryckliga begäran togs endast rad 77557 för Sö 170 bort. Hela raden sparas i `removed-so170.csv`, säkerhetskopians sökväg och kontrollutfall finns i `removal-result.json`. Kopplingarna för Sö 32, U 661, U 857 och Ög 136 är kvar. Alla andra bildrader är oförändrade. SQLite integrity_check: ok.
