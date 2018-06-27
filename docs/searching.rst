==========================
Searching for inscriptions
==========================

This section is a user guide for search capabilities of Rundata-net. It has been
shortly introduced in section :ref:`query-builder-info`.

Search query is created with a query builder. Query builder allows user
to define rules where each rule contains one searchable parameter. Sometimes I
will use term filtering instead of searching. These terms are interchangeable
for this application.

Each rule consists of a property which is used for searching, operation that is
going to be performed and a search value. Search value can actually consist
of multiple values. Let's have a look at it by example :samp:`Signature begins
with Öl`. Here :samp:`Signature` is the property we are going to search for.
:samp:`begins with` denotes operation and :samp:`Öl` is the value. The result
of such search will be a list of inscription which have their signature value
starting with Öl.

The list of available search properties is mostly based on :ref:`meta-information`
and :ref:`inscriptions-texts`. Property :samp:`------` is a placeholder and has
no real meaning.

Here is an example of query builder interface.

.. _figure-query-builder:

.. figure:: /_static/query_builder.png
    :alt: An example of query builder interface

Note the top left corner. It contains buttons :guilabel:`NOT`, :guilabel:`AND`,
:guilabel:`OR`. These are logical operations that can be applied to rules and group(s):

* :guilabel:`NOT` inverses the search of that rule/group. If rule/group search
  results in *find all inscriptions in Denmark*, then the inverse search is
  *find all inscriptions NOT in Denmark*.
* :guilabel:`AND` performs logical AND operation between rules/groups search values.
  AND can be used to group independent properties. For example, *find all inscriptions
  from Denmark* AND *find inscriptions that have at least one cross* will return all
  inscriptions with at least one cross from Denmark. Wikipedia has `an article
  <https://en.wikipedia.org/wiki/Logical_conjunction>`_ about logical AND.
* :guilabel:`OR` performs logical OR operation between rules/groups search values.
  Logical OR can be used to group values of the same property. Example, *find all
  inscriptions from Denmark OR Norway*. Read about `logical OR
  <https://en.wikipedia.org/wiki/Logical_disjunction>`_ on Wikipedia.

Currently selected operator is denoted by slightly darker blue color. On the
figure above, :guilabel:`AND` is selected. :guilabel:`NOT` is a checkbox
and will have a tick when selected.

One way to figure out which logical operation is going to be applied to which
rule, is to follow grey line from logical operators to rules.

.. figure:: /_static/search_gray_lines.png
    :alt: Following logical operations for group

Control buttons are located on the right. They are used to add or delete rules
and groups, see :ref:`the figure above <figure-query-builder>`.

Each rule has it's own operators and value types. An example above presents four
different value types:

* Boolean for filter *Has alternative(s)?*. This type has typically a Yes/No
  value.
* Categorical for filter *Country*. This type can contain one or several values
  from a predefined set.
* Numerical for filter *Number of crosses*. This type contain an integer or
  decimal number.
* Textual for filter *Signature*. This is the most common type. It contains
  textual information (can be letters, special symbols, digits).

Operators are differentiated based on rule's search value type. Their meaning
should make sense just from their name. One exception can be *matches*
operators for textual information. This operator allows to specify a `regular
expression pattern <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Writing_a_regular_expression_pattern>`_. This is very similar
to how search is done in the original Rundata. Several examples of such searches
will be presented later.

.. warning::

    The search in inscription texts can be different from Rundata. Rundata searches
    word by word and multiple search patterns must be present in corresponding words
    across different text forms. This will be illustrated with an :ref:`example below
    <searching-word-search>`.
    This difference is very important as Rundata-net can produce very different
    search results than Rundata for what might seem as the same search pattern.

Case sensitivity in searches and normalization
----------------------------------------------

Most of the textual-based searches are capital letter insensitive.
For example, *Öl* is matched to *Öl* and to *öl*. On the other hand,
*öl* matches *öl* only.

However some rules are case sensitive. These are the rules that deal with
:ref:`inscriptions-texts`:

* Normalization to Old Scandinavian;
* Normalization to Old West Norse;
* Transliterated runic text.

For example, a search for *R* in transliterated runic text yields results with
*R* only.

Rundata normalizes all inscription texts, so that a search for *Ol* would match
*Öl*. Rundata-net doesn't perform such normalization.

Another type of normalization concerns punctuation and special symbols. Almost all
punctuation and special symbols are removed for searching. This is also mentioned
in :ref:`searching-multiple-words`. It is not possible to search for punctuation
in inscription texts. A search for `skarf` in transliterated text yields `s:karf`
as one of the results. Refer to :doc:`/db/data` for a list of characters that
are used as punctuation marks. One symbols which is **not** removed is `-`. This means
that if you want to find `f-ita` you have to search for `f-ita`.

Search example
--------------

Find all inscriptions from Norway which are dated with :samp:`U`. There are several
way of running such search. One possibility is to define two rules connected with
AND:

#. Country in Norway.
#. Dating begins with U.

.. figure:: /_static/search_norway_u.png
    :alt: Search example

    Find all inscriptions from Norway which are dated with 'U'.

This search finds 66 inscriptions. The usage of *begins with* operator leads
to inclusion of such dating values as :samp:`U ca 450-550`, :samp:`U 520/530-560/570 (Imer 2007)`
and so on. If one needs to search exactly for :samp:`U`, then *begins with*
shall be replaced with *equal*. Search with *equal* yields 15 inscriptions.

Imaging that we now want to add a search for inscriptions from Denmark which are
dated with :samp:`M`. One way to do it is to **add a new group**. Click
:guilabel:`Add group` and a new group with an empty rule will appear under the
existing rules. We can add two rules to that group:

#. Country in Denmark.
#. Dating equal M.

.. figure:: /_static/search_add_group.png
    :alt: Search example with an additional group

    Filters with a group

If you search now, no results will come up. This is due to the way groups are
combined (processed) by logical operators.

If we now change logical operation of the very top row from :guilabel:`AND` to
:guilabel:`OR`, then the search will yield 1906 inscriptions. The difference is that
with :guilabel:`AND` we are searching for inscriptions that are from Norway
AND from Denmark AND have dating equal to U AND have dating equal to M. There are
of course no such inscriptions. With :guilabel:`OR` we are searching for inscriptions
that are from Norway OR have dating U OR from Denmark with dating equal M.

You can spot a small glitch in this version as well, can you? We get extra
inscriptions because we search for inscriptions that are from Norway OR have dating U
instead of searching for inscriptions that are from Norway with dating U. This
can be changed:

#. Create a new top group.
#. Move two first filters into that group. You can easily rearrange rules and
   groups with a mouse by dragging them on sort icon ↓↑.
#. Delete group's placeholder rule.

The final arrangement of rules is shown on the figure below. Note that the first
logical operation is :guilabel:`OR`, whereas others have value :guilabel:`AND`.

.. figure:: /_static/search_two_groups.png
    :alt: Usage of two groups

We now get 309 inscriptions only.

Example 2. Using regular expressions.
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Let's have a look how regular expressions work with an example from Rundata help file:
    a{s/r/}n finds asn, arn, an, áRn, A(s)n, ...

It is not specified there, but I assume that the search pattern is used to search
in transliterated runic text. The same pattern in regular expression terms is
written as `a(s|r)n`. However, due to absence of diacritic removal in Rundata-net,
such pattern finds `asn`, `arn`, `a(s)n`, `a(r)n` only.

Regular expressions can have logical operators right in the expression. Example,
search for `Ö(l|g) 11` in signature finds signatures like `Öl 11`, `Öl 112`, `Ög 115`.
If you want to find just to signatures with `11` in there, then the regular expression
should be `(Ö(l|g) 11)$`. There are numerous online source about regular expressions.
One useful resource is `regex101.com <https://regex101.com/>`_ website. There you can
test regular expressions and see textual explanation of a regular expression. Be sure to
select `javascript` on the left hand panel as regex flavor.

Expression `(Ö(l|g) 11)$` is described like this by regex101::

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

Word search in inscription texts
--------------------------------

Consider this search in Rundata (`RUN:reisti & FVN:fôður` word search parameter):

* Transliteration contains reisti
* Normalization to Old West Norse contains fôður.

This search produces 0 results in Rundata. The reason for this is that Rundata
tries to find one single word that would contain reisti in transliteration and fôður
in Old West Norse. There are of course no such words.

A what appears to be a similar search in Rundata-net is show in figure below:

.. _figure-pseudo-similar:

.. figure:: /_static/pseudo_similar.png
    :alt: An example of search that looks similar to Rundata RUN:reisti & FVN:fôður

The result is 3 inscriptions. Öl 13 contains reisti as word 2 in transliterated
text and fôður as word 7 in Old West Norse text. I hope you see the point. Rundata-net
searched through the whole texts and returned results regardless of words.

Let's fix the search in Rundata and observe the results. Consider search for all
inscriptions from Gästrikland with word search parameter `RUN:\a & FVN:\ei`. Rundata
finds 8 inscriptions. The first one Gs 1 has matched words highlighted in bold:

| Gs 1
| Snjólaug lét **reisa stein** eptir Véleif, bónda sinn, en Eynjótr.
| sniolauk · lit · **resa** · **stain** · (e)ftiR · uilef · bunta · sin · in · oyniotr

The logic behind that is:

* Word 3 is `reisa` in Old West Norse, it contains search pattern `ei`.
  Word 3 is `resa` in transliteration, it contains search pattern `a`. Therefore,
  word 3 is the search match.
* Word 4 is `stein` in Old West Norse, it contains search pattern `ei`.
  Word 4 is `stain` in transliteration, it contains search pattern `a`. Therefore,
  word 4 is the search match.

.. attention::

    One have to select **matches across words** operator in order to perform such
    word-based search in Rundata-net.

The same search in Rundata-net is given by:

* Country in Gästrikland.
* Normalization to Old West Norse matches across words ei.
* Transliterated runic text matches across words a.

.. _figure-rundatanet-words:

.. figure:: /_static/rundatanet_words.png
    :alt: Word search in Rundata-net.

Note that when a search across words is performed, then additional information about
number of matched words and personal names is provided alongside the information
about number of found inscriptions. For that search there are 30 words of which 12
are personal names. Therefore, there are 30-12 = 28 non personal name words.
Rundata outputs a different number of words. As far as I know it doesn't count
repeated words per inscription.

Extending word search in Rundata-net
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Let's now extend the previous search in order to find all inscriptions that
contain `þenna` in normalization to Old Scandinavian and are from Öland:

.. _figure-words-with-oland:

.. figure:: /_static/words_with_oland.png
    :alt: An example of complex word search in Rundata-net.

The search results in 20 signatures, 43 words of which 12 are personal names.
You can figure out that this new search contributed 12 signatures, 13 words
and 0 personal names.

.. _searching-multiple-words:

Word search in multiple words
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Searching in multiple words is not a problem and handled naturally in Rundata-net.
One thing to note is that when searched all words are separated by a single space.
This means if you want to find inscription with transliterated text `auk × nifR`,
then you should search for `auk nifR`. Another example is from `Öl SAS1989;43` which
contains `hir| |risti| |ik þiR birk ¶ bufi` in the transliterated text. For the first
two words, you can search for `ir risti`. See that you can not specify arbitrary characters
from two words, but have to enter characters as they appear sequentially. The same applies
in order to find words 5 and 6, `rk bu`.

Notes about searching across words
----------------------------------

There are several things that is good to have in mind when you perform search
across words:

* Search pattern is a regular expression.
* You should try not to use logical NOT operator when searching across words.
  Although inscription results should be correct, the highlight mechanism won't work.

You've been warned!

Absent search capabilities in Rundata-net
-----------------------------------------

Rundata has some special symbols that can be used during word search:

* :samp:`#V` arbitrary vowel.
* :samp:`#K` arbitrary consonant.
* :samp:`#X` arbitrary character.
* :samp:`\\` used before a letter to be searched for in the exact form indicated
  (capital or lower case, with or without accent). Used before a special
  character, :samp:`\\` means that the special character loses its special
  function and is treated as an ordinary letter.
* :samp:`@` placed between two characters to indicate that no punctuation should
  be between them.

**This is not supported in Rundata-net!** In fact, it is not possible to search for
punctuation in inscription texts.



