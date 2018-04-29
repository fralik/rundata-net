###########
Rundata-net
###########

Rundata-net is a web version of `Scandinavian Runic-text Data Base`_. It is written in Python/Django and uses JavaScript (jQuery) extensively.

The original Rundata app is a desktop application with native support of Windows platform only. I first wrote a cross-platform version, `Rundata-qt`_, in C++/Qt, but after a while decided to give web version a try. Merely as a proof of concept in the beginning. As for now, Rundata-net supersedes Rundata-qt.

Rundata-net tries to be a close clone of Rundata. This means that I didn't try to fix any things in the database itself. Rundata has a long history. It's functionality can seem small at the beginning, however it is still greater than the functionality of Rundata-net. Rundata-net doesn't support all kinds of searchers that Rundata does. Yet.

There is a website that runs the latest version of Rundata-net. You can find it at https://www.rundata.info. Just to be clear, ``Rundata-net`` is the name of this project. ``www.rundata.info`` is a website that runs ``Rundata-net``. The source code of ``Rundata-net`` is provided under the terms of GNU GPLv3 license. This means that you can grab a copy of ``Rundata-net`` and run it on your website or local machine.

Just a couple of words about how ``Rundata-net`` works. It is a single page application (SPA) that runs in your browser. It has a server side and a client side. Server side is powered by Django, but it is not used for a lot of things now. The client side is where all the magic happens. I took a quite radical approach regarding the database (some might event call it *wrong*). Because the database is known not to change very often, I decided to expose it to the client size completely. So that, once loaded, there are no server requests to search the database. I plan to continue with this approach when I introduce user settings. Modern browsers can do a lot of things inside them, so why not use this?! Of course, this has potential limitations on user's hardware. However, modern smartphones are so powerful that handling a small database like SRDB in the browser is not a problem at all. Because of this client size processing, the loading of the website takes some time.

The client side utilizes a lot of excellent Javascript libraries.

License
-------

Copyright (c) 2018, Vadim Frolov

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see http://www.gnu.org/licenses/.

:License: GPLv3

================
Acknowledgements
================

This project won't be possible without the help of:

* `Sofia Pereswetoff-Morath`_. Sofia provided scientific input and encouragement.
* `Jan Owe`_. Jan is the maintainer of the original Rundata program and the database.
* `Marcus Smith`_. Marcus developed perhaps the first web version of Rundata. I used his website for inspiration and CSS styles.

.. _`Scandinavian Runic-text Data Base`: http://www.nordiska.uu.se/forskn/samnord.htm/?languageId=1
.. _`Rundata-qt`: https://bitbucket.org/fralik/rundata-qt
.. _`Sofia Pereswetoff-Morath`: sofia.pereswetoff-morath@su.se
.. _`Jan Owe`: http://runbloggen.gamlebo.se/
.. _`Marcus Smith`: https://www.runinskrifter.net/
