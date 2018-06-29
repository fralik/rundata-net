================
Quick user guide
================

.. module:: rundata.userguide

This section gives a quick introduction to Rundata-net interface.

Rundata-net is essentially an interface to a database. Since the database doesn't change very often, I adopted a rather radical approach in accessing it. Most of the site functions are executed inside user's browser, including the database. When user opens the main page, it takes some time to load the site. This is the point where the database is transfered to user's computer. Once it is transfered, the rest of functionality should be rather quick.

The main page is divided into several areas which I refer to as panels. They are shown with numbers in the image below.

.. image:: /_static/panels.jpg
  :width: 100 %
  :alt: Rundata-net main screen

From left to right and from top to bottom:

#. List of inscriptions with numerical information about search results.

#. Main display.

#. Map display.

#. Several horizontal panels of control elements and buttons.

#. Query builder.

Below is the description of each of these labels.

.. _guide-list-of-inscriptions:

List of inscriptions
====================

​It's a list where each node corresponds to an individual inscription.
inscriptions are referenced by a unique name/ID called signature, see
:doc:`/db/signature`. Some inscriptions changed their name/ID
throughout years. One example is isncription :samp:`Öl 2`, which had
names :samp:`B 1076` and :samp:`L 1324`. The list of inscriptions
contains the most recent names only, i.e. no :samp:`B 1076` nor
:samp:`L 1324`. The former names (if any) are presented on the
:ref:`main display<main-display-info>` when inscription is selected.

When user selects inscriptions in the list, the information about them is
displayed on the :ref:`main display<main-display-info>` panel. It is possible
to select a single inscription or multiple. General selection principles
applies for selecting multiple inscriptions: use :kbd:`Control` to add
individual inscription to selection, use :kbd:`Shift` to add a selection.

Below the list of inscriptions you will see a status text saying how many
inscription is available for selection. This can be useful when you perform
a search. Status text will give you the number of results.

.. _main-display-info:

Main display
============

.. image:: /_static/main-display-example.jpg
  :width: 100 %
  :alt: Example of information presented on the main display

This is a text area that shows information about selected
inscriptions. It is possible to adjust what kind of information is displayed.
Use 'show display format dialog' button for this.

The main display imitates editable behaviour. This means that if you click on it,
you are able to type in or delete text. This is done in order to support
keyboard navigation and shortcuts for text: select all, copy, paste. This
addresses a scenario where one would like to take all the information provided
by Rundata-net and bring it to another program/app. Simply click on the main
display, select all text, open another application and paste the text there.

.. _map-info:

Map display
===========

Map shows place marks for selected inscriptions if coordinates
are available. It shows the found location of inscription and not
the current location. It is known that some coordinates are wrong.
Since Rundata-net is simply a different view program for SMDB,
it inherits SMDB's flaws.

When a placemark is clicked, the main display is scrolled so that the inscription
referenced by that placemark is visible.

Control panels
==============

There are several horizontal panels of control elements and buttons.

Filter control
--------------

:guilabel:`Apply filter(s)`. A check box that control whether filters are applied
or not. Filters are built with :ref:`query builder<query-builder-info>`. Checking
:guilabel:`Apply filter(s)` performs a search in the database if there are any
filters. When :guilabel:`Apply filter(s)` is unchecked, then all the inscriptions
from the database are visible in the list.

Format dialog
-------------

.. image:: /_static/format-dialog-example.jpg
  :width: 100 %
  :alt: Example of format dialog

:guilabel:`Show display format dialog` button toggles the display format
dialog. Using this dialog window user can select what information will be shown on
the main display for each individual inscription.

List on the left contains fields available for selection. List on the right
contains fields selected for display. It is possible to rearrange the order
of selected fields by using two buttons located under the right list.

Changes in selected fields are applied when dialog is closed by clicking
on :guilabel:`Hide display format dialog`.

:guilabel:`Display headers` checkbox is used to control whether field headers
are presented on the main display or not. Compare these two images. Left version
has headers turned on. Right version has headers turned off.

.. image:: /_static/headers-on.jpg
  :width: 49 %
  :alt: Display headers on

.. image:: /_static/headers-off.jpg
  :width: 49 %
  :alt: Display headers off

Map visibility control
----------------------

:guilabel:`Hide map`/:guilabel:`Show map` button. Does what it says.

Special symbols
---------------

This horizontal panel contains a button list with special symbols. It contains
symbols that might be not readily available on user's keyboard layout. Click on
each symbol's button copies that symbol in clipboard. This panel can be useful
when entering text in filters.

.. _query-builder-info:

Query builder
=============

This is the area where user builds queries/searches/filters for the database.
A query consists of rules, which can be grouped. Groups and rules are connected
by gray lines on the left helping user to trace relations. Each group has a set
of logical operators presented in it's upper left corner: NOT, AND, OR.
Operators describe how rules inside the group are combined together (AND, OR)
and if the group condition should be inversed (NOT). Here is the table that
show how logical operators work. For simplicity, it is demonstrated with only
two variables a and b. Each variable can have a value of TRUE or FALSE
denoted as T and F respectively.

+---+---+---------+--------+---------+---------+
| a | b | a AND b | a OR b | NOT a   | NOT b   |
+===+===+=========+========+=========+=========+
| T | T |    T    |   T    | F       | F       |
+---+---+---------+--------+---------+---------+
| T | F |    F    |   T    | F       | T       |
+---+---+---------+--------+---------+---------+
| F | T |    F    |   T    | T       | F       |
+---+---+---------+--------+---------+---------+
| F | F |    F    |   F    | T       | T       |
+---+---+---------+--------+---------+---------+

You can find more details and examples in `Wikipedia <https://en.wikipedia.org/wiki/Truth_table#Binary_operations>`_.

Each rule consists of a rule's name followed by operator and rule's value.
You can see various search example in :doc:`/searching`.
User can create, delete and rearrange rules/groups with drag and drop.

The idea behind query builder was to make it user friendly. Search in
the original Rundata is performed with help of regular expressions. This is
a powerful tool when you master it. It allows one to search by writing such
beauties as ``{b/t}{a/o}``. You might need more clicks and a bit more typing
with a query builder, but the representation of rules in query builder is
more user friendly.

