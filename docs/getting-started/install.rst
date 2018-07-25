============
Installation
============

.. module:: rundata

This section describes how to install Rundata-net on your own computer
or server, which is not needed for ordinary users. Rundata-net has different installation environments:

* development
* production

Dependencies differ somewhat between these environments. All the dependencies are listed [??APM] in the corresponding files in the ``requirements`` directory.

.. _dependencies:

Setting up the development version in Ubuntu 16.04 (64-bit)
=======================================================

.. highlight:: console

This is a step-by-step guide for setting up a development version
of Rundata-net on a clean Ubuntu 16.04. With minor modifications this guide might work with
other Ubuntu flavour versions as well as with Linux flavours.

Running Rundata-net is similar to running any other Django project. If you
are familiar with Django, you will already know the content of this guide.
A similar guide, which provides a bit more details about individual commands,
is provided by `Digital Ocean`_.

#. Update your system::

    $ sudo apt-get update
    $ sudo apt-get upgrade

#. Install the :program:`git`::

    $ sudo apt-get install git

#. Get the latest sources from
   https://gitlab.com/fralik/rundata-net. Clone the repository using
   :program:`git`::

    $ git clone https://gitlab.com/fralik/rundata-net.git

#. Install dependencies::

    $ cd rundata-net
    $ chmod a+x utility/install*.sh
    $ sudo utility/install_os_dependencies.sh install
    $ sudo -H pip3 install virtualenv
    $ virtualenv rundata_venv
    $ source rundata_venv/bin/activate
    $ utility/install_python_dependencies.sh

#. Adjust the settings to your needs. This may be done by way of environment
   variables. Here I show how to do it for Bash. Replace ``<some_path>``
   with the path to ``rundata-net`` on your system. Alternatively, this can be
   any path on your system. We will be using a SQLITE database for simplicity’s sake,
   but you are free to use any other supported database::

   $ export DATABASE_URL=sqlite:///<some_path>/django.sqlite3

   For example::

   $ export DATABASE_URL=sqlite:////home/vadim/rundata-net/django.sqlite3

#. Run database migrations::

    $ python manage.py migrate

#. Run development server::

    $ python manage.py runserver

#. Open your browser and go to http://127.0.0.1:8000. You should now see Rundata-net.

Note that we used :program:`virtualenv` to install the Python dependencies. You should repeat the ``source rundata_venv/bin/activate`` command each time you want to run Rundata-net.

.. _`Digital Ocean`: https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-16-04

