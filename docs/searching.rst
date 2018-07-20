==========================
Searching for inscriptions
==========================

This section is a guide for using the search capabilities of Rundata-net. These have been
briefly introduced in the section :ref:`query-builder-info`.

A search query is created in the query builder. The query builder allows the user
to define rules, each of which contains one searchable parameter. At times I
will use the term 'filtering' instead of 'searching'. The terms are interchangeable
for this particular application.

Each rule consists of a property, which is used for searching, the operation which should be performed, and a search value. The search value may in fact consist
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

Operators are differentiated on the basis of the search value type of the respective rule. Their meaning
should be clear from their name. A possible exception to this are the *matches*
operators for textual information. These operators allow one to specify a `regular
expression pattern <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Writing_a_regular_expression_pattern>`_. This is very similar
to how a search is made in the original Rundata. Several examples of such searches
will be given later.

.. warning::

    A search within inscription texts may differ from the corresponding search in Rundata. Rundata implements searches
    word for word, meaning that in a search with multiple search patterns, all patterns must be present in a single word (counting all its different text forms). [DID I GET THIS RIGHT? APM] We may illustrate this with the :ref:`example below
    <searching-word-search>`.
    It is crucial to grasp this difference since Rundata-net may produce quite different
    search results from Rundata using what might seem to be identical search patterns.

Case sensitivity in searches and normalization
----------------------------------------------

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

Another type of normalization concerns punctuation and special symbols. Almost all
punctuation and special symbols must be [CORRECTLY UNDERSTOOD? APM] removed for the purpose of searching (cf. :ref:`searching-multiple-words`). It is not possible to search for punctuation marks
in the inscription texts. A search for `skarf` in transliterated text thus yields `s:karf`
as one of its results. Refer to :doc:`/db/data` for a list of characters that
are used as punctuation marks. A symbol which should **not** be removed is `-`. This means
that if you want to find `f-ita` you have to search for `f-ita`.

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
:guilabel:`OR` the search will yield 1906 inscriptions. The difference is that
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

Example 2. Using regular expressions.
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Now let's have a look at how regular expressions work with an example from the Rundata help file: [CORRECTLY FORMATED? BOLD FACE /APM]
    a{s/r/}n finds asn, arn, an, áRn, A(s)n, ...

In the Rundata help file this is not specified, but I shall assume that the search pattern is used to make a search
in transliterated runic text. In regular expression terms this pattern is
written as `a(s|r)n`. However, due to the absence of a diacritic removal in Rundata-net,
such a pattern only finds `asn`, `arn`, `a(s)n`, and `a(r)n`.

Regular expressions may include logical operators in the expressions themselves. (CORRECTLY UNDERSTOOD?/APM) Thus, a search
for `Ö(l|g) 11` in 'signature' (CORRECTLY UNDERSTOOD?) finds signatures such as `Öl 11`, `Öl 112`, `Ög 115`.
If you exclusively want to find signatures with `11` the regular expression
should be `(Ö(l|g) 11)$`. There are numerous online sources treating regular expressions.
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

Word searches in inscription texts
--------------------------------

Consider the following search in Rundata: `RUN:reisti & FVN:fôður` word search parameter. (ILI KUDA OTNOSITSIA WORD SEARCH PARAMETER? /APM)

* The transliteration contains 'reisti' (I'VE INSERTED ' IN THE FOLLOWING PARAGRAPHS; YOU MAY PREFER THE ITALICS USED IN E.G. "WORD 3 IS REISA" BELOW /APM)
* The normalization to Old West Norse contains 'fôður'.

This search produces 0 results in Rundata. The reason for this is that Rundata
tries to find one single word that contains both 'reisti' in transliteration and 'fôður'
in Old West Norse. Evidently, there are no such words.

What appears to be a similar search in Rundata-net is shown in the figure below:

.. _figure-pseudo-similar:

.. figure:: /_static/pseudo_similar.png
    :alt: An example of search that looks similar to Rundata RUN:reisti & FVN:fôður

This results in three inscriptions. Öl 13 contains 'reisti' as word 2 in the transliterated
text and 'fôður' as word 7 in the Old West Norse text. The point should be evident. Rundata-net
has searched through texts in their entirety and returned results regardless of word positions.

Let's fix this search in Rundata and observe the results. Consider a search for all
inscriptions from Gästrikland with the word search parameter `RUN:\a & FVN:\ei`. Rundata
finds eight inscriptions. The first one, Gs 1, has its matched words highlighted in bold:

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

    In order to perform a
    word-based search of this kind in Rundata-netOne, you have to select the **matches across words** operator.

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
all in all, more than 20 words have been highlighted. The word counting function does not take into account words repeated in alternative readings.
This means that if a runic inscription text is

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

This search results in 20 signatures and 32 words, of which 7 are personal names.
It then contributed an added 12 signatures and 12 words,
but 0 personal names.

.. _searching-multiple-words:

Word search in multiple words (WHY 'IN' AND NOT 'FOR'? (APM))
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Searching in multiple words is not a problem and is handled naturally in Rundata-net.
One thing to note, however, is that all words in a search should be (CORRECTLY UNDERSTOOD? APM) separated by a single space.
Thus if you want to find an inscription with the transliterated text `auk × nifR`
you should search for `auk nifR`. Another example might be `Öl SAS1989;43`, which
contains `hir| |risti| |ik þiR birk ¶ bufi` in the transliterated text. In order to find the first
two words you can search for `ir risti`. You cannot give any (CORRECTLY UNDERSTOOD /APM?) arbitrary characters
from the two words but have to enter the characters as they appear sequentially. The same applies
if you wish to find words 5 and 6, which may be done, e.g., by searching for `rk bu`.

Notes about searching across words
----------------------------------

Several things should be kept in mind when performing searches
across words:

* The search pattern is a regular expression.
* The logical NOT operator should not be used when searching across words.
  Although the inscription results may be correct, the highlight mechanism will not work.

You've been warned!  (YA BY UBRAL (APM))

Search capabilities not present in Rundata-net
-----------------------------------------

Rundata has some special symbols that may be used in word searches:

* :samp:`#V` arbitrary vowel.
* :samp:`#K` arbitrary consonant.
* :samp:`#X` arbitrary character.
* :samp:`\\` used before a letter to indicate that it is to be searched for in this exact form
  (capital or lower case, with or without accent). Used before a special
  character, :samp:`\\` means that the character is deprived of its special
  function and should be treated as an ordinary letter.
* :samp:`@` placed between two characters to indicate that there should be no punctuation mark
  between them.

**These symbols are (CORRECTLY UNDERSTOOD? (APM)) not supported in Rundata-net!** Furthermore, it is not possible to search for
punctuation in inscription texts.

Another type of search that is not available in Rundata-net is the
:guilabel:`Full text search in information file`, i.e. full-text search
across inscription meta data.

