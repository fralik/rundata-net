# RAÄ Södermanland: fotografier, 17 oktober 2026

> Det aktuella urvalet med både fotografier och teckningar finns i `../raa-sodermanland-images-20261017/`. Denna mapp är historiskt underlag.

Detta urval ersätter det bredare förslaget i `../raa-sodermanland-20261017/` efter användarens precisering: endast fotografier, inklusive fotografier på planscher. Rena teckningar, kartor och textdokument ska inte ingå. En blandad plansch får innehålla annat material om fotografier också ingår.

## Resultat

- 460 signum sökta; samtliga resultatsidor hämtade.
- 607 unika saknade dokument kontrollerade via RAÄ:s egna metadata.
- **444 föreslagna nya fotografiska länkkopplingar för 309 signum**, till 368 unika RAÄ-poster.
- 440 förslag gäller planscher med teknik Fotografi, tre gäller separata fotografier och ett gäller en blandad plansch med fotografier (Sö 8).
- 166 icke-fotografiska kopplingar bortvalda.
- 72 ytterligare fotografiska kopplingar ryms inte under tiogränsen.
- 99 kopplingar kräver separat bedömning (94 arkivvolymer och fem poster utan publik fullstor bildresurs).
- 32 träffkopplingar finns redan i databasen.
- Inga hämtningsfel. Databasen har inte ändrats.

## Urval

Utöver exakta strukturerade runsignum och en publik bildresurs krävs fotografiskt innehåll. RAÄ:s fält `genre_form_strikt` och `teknik` används tillsammans:

- Fotografi accepteras som separat fotografi, utom när tekniken uttryckligen anger teckning eller en grafisk teknik.
- Plansch med teknik Fotografi accepteras.
- Rena teckningar, träsnitt, litografier, etsningar och kopparstick utesluts, även när själva arkivobjektet är en fotografisk reproduktion.
- Övriga planscher kräver separat bedömning; ordet “Fotograf” i en beskrivning räcker inte eftersom fotografen kan ha reproducerat en teckning.

Fyra planscher med teknik Tryck har bedömts mot sina beskrivningar. Besluten finns i `photo-decisions.csv`. Sö 8 ingår eftersom bild 2 och 3 uttryckligen avser runstenen från flyghöjd 200 meter. De övriga tre har inte belagt fotografiskt motiv och har uteslutits. Detta är bedömningar utifrån källans metadata, inte en fullständig visuell kontroll av varje delbild.

Ditt exempel, `9013430b-9222-429e-b615-f5d56f9c48aa`, ingår för både Sö 82 och Sö 84. Den fotografiska planschen har teknik Fotografi och beskrivningen anger att bild 2 visar båda stenarna.

https://pub.raa.se/visa/dokumentation/9013430b-9222-429e-b615-f5d56f9c48aa

## Gränsen på tio

Befintliga RAÄ-länkar räknas fortsatt in i gränsen på tio totalt, precis som i den första piloten. Befintliga länkar har inte omklassificerats eller tagits bort. De 19 signum som redan har fler än tio lämnas oförändrade och får inga tillägg. Ingen inskrift under gränsen passerar tio genom förslaget.

## Filer

- `proposed-additions.csv`: det aktuella förslaget med 444 tillägg, källänkar, signum, motivbeskrivning, teknik och fotografisk klassificering.
- `per-signum.csv`: antal per signum före och efter föreslagna tillägg.
- `all-search-hits.csv`: hela granskningsunderlaget, inklusive bortvalda träffar.
- `excluded-non-photographic.csv`: de 166 bortvalda icke-fotografiska kopplingarna.
- `over-limit.csv`: de 72 fotografiska kopplingarna över gränsen.
- `needs-review.csv`: de 99 kopplingarna för separat bedömning.
- `photo-decisions.csv`: fyra separata bedömningar av planscher med teknik Tryck.
- `no-search-hits.csv`: signum utan indexerade träffar.
- `errors.csv`: tom fellista.
- `summary.json`: sammanfattande antal.

## Återkörning och verifiering

```bash
python3 utility/audit_raa_missing_images.py --photographs-only --photo-decisions audit/raa-sodermanland-photos-20261017/photo-decisions.csv --output audit/raa-sodermanland-photos-20261017
python3 -m unittest rundatanet.tests.test_raa_image_audit
```

Sex tester passerar. Hela förslaget har dessutom kontrollerats för unika signum/dokumentpar, accepterad fotografisk klassificering, tiogränsen och att den gemensamma planschen finns för både Sö 82 och Sö 84. Verktyget öppnar databasen endast för läsning.
