======================
Data in the database
======================

.. module:: rundata.database

The data in the database can be split into two conceptual categories:

#. meta information about runic inscription. This includes object description on which the inscription is located: where the object had been found, inscription style, e.t.c.
#. inscription text. This includes the text of inscription in several forms.

Besides conceptual categories, data is split into individual categories (properties or fields). Each category describes one aspect of inscription. For example, :samp:`Found location` describes the found location of an object on which runic inscription had been carved.

Rundata-net presents all data to user. It is possible to display it and search through it by means of individual categories.

.. _meta-information:

Meta information
----------------

Meta information is by definition an information about something. In case of Rundata-net it is information about inscription.

First there is a block of geographical data:

* Found location. Text description of find location.
* Parish. Name of `parish <https://en.wikipedia.org/wiki/Parish>`_ where inscription had been found.
* District. District name where inscription had been found.
* Municipality. Municipality name where inscription had been found.
* Current location. Text description of inscription's current location. For example, in museum.

Values of these fields have different meaning for different countries. For example, district in Sweden is *härad* as a rule. Whereas district in Norway is *fylke*. For Denmark this field also includes region: Nørrejylland, Sjælland or Skåne.

* Coordinates. Find location coordinates. This field is not searchable and visible directly. Instead, if coordinates are given, the object is shown on :ref:`map-info`.
* Original site. Contains usually "ja" (yes) or "nej" (no), which denotes certainty that inscription has remained located at its original site. The specification of the original site can also be entered in plain text, for example "50 m S om nuvarande plats" (50 meter S of present location) or "Ryllagården".
* Parish code or ancient monument number. For Swedish inscriptions parish code is given according to the registry of town and parishes from Riksantikvarieämbetet. As first parish code the parish (according to the map layer for parishes from Riksantikvarieämbetet) for the oldest known place. When several ancient monument numbers are specified, the order between them typically are original site/find place followed by current place. For Swedish inscriptions ancient monument number comes from the register (FMIS) at Riksantikvarieämbetet, for Danish inscriptions Sted- og lokalitetsnummer are specified according to the Danish Kulturstyrelsen and for Norwegian inscriptions lokalitetsnummer are specified according Riksantikvarens web site Kulturminnesøk.
* Rune type. Short description of rune type. For example short-twig runes (kortkvistrunor), staveless runes (stavlösa runor), reversed runes (vändrunor), cryptic runes (lönnrunor).
* Cross form. Cross form information according to L Lager's classification system for Scandinavian runestones.
  The system of classification is made of seven groups of variables (A to G) that deal with different aspects of cross design. Each group has a number of variables (between four and eleven). Description of cross is given by a set of all groups and variables that are relevant to the cross. For example, A1, B3, C4, D1, E6, E10, F3, G6 is an example of a single cross description. See figure :ref:`Linn Lager’s classification system <fig-cross-styles>` for the overview. More information about this flexible system of classification can be obtained from the thesis by Linn Lager titled *Den synliga tron. Runstenskors som en spegling av kristnandet i Sverige* (The Visible Faith. Runestone crosses as reflections of the Christianisation of Sweden) (OPIA 31, Uppsala 2002).

    #. Group A describes the design of the centre of the cross - that is the basic construction of the cross. The group consists of nine different variables and every cross has to have one of these variables.
    #. Group B describes the overall shape of the cross and consists of four different variables. Every cross has to be ascribed one of these variables.
    #. Group C deals with those crosses that are attached to the runic band in one or several places, or when the cross has some kind of base or foot. This group consists of eleven variables. Since not all crosses are attached to the runic band nor have a base of some sort, some crosses have the number 0 in this place. On the other hand some crosses are attached to the runic band in several places and consequently have to be classified with several variables from this group.
    #. Group D describes the shape of the outer part of the cross-arm and consists of six different variables. Since some crosses have different designs on different cross-arms, some crosses have to be classified through the usage of several variables.
    #. Group E describes different types of ornamental decoration and consists of eleven variables. Since many of these variables often are used in combination with others from the same group, it is common that crosses are classified through the usage of several variables from this group. However, some crosses lack additional decorative elements and these crosses have the number 0 in this place.
    #. Group F describes the width of the cross-arms – the thickness of the cross. It consists of four different variables and every cross has to be ascribed one of these.
    #. Group G deals with those crosses that have one or several runes on one or several parts of the cross. The group consists of six variables. Since this feature is quite rare most crosses have the number 0 in this place.

  A combination of cross group and variable is referred to as *cross form*.
  The way cross descriptions are written in Rundata, there are two additions to the above described system:

    * There can be uncertainty in cross form definition. Uncertainties are clearly marked in the database.
    * Not all crosses are classified according to Lager's classification. Some crosses are described by textual description.

* Dating. Contains :samp:`U` (pre-Viking), :samp:`V` (Viking) or :samp:`M` (Medieval) for the period, if possible with a more exact time designation, for example :samp:`V 800`.
* Style. Style grouping information (Pr1-Pr5, Fp, KB, RAK) according to A-S Gräslund’s chronological system for Viking Age runestones. The runestone material from the Mälar valley has been dated by A-S Gräslund, and other runestones by A-S Gräslund & L Lager in cooperation. Possible styles are depicted on figure :ref:`figure-styles`.
* Carver. Contains carver's name who signed inscription or carver's name to whom inscription is attributed. After the name, one of the letters below will be given in parentheses with the following meaning:
    * (S), the inscription is signed by this rune-carver.
    * (A), the inscription is attributed to this rune-carver.
    * (P), the stone is one of a pair and its mate was signed by this rune-carver.
    * (L), the inscription is like inscriptions signed by or attributed to this rune-carver.

* Material. Material contains information about the material, for example rock (often with colour), species, type of metal e.t.c. Examples are bone (ben), lead (bly), bronze (brons), pine (furu), [gray course-grained (grå, grovkornig), light (ljus), red (röd), reddish-gray (rödgrå)] granite (granit), gray stone (gråsten), gold (guld), lime plaster (kalkputs), [brown violet (brunviolett), gray (grå), light gray (ljusgrå)] limestone (kalksten), cattle (nötkreatur), [gray (grå), light red (ljusröd), red (röd)] sandstone (sandsten), silver (silver), brick (tegel) and wood (trä).
* Material type. Contains one of the following values:
    * bone/antler (ben/horn)
    * metal (metall)
    * plaster (puts)
    * stone (sten)
    * wood (trä)
    * other (övrigt)
    * unknown (okänd)

* Object information. Contains information about type of object, for example flat rock (berghäll), bracteate (brakteat), grave-slab (gravhäll), coin (mynt), stick (pinne), plaster inscription (putsinskrift), "rune bone, rib" ("runben, revben"), runestone (runsten), wood inscription (träinskrift).
* Other. This field contains a great collection of miscellaneous information, for example on figures, finding number at an archaeological excavation, when inscriptions or parts of inscription were discovered or recovered, information on pairs of stones, whether inscription is in the futhark, information on paint traces, about inscriptions with missing runes (purely ornamental), inscriptions in Latin, nonsense inscriptions, relief carving, etc.

* Reference. Contains references about inscription. For example cross-references to where you can find unpublished inscriptions, but primarily all references to sources for inscriptions in this database (enter using code $=), for example :samp:`$=Wessén 1958:24`.

* Is lost? A flag indicating if inscription has been lost.
* New reading? A flag indicating new reading or new interpretation, i.e. reading or interpretation has been completed from a later source than the source indicated in the signature.
* Is pure ornamental? A flag indicating whether inscription is pure ornamental or not.
* Is recent? A flag indicating if inscription is from recent time. As a rule, the reading will be specified under field Other. Genuine post-medieval inscriptions dated to about year 1600 have reading and interpretations in :ref:`inscription texts <inscriptions-texts>`.

.. _figure-styles:

.. figure:: /_static/stilgruppering2.jpg
    :width: 50%
    :alt: Style groups according to A-S Gräslund’s system for Viking Age runestones

    Style groups according to A-S Gräslund’s system for Viking Age runestones

.. _fig-cross-styles:

.. figure:: /_static/cross_classification.gif
    :width: 50%
    :alt: Linn Lager’s classification system, drawings Alicja Grenberger

    Linn Lager’s classification system, drawings Alicja Grenberger

.. _inscriptions-texts:

Inscription texts
-----------------

Each inscription has several texts related to it. Texts could have special symbols that clarify text meaning. Special symbols markup is inherited from Rundata database.

.. important::

    Transliterated and normalized texts have a very special structure. They contain the same number
    of words and the position of words is kept in order. This means that word 2 in one inscription
    is the same in transliteration and normalization. Let's have a look at Öl 10. It's transliterated
    text begins with `[: eimunr : auk : kuna- ... þeiR · -uku`. Normalization to Old West Norse is
    `"Eimundr ok "Gunna[rr] ... þeir [k]uml(?)` and normalization to Old Scandinavian is
    `"Æimundr ok "Gunna[rr] ... þæiR [k]umbl(?)`. Word 2 is `auk`, and `ok` in transliteration and
    normalizations correspondingly. Word 3 is `kuna-` and `Gunna[rr]`. And so on.

The property of word correspondence is very important. Rundata-net supports two search modes:

* Search across words when word boundaries and correspondence are taken into account. This is the mode available
  under :guilabel:`Sök i text` (:guilabel:`Search in text` in the English version) in Rundata.
  In Rundata-net, such search is used when user searches with :guilabel:`matches across words`
  operator (see, :ref:`searching-word-search`).
* Search in the inscription texts as a whole without taking word boundaries and correspondence into
  account. This can be seen as default search mode and it is availble with all other search operators
  in Rundata-net. In original Rundata, the similar searches are availble through menu
  :menuselection:`Selection --> New inscription parameter --> (Runic) text`, where (Runic) can be replaced
  with the type of runic text you are interested in.

Transliterated runic text
^^^^^^^^^^^^^^^^^^^^^^^^^

This is the pure runic inscription, transliterated. One example is :samp:`sirkir × resþi × stin × þana × eftR × karna`. Here is the table that lists all transliterations and corresponding period that they occur. Transliterations are strictly consistent within each time period, with a few regional exceptions in Medieval group.

+----------------+------------+------------+------------------+
|Transliteration | pre-Viking | Viking Age | Medieval         |
+================+============+============+==================+
| a              | ᚫ          | ᛅ          | ᛆ                |
+----------------+------------+------------+------------------+
| A              | ᛋ, ᚼ       | ᚼ          | ᛆ                |
+----------------+------------+------------+------------------+
| b              |                 ᛒ                          |
+----------------+------------+------------+------------------+
| c              |            |            | ᛌ, ᛋ             |
+----------------+------------+------------+------------------+
| d              | ᛞ          | ᛑ                             |
+----------------+------------+------------+------------------+
| D              |            | ᛞ          |                  |
+----------------+------------+------------+------------------+
| ð              |            | |runadh|                      |
+----------------+------------+------------+------------------+
| e              | ᛖ          | ᚽ                             |
+----------------+------------+------------+------------------+
| E              | ᛖ                                          |
+----------------+------------+------------+------------------+
| f              | ᚠ                                          |
+----------------+------------+------------+------------------+
| g              | ᚷ          | ᚵ                             |
+----------------+------------+------------+------------------+
| G              |            | ᚷ          | |runagstor|      |
+----------------+------------+------------+------------------+
| h              | ᚺ          | ᚼ                             |
+----------------+------------+------------+------------------+
| H              |            | ᚺ                             |
+----------------+------------+------------+------------------+
| i              | ᛁ                                          |
+----------------+------------+------------+------------------+
| ï              | ᛇ          |                               |
+----------------+------------+------------+------------------+
| j              | ᛃ          |                               |
+----------------+------------+------------+------------------+
| k              | ᚲ          | ᚴ                             |
+----------------+------------+------------+------------------+
| l              | ᛚ                                          |
+----------------+------------+------------+------------------+
| L              | |runalstor|                                |
+----------------+------------+------------+------------------+
| m              | ᛗ          | ᛘ                             |
+----------------+------------+------------+------------------+
| M              |            | ᛗ                             |
+----------------+------------+------------+------------------+
| ñ              | ᛜ          |                               |
+----------------+------------+------------+------------------+
| n              | ᚾ                                          |
+----------------+------------+------------+------------------+
| N              |  |runanstor1|, |runanstor2|                |
+----------------+------------+------------+------------------+
| o              | ᛟ          | |runao|    | |runaomed|       |
+----------------+------------+------------+------------------+
| O              |            | ᛟ                             |
+----------------+------------+------------+------------------+
| ô              |            |            | ᚯ                |
+----------------+------------+------------+------------------+
| p              | ᛈ          | ᛔ, |runapmed2|                |
+----------------+------------+------------+------------------+
| r              | ᚱ                                          |
+----------------+------------+------------+------------------+
| R              |            | ᛦ, for Norwegian see y; z     |
+----------------+------------+------------+------------------+
| s              |  ᛊ         | ᛋ, for Norwegian ᛌ            |
+----------------+------------+------------+------------------+
| t              | ᛏ                                          |
+----------------+------------+------------+------------------+
| þ              | ᚦ                                          |
+----------------+------------+------------+------------------+
| u              | ᚢ                                          |
+----------------+------------+------------+------------------+
| v              |            |            | |runav|          |
+----------------+------------+------------+------------------+
| w              | ᚹ          |                               |
+----------------+------------+------------+------------------+
| y              |            | ᚤ, for Norwegian ᛦ            |
+----------------+------------+------------+------------------+
| Y              |            |            | Norwegian ᚤ      |
+----------------+------------+------------+------------------+
| z              | ᛘ          |                               |
+----------------+------------+------------+------------------+
| æ              |            |            | ᛆ                |
+----------------+------------+------------+------------------+
| ø              |            |            | ᚯ, |meashoweoe2| |
+----------------+------------+------------+------------------+

Some characters in transliterated text have special meaning. These special characters are presented to user during display, but they are not included for search.

Punctuation:

* :samp:`·` = |skpunkt|
* :samp:`:` = |skkolon|
* :samp:`×` = |skkryss|
* :samp:`¤` = |sk2kolon|
* :samp:`'` = |skkortstr|
* :samp:`+` = |skplus|
* :samp:`÷` = all other punctuation

Special characters:

* ñ = |runangtrans|, i.e. the rune with variants in the 24-character futhark.
* ô = |omedhake|, i.e. the rune ᚯ in the Maeshowe inscriptions from Orkney. In medieval inscriptions, ᚯ is transliterated as ø but in the Maeshowe inscriptions, the special variant |meashoweoe2| is transliterated as ø.
* ( ) = damaged rune which can be read with some certainty.
* [ ] = series of lost runes which can be supplied from another source.
* { } = Latin majuscule. For the sake of clarity, these are also written in capitals in the transliterated text.
* < > = runic cipher which has been solved.
* \- = a sign, most often a rune, which cannot be defined but is part of the inscription.
* ? = indefinable sign, either a non-rune or an insoluble bind-rune.
* ... = damaged area in an inscription where runes are presumed to have been.
* ^ = bind-rune. For example, the bind-rune  is transliterated :samp:`a^f`. A bind-rune can connect the end of one word with the beginning of another. For example,  (ræisa stæin) is transliterated :samp:`risa^ ^stin`.
* \| = double-duty rune. Because the database works on the basis of word-for-word comparisons, a series of runes such as  (ok Guðs) must be split into two words: auk\| \|kuþs.
* / = variant readings. If the reading of runes in a word is doubtful, the possible variants are given divided by a slash.
* §A, §B (etc.) = different sides of the object bearing the inscription. Sides are displayed as a list, but can can be search for by §A, §B (etc.).
* §P (etc.) = variant readings involving more than a single word; §P, §Q (etc.) is then included in the normalised text as well.
* ¶ = new line in the inscription.
* ¶¶ = One word spans two sides of object. For technical reasons, it is not possible to put a side notation such as §B in the middle of a word. Instead, the side notation is located before or after the word which spans two sides of a stone and the place the word is broken is marked by two line break symbols.

Search normalization removes most of the special characters. Some examples:

* :samp:`[...(r) : sin : ste(i)... ...]` becomes :samp:`...r sin stei... ...`.

* Record like this::

    §A + s-a... --(s)- i(a)s · satr · aiftir · si(b)(a) · kuþa · sun · fultars · in hons ·· liþi · sati · at · u · -ausa-þ-... +: fulkin : likr : hins : fulkþu : flaistr (:)· uisi · þat · maistar · taiþir : tulka · þruþar : traukr : i : þaimsi · huki · munat : raiþ:uiþur : raþa : ruk:starkr · i · tanmarku : --ntils : iarmun··kruntar : urkrontari : lonti §B {÷ IN| |NONIN- ¶ + HE... ...}

  becomes::

    §A s-a... --s- ias satr aiftir siba kuþa sun fultars in hons liþi sati at u -ausa-þ-... fulkin likr hins fulkþu flaistr uisi þat maistar taiþir tulka þruþar traukr i þaimsi huki munat raiþuiþur raþa rukstarkr i tanmarku --ntils iarmunkruntar urkrontari lonti §B IN NONIN- HE... ...

Normalised runic text
^^^^^^^^^^^^^^^^^^^^^

Inscription text is normalised to Old West Norse and Old Scandinavian by country (including Runic Swedish and Runic Danish).

Normalisation to Old West Norse is rather strict, meaning that the many changes which certain pronouns, such as Runic Swedish masculine accusative singular þanna/þanni/þannsa/þannsi/þenna/þenni/þennsa/þennsi all have the normalised form þenna. The advantage of this strict normalisation is that you can search for a certain word throughout the entire database. An exception to this is the proto-Scandinavian inscriptions, which are not consistently normalised to Old West Norse.

A difficulty in normalising to Old West Norse has been the fact that there are many personal names in the Swedish and Danish inscriptions which have no recorded counterparts in Old West Norse. Example: in Swedish Viking-Age inscriptions, a certain name appears four times which is believed to be a form of the Celtic Ceollach. It is written **guilakr**, **kiulai...**, **kiulakr**, **kiulak** and normalised in *Sveriges runinskrifter* as (nom.) *Giulakᛦ, Kiulakᛦ*. To make the name "recognisable" in Old West Norse form, it has been normalised as *Kjallakr/Kjullakr*. *Kjallakr* is actually the form the borrowed Celtic name was given in Old West Norse sources; *Kjullakr* is an approximated form.

Normalisation for Old Scandinavian for Sweden and Denmark largely follow the normalisations found in the editions cited. Nevertheless, the aim here has been to settle on a reasonably standardised norm for each respective language (Runic Swedish and Runic Danish), which in Sweden's case means that the monographic spelling of the older diphthong (**risa stin**) has been normalised with the diphthong (*ræisa stæin*). In the case of Denmark, the digraphic spelling (**raisa stain**) has been normalised to a monophthong (*resa sten*). However, changing pronunciation and declension forms have been given more scope in both normalisation text types. The early Viking-Age inscription on the `Rök stone <https://en.wikipedia.org/wiki/R%C3%B6k_Runestone>`_ has been allowed to keep the normalised form ("probable pronunciation") given in the source cited, Elias Wessén's *Runstenen vid Röks kyrka*. (1958).

Normalised texts also have special characters. Here is the list these characters:

* " = the next word is a Personal name. ’ = enclitic form. This mark is used in forms such as ’s, a contracted form of es 'is', 'which/who' and in 'k, a contracted form of ek 'I'. Personal names have a special treatment and it is possible to search them.
* (?) = the normalised form should be regarded as doubtful.
* ? = all normalised forms in the inscription should be regarded as doubtful.
* ... = part of the inscription is missing or untranslated.
* [ ] = reconstructed text. Part of a word or a whole word can be reconstructed with some certainty.
* { } = this part of the inscription was written in Roman majuscule.
* < > = series of runes cannot be interpreted in an otherwise fully translated inscription; the runes * are transliterated in pointed parentheses as they stand.*
* / = alternative forms. If a series of runes can be inter* preted in several ways, the alternatives * are separated by a slash. In Gotlandic inscriptions, the slash is also used to indicate the modern form of a place-name.

.. |skpunkt| image:: /_static/skpunkt.bmp
.. |skkolon| image:: /_static/skkolon.bmp
.. |skkryss| image:: /_static/skkryss.bmp
.. |sk2kolon| image:: /_static/sk2kolon.bmp
.. |skkortstr| image:: /_static/skkortstr.bmp
.. |skplus| image:: /_static/skplus.bmp
.. |runangtrans| image:: /_static/runangtrans.bmp
.. |omedhake| image:: /_static/omedhake.bmp
.. |meashoweoe2| image:: /_static/meashoweoe2.bmp
.. |runadh| image:: /_static/runadh.bmp
.. |runagstor| image:: /_static/runagstor.bmp
.. |runalstor| image:: /_static/runalstor.bmp
.. |runanstor1| image:: /_static/runanstor1.bmp
.. |runanstor2| image:: /_static/runanstor2.bmp
.. |runao| image:: /_static/runao.bmp
.. |runaomed| image:: /_static/runaomed.bmp
.. |runapmed2| image:: /_static/runapmed2.bmp
.. |runav| image:: /_static/runav.bmp
