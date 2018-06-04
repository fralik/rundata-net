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
* :guilabel:`OR` performs logical OR operation between rules/groups search values.

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
* Textual for filter *Signature*. This is the mostly common type. It contains
  textual information (can be letters, special symbols, digits).

Operators are differentiated based on rule's search value type. Their meaning
should make sense just from their name. One exception can be *matches expression*
operator for textual information. This operator allows one to specify a `regular
expression pattern <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Writing_a_regular_expression_pattern>`_. This is very similar
to how search is done in the original Rundata.

Case sensitivity in searches
----------------------------

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

Rundata normalised all searchable texts, so that a search for *Ol* would match
*Öl*. Rundata-net doesn't perform such normalisation.

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
to inclusion such dating values as :samp:`U ca 450-550`, :samp:`U 520/530-560/570 (Imer 2007)`
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
:guilabel:`OR`, then the search will yield 1906 inscription. The difference is that
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

Absent search capabilities in Rundata-net
-----------------------------------------

Rundata has some special symbols that can be used during search:

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



