===================================
Inscription identifier (signature)
===================================

.. module:: rundata.database

The database contains a collection of runic inscriptions with information about them. Every runic inscription is referenced by a unique identifier also known as signature, i.e. when one searches for a particular inscription by it's ID, we call such search *searching by signature*.

Signature format is inherited from Rundata. Signatures in Rundata could consists of three parts, of which only the first two are mandatory. Parts are separated from each other by a whitespace.

Signature: part 1
-----------------

The first part indicates the origin of the inscription.

For Swedish inscriptions, the first element is the province designation used in Sveriges runinskrifter. For inscriptions from provinces which have not yet been published in Sveriges runinskrifter, a different designations are used. Here is the complete list of possible designations in alphabetic order:

==========  ===========================
ID          Meaning
==========  ===========================
:samp:`Bo`  Bohuslän, Sweden
:samp:`By`  Byzantium
:samp:`D`   Dalarna, Sweden
:samp:`DE`  Germany
:samp:`DR`  Denmark
:samp:`Ds`  Dalsland, Sweden
:samp:`E`   England!!
:samp:`F`   France
:samp:`FI`  Finland
:samp:`FR`  Faeroes
:samp:`G`   Gotland, Sweden
:samp:`GR`  Greenland
:samp:`Gs`  Gästrikland, Sweden
:samp:`Hr`  Härjedalen, Sweden
:samp:`Hs`  Hälsingland, Sweden
:samp:`IM`  Isle of Man
:samp:`IR`  Ireland
:samp:`IS`  Iceland
:samp:`IT`  Italy
:samp:`J`   Jämtland, Sweden
:samp:`LV`  Latvia
:samp:`Lp`  Lappland, Sweden
:samp:`M`   Medelpad, Sweden
:samp:`N`   Norway
:samp:`NL`  the Netherlands
:samp:`Nä`  Närke, Sweden
:samp:`Or`  Orkney islands
:samp:`PL`  Poland
:samp:`RU`  Russia
:samp:`SE`  Inscription from unknown origin in Sweden
:samp:`Sc`  Scotland
:samp:`Sh`  Shetland
:samp:`Sm`  Småland, Sweden
:samp:`Sö`  Södermanland, Sweden
:samp:`U`   Uppland, Sweden
:samp:`UA`  Ukraine
:samp:`Vg`  Västergötland, Sweden
:samp:`Vr`  Värmland, Sweden
:samp:`Vs`  Västmanland, Sweden
:samp:`Ån`  Ångermanland, Sweden
:samp:`Ög`  Östergötland, Sweden
:samp:`Öl`  Öland, Sweden
==========  ===========================

Signature: part 2
-----------------

The second part of the signature contains either

* Serial number from the relevant country's official runic register.
* Reference to another source where the inscription is accessible;
  this reference most often consists of an abbreviation of the name
  of the source plus the year and page reference. For example,
  :samp:`Fv1958;252` (= Fornvännen year 1958, p. 252). If more than one
  inscription appears on the same source page, the references are
  distinguished by the letters A, B, etc. directly after the page number.
  All abbreviations are given in the Bibliography.

Signature: part 3
-----------------

The third part of signature may contain the following symbols:

* :samp:`†` meaning that inscription has been lost.
* :samp:`$` meaning new reading or new interpretation, i.e. reading or interpretation has been completed from a later source than the source indicated in the signature.

.. warning::

    This part provides user a quick glance of some inscription properties
    from signature. However, the same information is contained in
    inscription meta data. Rundata-net use part 3 of signature only for
    displaying the :ref:`list of inscriptions <guide-list-of-inscriptions>`.
    The search by signature is performed within the first two parts only!

Signature examples
------------------

Here are some examples of signatures:

* :samp:`Öl 1`
* :samp:`Öl SHM1304:1836:64`
* :samp:`Ög F7;54`
* :samp:`Bo Peterson1992`
* :samp:`X SvIK365,1,7`
