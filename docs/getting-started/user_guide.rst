================
Quick user guide
================

.. module:: rundata.userguide

This section gives a quick introduction to the Rundata-net interface.

Rundata-net is essentially an interface to a database. Since the database doesn't change very often, I have adopted a rather radical approach to accessing it. Most of the site functions are executed inside the user's browser, which includes the database. When the user opens the main page, it will take some time to load the site. This is the point where the database is transferred to the user's computer. Once it is transferred, all functions should work smoothly.

The main page is divided into several areas, which I refer to as panels. These are shown with numbers in the image below.

.. image:: /_static/panels.jpg
  :width: 100 %
  :alt: Rundata-net main screen

#. List of inscriptions retrieved and their total number.

#. Main display.

#. Map display.

#. Panels of control elements and buttons.

#. Query builder.


.. _guide-list-of-inscriptions:

List of inscriptions
====================

​In this list each node corresponds to an individual inscription.
The inscriptions are referenced by a unique name/ID called a signature, see
:doc:`/db/signature`. The name/ID of some inscriptions have changed iver time. One example is the inscription :samp:`Öl 2`, which has
been known as :samp:`B 1076` and :samp:`L 1324`. The list of inscriptions
contains only the most recent names, i.e. neither :samp:`B 1076`, nor
:samp:`L 1324`. Such former names (if any) are given on the
:ref:`main display<main-display-info>` when an inscription is selected.

When a user selects an inscription from the list, information about it is
displayed on the :ref:`main display<main-display-info>` panel. It is possible
to select single inscriptions as well as multiple ones. General selection principles
apply for the selection of multiple inscriptions: use :kbd:`Control` to add
individual inscriptions to a selection, use :kbd:`Shift` to add a selection.

Below the list of inscriptions a status text indicates the number of
inscriptions available for selection. This can be useful when performing
a search. The status text will then give the number of results.

.. _main-display-info:

Main display
============

.. image:: /_static/main-display-example.jpg
  :width: 100 %
  :alt: Example of information presented on the main display

Here, information on the selected
inscriptions is given.
Use the 'Search parameters' button for adjusting the kind of information to be displayed.

The main display can be edited for the user's need. Thus clicking on the display
enables you to type in or delete text. This is done in order to support
keyboard navigation and the shortcuts select all, copy, paste. The user may thus, e.g.
take all the information provided
by Rundata-net and enter it into another program/app. Simply click on the main
display, select all the text, open another application and paste the text into it.

.. _map-info:

Map display
===========

The map shows place marks for the selected inscriptions if coordinates
are available. It shows the location where the inscription was found and not
its current location. Some such coordinates are known to be wrong.
However, since Rundata-net is in this regard simply a different view program for SMDB,
it will inevitably inherit such flaws in the SMDB.

When a placemark is clicked on, the main display is scrolled in order to render the inscription
referenced by that particular placemark visible.

Control panels
==============

There are several horizontally aligned panels of control elements and buttons.

Filter control
--------------

:guilabel:`Apply filter(s)`. This check box controls whether filters are to be applied
or not. Filters are built with the :ref:`query builder<query-builder-info>`. Checking 
:guilabel:`Apply filter(s)` executes a search in the database if 
filters have been applied. If :guilabel:`Apply filter(s)` is unchecked all the inscriptions
in the database are presented in the list.

Search parameters
-------------

.. image:: /_static/format-dialog-example.jpg
  :width: 100 %
  :alt: Example of format dialog

The :guilabel:`Show display format dialog` button opens the search parameter dialogue window. In this window, the user can select the information to be shown on
the main display for each individual inscription.

The list to the left contains the fields available for selection. The list to the right
contains the fields selected for display. The order
of the selected fields may be rearranged by using the two buttons located under the right-hand list.

Changes in the selected fields are applied when the dialogue window is closed by clicking
on :guilabel:`Hide display format dialog`.

The :guilabel:`Display headers` checkbox is used to control whether any field headers
should be presented on the main display or not. Compare these two images. The version to the left
has the headers turned on. The version to the right has the headers turned off.

.. image:: /_static/headers-on.jpg
  :width: 49 %
  :alt: Display headers on

.. image:: /_static/headers-off.jpg
  :width: 49 %
  :alt: Display headers off

Map visibility control
----------------------

The :guilabel:`Hide map`/:guilabel:`Show map` button is self-explanatory.

Special symbols
---------------

This horizontal panel contains a list of buttons with special symbols. It contains
symbols that might not be readily available on the user's keyboard layout. Clicking on
a symbol's button produces a copy of that symbol in the clipboard. This panel can be useful
when entering text in filters.

.. _query-builder-info:

Query builder
=============

In this area the user builds queries/searches/filters for the database.
A query consists of rules, which can be grouped. Groups and rules are connected
by gray lines to the left, which help the user to trace relations. Each group has a set
of logical operators presented in its upper left corner: NOT, AND, OR.
Operators describe how rules inside the group are to be combined (AND, OR)
and if the group condition should be inversed (NOT). The table below 
shows how logical operators work. For the sake of simplicity, it is demonstrated with only
two variables a and b. Each variable can have a value of TRUE or FALSE,
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

More details and examples may be found in `Wikipedia <https://en.wikipedia.org/wiki/Truth_table#Binary_operations>`_.

Each rule consists of a rule name followed by an operator and a rule value.
You can find various search examples in :doc:`/searching`.
The user can create, delete and rearrange rules/groups with drag and drop.

The guiding idea behind the query builder has been to make it user-friendly. Searches in
the original Rundata are performed by way of regular expressions. This is
a powerful tool, when mastered. It allows one to search by way of 
beauties such as ``{b/t}{a/o}``. You may need more clicks and a bit more typing
with a query builder, but the representation of rules in it is no doubt
more user-friendly.

