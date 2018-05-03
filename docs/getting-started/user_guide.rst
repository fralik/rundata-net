================
Quick user guide
================

.. module:: rundata

This section gives a quick introduction to Rundata-net interface.

Rundata-net is essentially an interface to a database. Since the database doesn't change very often, I adopted a rather radical approach in accessing it. Most of the site functions are executed inside user's browser, including the database. When you open the main page, it takes some time to load the site. This is the point where the database is transfered to you. Once it is transfered, the rest of functionality should be quick.

The main page is divided into several areas which I refer to as panels. They are shown with numbers in the image below.

.. image:: /_static/panels.jpg
  :width: 100 %
  :alt: Rundata-net main screen

From left to right and from top to bottom:

#. List of inscription aliases. ​It's a tree view where each node corresponds
   to individual inscription. Some inscriptions have child node which are
   aliases. An alias is simply a different ID of a particular inscription.
   Aliases contains the same information as their parent. If you select one or
   multiple inscriptions then the information about them in displayed in
   panel #2 (main display). There are around 10 000 inscriptions in
   the database. I guess no one would want to select all of them at once,
   so their display is organized in pages. Each page contains maximum of
   100 inscriptions. This is called pagination. When you do a search,
   chances are that you will end up with less than 100 inscriptions,
   so they all will be available for selection on a single page.

   Below the list of inscriptions you will see a status box saying how many
   inscription is available for selection.

   Pagination control. Allows you to navigate through pages.

#. Main display. This is a text are that will show information about selected
   inscriptions. It is possible to adjust what kind of information will be
   selected. Use 'show display format dialog' button for this. The main
   display imitates editable behaviour. This means that if you click on it,
   you are able to type in or delete text. This is done in order to support
   keyboard navigation and shortcuts for text: select all, copy, paste.

#. Map. Shows a place mark for selected inscriptions if coordinates
   are available. It shows the found location of inscription and not
   the current location. It is known, that some coordinates are wrong.
   Since Rundata-net is simply a different view program for SMDB,
   it inherits SMDB's flaws.

#. Horizontal panel of control elements and buttons.

   :guilabel:`Apply filter(s)`. A check box that control filters are applied
   or not. When user searches for something in the database, she essentially
   filters inscriptions. Hence the name.

   :guilabel:`Show display format dialog` button toggles the display format
   dialog. On that dialog you can select what information will be shown on
   the main display.

   :guilabel:`Hide map` button. Does what it says.

#. ​Query builder. This is the area where you will build your
   queries/searches/filters to the database. A query consists of rules, which
   can be grouped into groups. Groups and rules are connected by gray lines
   helping you to trace the relations. Each group has a set of logical
   operators in it's upper left corner: NOT, AND, OR. They describe how rules
   inside the group are combined together (AND, OR) and if the group condition
   should be inversed (NOT). Each rule consists of a filter name, which
   is followed by operators and value fields. You can see various search
   example in 'How to search section'. You can create, delete and rearrange
   rules/groups with drag and drop.

   The idea behind query builder was to make it user friendly. Search in
   the original Rundata is performed with help of regular expressions. This is
   a powerful tool when you master it. It allows one to search by writing such
   beauties as {b/t}{a/o}. You might need more clicks and a bit more typing
   with a query builder, but the representation of rules in query builder is
   more user friendly.