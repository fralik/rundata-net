========================
Development with Docker
========================

.. module:: rundata

This section describes how to run development version of Rundata-net with `Docker`_.
Using Docker, it is possible to have Rundata-net up and running much easier
than configuring everything from scratch (see :doc:`/dev/install`).

#. First of all you need Docker. You can use `Docker Desktop`_ if you are using
   macOS or Windows (greater than 10). Follow isntructions for your OS in order
   to get Docker.
#. Get `Rundata-net`_ source code. Use Git or download it directly. Here is a
   `link <https://gitlab.com/fralik/rundata-net/-/archive/master/rundata-net-master.zip>`_
   to the latest version provided as Zip archive.
#. Extract the archive to some folder.
#. Open a terminal programm and navigate to the folder where you extracted the
   source code to.
#. Build and run docker image::

	docker-compose -f local.yml up

   Note that depending on the OS you are running, you may need to run the above
   command as a super user, i.e. with ``sudo``.

That's it. If everything is fine you shall see no error messages. After that
you may open your browser and navigate to `<http://127.0.0.1:8000>`_.


.. _`Docker`: https://www.docker.com/
.. _`Docker Desktop`: https://www.docker.com/products/docker-desktop
.. _`Rundata-net`: https://gitlab.com/fralik/rundata-net
