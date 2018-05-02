============
Installation
============

.. module:: rundata

This section describes how you can install Rundata-net on your own machine
or server. Rundata-net has different installation environments:

* development
* production

Dependencies are a bit different for these environments. All the dependencies are lsited in corresponding files in ``requirements`` directory.

.. _dependencies:

Setting up development version in Ubuntu 16.04 (64-bit)
=======================================================

.. highlight:: console

Here is a step by step guide on how you can set up development version
of Rundata-net on a clean Ubuntu 16.04. This guide might work with
other Ubuntu flavours versions and Linux flavours with minor modifications.

Running Rundata-net is the same as running any other Django project. If you
are familiar with Django, then you already know the content of this guide.
A similar guide which provides a bit more details about individual commands
is provided by `Digital Ocean`_.

#. Update your system::

    $ sudo apt-get update
    $ sudo apt-get upgrade

#. Install :program:`git`::

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

#. Adjust settings to your needs. It is possible to do through environment
   variables. Here I will show how to make it for Bash. Replace ``<some_path>``
   with the path to ``rundata-net`` on your system. Alternatively it can be
   any path on your system. We are going to use SQLITE database for simplicity,
   but you are free to use any other supported database::

   $ export DATABASE_URL=sqlite:///<some_path>/django.sqlite3

   For example::

   $ export DATABASE_URL=sqlite:////home/vadim/rundata-net/django.sqlite3

#. Run database migrations::

    $ python manage.py migrate

#. Run development server::

    $ python manage.py runserver

#. Open your browser and go to http://127.0.0.1:8000. You should see Rundata-net.

Note that we used :program:`virtualenv` to install Python dependencies. You should repeat ``source rundata_venv/bin/activate`` command each time you want to run Rundata-net.

.. _`Digital Ocean`: https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-16-04

