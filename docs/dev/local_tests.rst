=======================================
Developing and testing javascript code
=======================================

This section describes how to develop and test javascript code in Rundata-net.
Rundata-net is based on javascript embedded directly on the HTML pages. It's an
easy solution, which served us well over the years. Described here is a more modern
approach, which should help you develop and test javascript code more efficiently.

Install node.js on your system and then install project dependencies:

.. code-block:: shell

    npm install

Running tests
=============

To run the tests, use the following command:

.. code-block:: shell

    npm test


Debugging tests in VS Code
==========================

To debug the tests in VS Code, you can do the following:

1. Open test file in VS Code.
2. Run command `Debug: Debug npm script`.
3. Select `test uvu rundatanet/js/tests`.

