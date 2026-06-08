.. title:: Testing the Header Component from Within an MFE

Testing the Header Component from Within an MFE
================================================

.. note::
   **Warning:** This doc *may* work as-is, but may not. The process described worked for the author, but has not been verified by another. If you verify or fix this doc, please update or close `BOMS-619`_, the ticket for follow-up review.

.. _BOMS-619: https://2u-internal.atlassian.net/browse/BOMS-619

Overview
--------

This guide describes how to test local changes to ``frontend-component-header-edx`` by wiring the component source directly into a consuming MFE using a webpack alias.

This approach *should* work with any MFE that imports ``@edx/frontend-component-header``.

.. note::
   These instructions assume you are running the MFE inside the edX devstack (Docker). If you are running the MFE from your host machine, the changes are the same except the header source path in ``webpack.dev.config.js`` should be the absolute local path to the header repo's ``src/`` directory (e.g. ``/Users/yourname/edx/src/frontend-component-header-edx/src``) instead of the Docker path shown below.

Prerequisites
-------------

- The edX devstack is running.
- ``frontend-component-header-edx`` is checked out locally on the branch you want to test. On the host machine, clone it to ``<DEVSTACK_DIR>/src/frontend-component-header-edx``, where ``<DEVSTACK_DIR>`` is the directory containing your devstack installation. The devstack mounts this location inside the MFE container at ``/edx/app/src/frontend-component-header-edx/``.

Step 1: Install dependencies in the header repo
------------------------------------------------

The header component's direct dependencies (those listed under ``dependencies`` in its ``package.json``, such as ``react-responsive``) must be installed in the header repo itself. Webpack resolves these from the header's own ``node_modules``, not from the consuming MFE.

Run the following from your host machine or in the MFE container:

.. code-block::

   cd /path/to/frontend-component-header-edx
   npm install

Step 2: Add a webpack alias to the consuming MFE
-------------------------------------------------

Open ``webpack.dev.config.js`` in ``frontend-app-learning`` and add the header source alias along with peer-dependency aliases. The peer-dependency aliases ensure that both the header source and the MFE use the same instances of shared libraries (React, Paragon, etc.), preventing duplicate-module errors.

The changes below assume the existing config uses the pattern of calling ``createConfig`` and then adding to ``config.resolve.alias``.

Add the following block before the ``createConfig`` call:

.. code-block::

   // Add before the createConfig call:
   const headerPeerDeps = [
     '@edx/frontend-platform',
     '@openedx/paragon',
     'prop-types',
     'react',
     'react-dom',
     'react-redux',
     'react-router-dom',
   ];

   const headerPeerAliases = Object.fromEntries(
     headerPeerDeps.map(pkg => [pkg, path.resolve(__dirname, 'node_modules', pkg)]),
   );

Option 1: If ``config.resolve.alias`` already exists in the file, add the ``frontend-component-header`` and ``headerPeerAliases`` lines to the end, like this ``frontend-app-learning`` example:

.. code-block::

   // Add after the createConfig(...) call:
   config.resolve.alias = {
     ...config.resolve.alias,
     '@src': path.resolve(__dirname, 'src'),
     '@edx/frontend-component-header': '/edx/app/src/frontend-component-header-edx/src',
     ...headerPeerAliases,
   };

Option 2: If ``config.resolve.alias`` doesn't yet exist in the file, use the following directly:

.. code-block::

   config.resolve.alias = {
     ...config.resolve.alias,
     '@edx/frontend-component-header': '/edx/app/src/frontend-component-header-edx/src',
     ...headerPeerAliases,
   };

The path ``/edx/app/src/frontend-component-header-edx/src`` is the location of the header source inside the devstack Docker container. Adjust this path if your devstack layout differs or if you are running the MFE on your host machine.

Step 3: Update the SCSS import
-------------------------------

The consuming MFE's main SCSS file typically imports the header's compiled stylesheet from its ``dist/`` folder. Because we are now pointing to the unbuilt source, that path does not exist. Change the import to reference the source ``index.scss`` directly.

In ``src/index.scss``, find the header import and change it:

.. code-block::

   /* Before */
   @import "~@edx/frontend-component-header/dist/index";

   /* After */
   @import "~@edx/frontend-component-header/index";

Step 4: Restart the MFE and verify
------------------------------------

To restart from devstack:

.. code-block::

   make frontend-app-learning-stop

   # Starting the container will run npm start
   make frontend-app-learning-up

Verifying your changes are active
----------------------------------

If the changes you are testing produce obvious UI differences, confirm they appear. If the changes are subtle or internal, use browser DevTools to confirm the local source is being used:

1. Open DevTools → **Sources** tab.
2. Search for the component you are testing (e.g. ``LearningHeader``, ``StudioHeader``, or ``Header``).
3. The source file should be human-readable and match your local checkout.

Troubleshooting
---------------

Module not found errors for header dependencies
***********************************************

After adding the webpack alias, the MFE may fail to compile with one or more errors like:

.. code-block::

   Module not found: Can't resolve 'react-responsive'
     in '/edx/app/src/frontend-component-header-edx/src'
   Module not found: Can't resolve '@2uinc/frontend-enterprise-utils'
     in '/edx/app/src/frontend-component-header-edx/src/learning-header'

Multiple errors of this form are expected if ``npm install`` has not been run in the header repo. The header's direct dependencies are resolved from the header repo's own ``node_modules``.

**Fix:** Run ``npm install`` in the header repo (Step 1 above), then restart the MFE.

Alternatively, this error might appear if there is a new peer dependency not yet listed in this doc.

Stale module errors after npm install completes
***********************************************

If you leave the MFE running while ``npm install`` is executing in the header repo, you may see some errors resolve, but still see additional module-not-found errors.

**Fix:** Restart the MFE. A clean compile against the fully-installed ``node_modules`` clears these.

Can't find stylesheet to import (SCSS error)
********************************************

.. code-block::

   ERROR in ./src/index.scss
   Module build failed (from sass-loader):
   Can't find stylesheet to import.
     3 │ @import "~@edx/frontend-component-header/dist/index";

Once the webpack alias is active, ``@edx/frontend-component-header`` resolves to the local source directory, which has no ``dist/`` folder.

**Fix:** Apply the SCSS import change described in Step 3 above, then restart the MFE.
