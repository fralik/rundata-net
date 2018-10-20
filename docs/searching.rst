==========================
Searching for inscriptions
==========================

This section is a guide for using the search capabilities of Rundata-net. These have been
briefly introduced in the section :ref:`query-builder-info`.

A search query is created in the query builder. The query builder allows the user
to define rules, each of which contains one searchable parameter. At times I
will use the term 'filtering' instead of 'searching'. The terms are interchangeable
for this particular application.

Each rule consists of a property, which is used for searching, the operation which should
be performed, and a search value. The search value may in fact consist
of multiple values. Let's have a look at the example :samp:`Signature begins
with Öl`. Here, :samp:`Signature` is the property we will be searching for
:samp:`begins with` denotes the operation, and :samp:`Öl` is the value. The result
of such a search will be a list of inscriptions with a signature value
beginning with Öl.

The list of available search properties is mainly based on :ref:`meta-information`
and :ref:`inscriptions-texts`. The property :samp:`------` is a placeholder and has
no actual meaning.

Let's consider an example of the query builder interface in action.

.. _figure-query-builder:

.. figure:: /_static/query_builder.png
    :alt: An example of query builder interface
    :width: 100%

First note the top left corner. It contains the buttons :guilabel:`NOT`, :guilabel:`AND`,
:guilabel:`OR`. These are logical operations which may be applied to rules and one or more groups:

* :guilabel:`NOT` inverses the search of a rule/group. If a certain rule/group search
  results in *find all inscriptions in Denmark*, then the inverse search is
  *find all inscriptions NOT in Denmark*.
* :guilabel:`AND` performs a logical AND operation between rule/group search values.
  AND can be used for grouping independent properties. For example, *find all inscriptions
  from Denmark* AND *find inscriptions that have at least one cross* will return all
  inscriptions from Denmark with at least one cross. Wikipedia has `an article
  <https://en.wikipedia.org/wiki/Logical_conjunction>`_ about logical AND.
* :guilabel:`OR` performs a logical OR operation between rule/group search values.
  A logical OR can be used for grouping values with identical property, for example *find all
  inscriptions from Denmark OR Norway*. See more on `logical OR
  <https://en.wikipedia.org/wiki/Logical_disjunction>`_ on Wikipedia.

The currently selected operator is indicated by a slightly darker blue colour. In the
figure above, :guilabel:`AND` is selected. :guilabel:`NOT` is a checkbox
and will have a tick when selected.

One way of figuring out which logical operation should be applied to which
rule, is to follow the grey line from logical operators to rules.

.. figure:: /_static/search_gray_lines.png
    :alt: Following logical operations for group

The control buttons are located to the right. They are used for adding or deleting rules
and groups, see :ref:`the figure above <figure-query-builder>`.

Each rule has its own operators and value types. The example above presents four
different value types:

* Boolean for the filter *Has alternative(s)?*. This type typically has a Yes/No
  value.
* Categorical for the filter *Country*. This type can contain one or several values
  from a predefined set.
* Numerical for the filter *Number of crosses*. This type contains an integer or
  decimal number.
* Textual for the filter *Signature*. This is the most common type. It contains
  textual information (which may be letters, special symbols, or digits).

Operators are differentiated on the basis of the search value type of the
respective rule. Their meaning should be clear from their name. A possible
exception to this are the *matches* operators for textual information. These
operators allow one to specify a
`regular expression pattern <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Writing_a_regular_expression_pattern>`_. This is very
similar to how a search in text is made in the original Rundata. Several examples
of such searches will be given later.

.. attention::

    Both Rundata-net and Rundata support two types of searches:

    * Direct search by value. In this case, user selects a property that is going to be searched for
      some value. For example, a search for inscriptions from Sweden. This search uses value 'Sweden'
      to search in property 'location'.
    * Word search or a search across different text forms. In this case, user provides multiple search
      patterns in different inscription texts. All patterns must be present in a single word. We may
      illustrate such search with the :ref:`example below <searching-word-search>`.

.. _search-normalization-label:

Case sensitivity in searches and search normalization
-----------------------------------------------------

Most of the textual-based searches are insensitive as regards capital letters.
For example, *Öl* is matched to both *Öl* and *öl*. On the other hand,
*öl* matches *öl* only.

However, some rules are case sensitive. These are the rules that deal with
:ref:`inscriptions-texts`, namely:

* Normalization to Old Scandinavian;
* Normalization to Old West Norse;
* Transliterated runic text.

For example, a search for *R* in transliterated runic text only yields results with
*R*.

Rundata normalizes all inscription texts, so that a search for *Ol* matches
*Öl*. Rundata-net does not perform such normalization.

Another type of normalization concerns punctuation and special symbols in normalized texts. Almost all
punctuation and special symbols must be removed for the purpose of searching (cf. :ref:`searching-multiple-words`). It is not possible to search for punctuation marks in the inscription texts. A search for `skarf`
in transliterated text thus yields `s:karf` as one of its results. Refer to :doc:`/db/data` for
a list of characters that are used as punctuation marks. A symbol which should **not** be removed
is `-`. This means that if you want to find `f-ita` you have to search for `f-ita`.

Search example
--------------

Find all inscriptions from Norway which are dated with :samp:`U`. There are several
ways of running such a search. One possibility is to define two rules connected with
AND:

#. Country in Norway.
#. Dating begins with U.

.. figure:: /_static/search_norway_u.png
    :alt: Search example
    :width: 100%

    Find all inscriptions from Norway which are dated with 'U'.

This search finds 66 inscriptions. Use of the *begins with* operator leads
to the inclusion of such dating values as :samp:`U ca 450-550`, :samp:`U 520/530-560/570 (Imer 2007)`
and so on. If one wishes to search only for :samp:`U`, then *begins with*
should be replaced with *equal*. A search using *equal* yields 15 inscriptions.

Now imagine that we wish to add a search for inscriptions from Denmark, dated :samp:`M`. One way to do this would be to **add a new group**. Click
:guilabel:`Add group` and a new group with an empty rule will appear under the
existing rules. We may add two rules to this group:

#. Country in Denmark.
#. Dating equal M.

.. figure:: /_static/search_add_group.png
    :alt: Search example with an additional group
    :width: 100%

    Filtering with a group

Such a search will come up with no results. This is due to the way groups are
combined (processed) by logical operators.

If we now change the logical operation of the very top row from :guilabel:`AND` to
:guilabel:`OR` the search will yield 2108 inscriptions. The difference is that
with :guilabel:`AND` we are searching for inscriptions which are from Norway
AND from Denmark AND have dating equal to U AND M. Obviously, there are no such inscriptions.
With :guilabel:`OR`, on the other hand, we are searching for inscriptions
that are from Norway OR have dating U OR are from Denmark with a dating equalling M.

You may have spotted a small glitch in this version as well. We get an extra
inscriptions because we have searched for inscriptions which are from Norway OR have the dating U
instead of searching for inscriptions from Norway, dated U. This
can be corrected:

#. Create a new top group.
#. Move two first filters into that group. You can easily rearrange rules and
   groups with the mouse by dragging them to the sort icon ↓↑.
#. Delete the placeholder rule for the group.

The final arrangement of rules is shown in the figure below. Note that the first
logical operation is :guilabel:`OR`, whereas others have the value :guilabel:`AND`.

.. figure:: /_static/search_two_groups.png
    :alt: Usage of two groups
    :width: 100%

We now get a mere 309 inscriptions.

Example 2. Searching by regular expression.
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Most searching operators use search values as is. For example, a search operator :samp:`equal` takes
provided value and searches for it directly. Search operators that support regular expressions treat
provided value as an expression, which means the value is interpreted during usage. In order to work,
expressions must be written in a form understandable by the app. Both Rundata and Rundata-net support
searching by regular expressions. Rundata uses it's own custom syntax for regular expressions.
Rundata-net uses a common `JavaScript syntax <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Writing_a_regular_expression_pattern>`_.

Let's compare two syntaxes by looking at an example from the Rundata help file taken from section
`Search Pattern (Sökmönster)`:

    a{s/r/}n finds asn, arn, an, áRn, A(s)n, ...

Here :samp:`a{s/r/}n` is an expression. In the Rundata help file this is not specified, but I shall
assume that the search pattern is used to make a search in transliterated runic text. In JavaScript
syntax, this pattern is written as :samp:`a(s|r)n`. However, due to the absence of a diacritic removal
in Rundata-net, such a pattern only finds `asn`, `arn`, `a(s)n`, and `a(r)n`.

Regular expressions may include logical operators in the expressions themselves. Thus, a search
for :samp:`Ö(l|g) 11` in :samp:`signature` finds inscriptions with signatures such as `Öl 11`, `Öl 112`,
`Ög 115`. If you exclusively want to find signatures with `11` the regular expression
should be :samp:`(Ö(l|g) 11)$`. There are numerous online sources treating regular expressions.
One useful resource is the `regex101.com <https://regex101.com/>`_ website. There you may
test regular expressions and see a textual explanation of them. Be sure to
select `javascript` as regex flavour on the left-hand panel.

The expression `(Ö(l|g) 11)$` is described like this by regex101::

    /(Ö(l|g) 11)$/gm
        1st Capturing Group (Ö(l|g) 11)
        Ö matches the character 'Ö' literally (case sensitive)
        2nd Capturing Group (l|g)
            1st Alternative l
            l matches the character 'l' literally (case sensitive)
            2nd Alternative g
            g matches the character 'g' literally (case sensitive)
         11 matches the characters ' 11' literally (case sensitive)
    $ asserts position at the end of a line

.. _searching-word-search:

Search across different text forms in inscription texts
-------------------------------------------------------

A second search type supported by Rundata-net is a search across different text forms in inscription
texts. I will sometimes refer to such search type as *word search*. It is called word search because
it yields the results where inscription contains all search patterns in a single word. Refer to the
:ref:`structure <data-text-structure-label>` of inscription texts. It is valid to say that each word
is given in multiple forms, i.e. transliterated and normalized. Search patterns are evaluated per
word in a word search. This can be useful if one wants to find how word spelling changed over time.

One example will be to find out when rune :samp:`a` is normalized (Old West Norse) as :samp:`ei`.
Runic word :samp:`stain` can be normalized as :samp:`stein` or :samp:`staina`. So in order to find all
inscriptions that have word :samp:`stain` normalized as :samp:`stein`, a word search must be used.
A similar example is that normalization :samp:`stein` can be transliterated as :samp:`stin` or
:samp:`stan`.

In Rundata, different search types are available through different menu items. :guilabel:`Search in texts`
is used for word search and :guilabel:`Selection` for property-based search. Consider a word
search in Rundata with the following :guilabel:`word parameter code`: :samp:`RUN:reisti & FVN:fôður`:

* The transliteration contains `reisti`.
* The normalization to Old West Norse contains `fôður`.

This search produces 0 results in Rundata. The reason for this is that Rundata
tries to find one single word that contains both `reisti` in transliteration and `fôður`
in Old West Norse. Evidently, there are no such words.

What appears to be a similar search in Rundata-net is shown in the figure below:

.. _figure-pseudo-similar:

.. figure:: /_static/pseudo_similar.png
    :alt: An example of search that looks similar to Rundata RUN:reisti & FVN:fôður

This results in three inscriptions. Öl 13 contains `reisti` as word 2 in the transliterated
text and `fôður` as word 7 in the Old West Norse text. The point should be evident. Rundata-net
has searched through texts in their entirety and returned results regardless of word positions.

Let's fix this search in Rundata and observe the results. Consider a search for all
inscriptions from Gästrikland with the :guilabel:`word parameter code` :samp:`RUN:\a & FVN:\ei`.
Rundata finds eight inscriptions. The first one, Gs 1, has its matched words highlighted in bold:

| Gs 1
| Snjólaug lét **reisa stein** eptir Véleif, bónda sinn, en Eynjótr.
| sniolauk · lit · **resa** · **stain** · (e)ftiR · uilef · bunta · sin · in · oyniotr

The logic behind this is:

* Word 3 is `reisa` in Old West Norse, it contains the search pattern `ei`.
  Word 3 is `resa` in transliteration, it contains the search pattern `a`. Therefore,
  word 3 is a search match.
* Word 4 is `stein` in Old West Norse, it contains the search pattern `ei`.
  Word 4 is `stain` in transliteration, it contains the search pattern `a`. Therefore,
  word 4 is a search match.

.. attention::

    In order to perform a word-based search of this kind in Rundata-net, one have to select
    the **matches across words** operator.

The same search in Rundata-net is rendered as:

* Country in Gästrikland.
* Normalization to Old West Norse matches across words ei.
* Transliterated runic text matches across words a.

.. _figure-rundatanet-words:

.. figure:: /_static/rundatanet_words.png
    :alt: Word search in Rundata-net.

Note that when a search is performed across words additional information about
the number of matched words and personal names is provided together with
the number of inscriptions retrieved. For this search there are 20 words of which 7
are personal names. Thus, there are 20-7 = 13 words other than personal names.
The retrieved words are highlighted in red when the inscription is selected for display.

Now, if you select all the inscriptions and glance through their texts you might notice that,
all in all, more than 20 words have been highlighted. The word counting function does not take into
account words repeated in alternative readings.
This means that if a runic inscription text is::

    §P þiuþkiR uk| |kuþlaifr : uk| |karl þaR bruþr aliR : litu rita stain þino × abtiR þiuþmunt ' faur sin ' kuþ hialbi hons| |salu| |uk| |kuþs muþiR in osmuntr ' kara sun ' markaþi × runoR ritaR þa sat aimunt
    §Q þiuþkiR uk| |kuþlaifr : uk| |karl þaR bruþr aliR : litu rita stain þino × þa sata| |aimuntr| |runoR ritaR abtiR þiuþmunt ' faur sin ' kuþ hialbi hons| |salu| |uk| |kuþs muþiR in osmuntr ' kara sun ' markaþi ×

and your search results contain the word `þaR`, this word will be counted only once
despite its being present in both the §P and the §Q variant.

.. warning::

    Rundata counts words in a similar manner. However, if variant §P contains three words
    and variant §Q contains four words, Rundata will only report three words for that
    signature, whereas Rundata-net will report four words.

Extending word search in Rundata-net
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Let us now extend the previous search in order to find all inscriptions from Öland
which contain `þenna` in normalization to Old Scandinavian:

.. _figure-words-with-oland:

.. figure:: /_static/words_with_oland.png
    :alt: An example of complex word search in Rundata-net.
    :width: 100%

This search results in 20 inscriptions and 32 words, of which 7 are personal names.
It then contributed an added 12 inscriptions and 12 words,
but 0 personal names.

.. _searching-multiple-words:

Spanning word search across multiple words
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The above example with :samp:`a` and :samp:`ei` considered searching for these patterns in a single
word. What if you are now concerned not only about the word *stone*, but also about word *raised*?
Normalized word :samp:`reisti` can be transliterated as :samp:`risti` or :samp:`rasti` or
:samp:`risþi`, e.t.c. If one would like to find all :samp:`risti`, but not :samp:`rasti` followed by
:samp:`st`, then the search can be :samp:`Transliterated runic text matches across words ri.*st`.
This search results in 1016 inscriptions, 6651 words, 1272 personal names. If one wants to additionally
filter by normalization it is possible to add such a rule :samp:`Normalization to Old West Norse
matches across words reisti stein`. This extended search yields 170 inscriptions, 339 words,
0 personal names.

It is possible to type in multiple words in any kind of search pattern. All words in a search pattern
must be separated by a single space. For example if you want to find an inscription with the
transliterated text :samp:`auk × nifR`, then you should search for :samp:`auk nifR`. Another example
might be inscription with signature :samp:`Öl SAS1989;43`, which
contains :samp:`hir| |risti| |ik þiR birk ¶ bufi` in the transliterated text. In order to find the first
two words you can search for :samp:`ir risti`. You cannot give any arbitrary characters
from the two words but have to enter the characters as they appear sequentially, i.e. you can not
search by :samp:`h ti`. The same applies if you wish to find words 5 and 6, which may be done, e.g.,
by searching for :samp:`rk bu`.

Notes about searching across words
----------------------------------

Several things should be kept in mind when performing searches across words:

* The search pattern is a regular expression.
* The logical NOT operator should not be used. Although the number of found
  inscription may be correct, the highlight mechanism will not work.

Searching for bind runes
------------------------

You mae recall from section :ref:`search-normalization-label`, that binding rune
symbol is treated as a special symbol. It is thus removed from the search in
the database.

Let's say you wish to find inscriptions that have :samp:`f^u` in the
transliterated text. The search you may carry out is :samp:`Transliterated runic text contains fu`.
It is thus impossible to automatically dstinguish between cases where bind rune
was used and cases where :samp:`fu` appeared without it.

The same is true when bind rune was used to connect two words. For example,
inscription :samp:`Vg 76` contains the following transilterated text :samp:`h[-ær]ium : a^t^ ^biþia : bat[ær]`.
To search for it, you may search for :samp:`at biþia`.


Search capabilities not present in Rundata-net (compared with Rundata)
----------------------------------------------------------------------

Rundata has some special symbols that may be used in word searches:

* :samp:`#V` arbitrary vowel.
* :samp:`#K` arbitrary consonant.
* :samp:`#X` arbitrary character.
* :samp:`\\` used before a letter to indicate that it is to be searched for in
  this exact form (capital or lower case, with or without accent). Used before
  a special character, :samp:`\\` means that the character is deprived of its
  special function and should be treated as an ordinary letter.
* :samp:`@` placed between two characters to indicate that there should be no
  punctuation mark between them.

**These symbols are not supported in Rundata-net!** Furthermore, it is not
possible to search for punctuation in inscription texts.

Another type of search that is not available in Rundata-net is the
:guilabel:`Full text search in information file`, i.e. full-text search across
inscription meta data.

