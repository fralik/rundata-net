==========================
Searching for inscriptions
==========================

This section is a user guide for search capabilities of Rundata-net. It has been
shortly introduced in section :ref:`query-builder-info`.

Search query is created with a query builder. Query builder allows user
to define rules where each rule contains one searchable parameter. Sometimes I
will use term filtering instead of searching. These terms are interchangeable
for this application.

Each rule consists of a property search will be performed on, operation that is
going to be performed and a search value. Search value can actually consist
of multiple values. Let's have a look at it by example :samp:`Signature begins
with Öl`. Here :samp:`Signature` is the property we are going to search for.
:samp:`begins with` denotes operation and :samp:`Öl` is the value. The result
of such search will be a list of inscription which have their signature value
starting with Öl.

The list of available search properties is mostly based on :ref:`meta-information`
and :ref:`inscriptions-texts`. Property :samp:`------` is a placeholder and has
no real meaning.

Search examples
---------------

Find all inscriptions from in Norway which are dated with :samp:`U`. There are several
way of running such search. One possibility is to define two rules connected with
AND:

#. Country in Norway.
#. Dating begins with U.

.. figure:: /_static/search_norway_u.png
    :alt: Search example

    Find all inscriptions from in Norway which are dated with 'U'.

This search finds 67 inscriptions. The usage of *begins with* operator leads
to inclusion such dating values as :samp:`U ca 450-550`, :samp:`U 520/530-560/570 (Imer 2007)`
and so on. If one needs to search for exactly for :samp:`U`, then *begins with*
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
combined (processed). Note a small row of elements in the top left corner of
query builder.

.. figure:: /_static/search_top.png
    :alt: Group control elements

It has buttons :guilabel:`NOT`, :guilabel:`AND`, :guilabel:`OR`.
These are logical operations that can be applied to group(s):

* :samp:`NOT` inverses the search of that group. If group search results in
  *find all inscriptions in Denmark*, then the inverse search is *find all
  inscriptions NOT in Denmark*.
* :samp:`AND` performs logical AND operation between groups search values.
* :samp:`OR` performs logical OR operation between groups search values.

One way to figure out which logical operation is going to be applied to which
rule, is to follow grey line from logical operators to rules.

.. figure:: /_static/search_gray_lines.png
    :alt: Following logical operations for group

If we now change logical operation of the very top row from :samp:`AND` to
:samp:`OR`, then the search will yield 1941 inscription. The difference is that
with :samp:`AND` we are searching for inscriptions that are from Norway
AND from Denmark AND have dating equal to U AND have dating equal to M. There are
of course no such inscriptions. With :samp:`OR` we are searching for inscriptions
that are from Norway OR have dating U OR from Denmark with dating equal M.

You can spot a small glitch in this version as well, can't you? We get extra
inscriptions because we search for inscriptions that are from Norway OR have dating U
instead of searching for inscriptions that are from Norway with dating U. This
can be changed:

#. Create a new top group.
#. Move two first filters into that group.
#. Delete group's placeholder rule.

The final arrangement of rules is show on figure below. Note that the first
logical operation is :samp:`OR`, whereas others have value :samp:`AND`.

.. figure:: /_static/search_two_groups.png
    :alt: Usage of two groups

We now get 258 inscriptions only.

