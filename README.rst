#############################
frontend-component-header-edx
#############################

|npm_version| |npm_downloads| |license|

********
Purpose
********

This is the standard edX header for use in React applications. It has four exports:

- **default**: The Header Component
- **messages**: for i18n in the form of ``{ locale: { key: translatedString } }``
- **LearnerHeader** Header component for the Learner MFE
- **StudioHeader** Header component for Studio

Cloning and Startup
===================

.. code-block::


  1. Clone your new repo:

    ``git clone https://github.com/openedx/frontend-component-header-edx.git``

  2. Use node v18.x.

    The current version of the micro-frontend build scripts support node 18.
    Using other major versions of node *may* work, but this is unsupported.  For
    convenience, this repository includes an .nvmrc file to help in setting the
    correct node version via `nvm <https://github.com/nvm-sh/nvm>`_.

  3. Install npm dependencies:

    ``cd frontend-component-header-edx && npm ci``

  4. Start the dev server:

    ``npm start``

Usage
=====

``import Header, { messages } from '@edx/frontend-component-header-edx';`` 

Plugins
=======
This component can be customized using `Frontend Plugin Framework <https://github.com/openedx/frontend-plugin-framework>`_.

The parts of this component that can be customized in that manner are documented `here </src/plugin-slots>`_.

Development
===========

- Install requirements `npm install`
- Install peer dependencies `npm install @edx/frontend-analytics @edx/frontend-platform @edx/frontend-i18n prop-types react`
- Start the example server `npm start`
- Visit http://localhost:1234

Contributing
============

Since the exports from this package are used throughout many micro-frontends, it is important that updates are communicated effectively throughout the organization.

When making updates to this repo, pull requests should be shared on the **#edx-fedx** Slack channel for soliciting review.

License
=======

The code in this repository is licensed under the AGPLv3 unless otherwise
noted.

Please see `LICENSE <LICENSE>`_ for details.

Reporting Security Issues
=========================

Please do not report security issues in public. Please email security@openedx.org.


.. |npm_version| image:: https://img.shields.io/npm/v/@edx/frontend-component-header-edx.svg
   :target: https://www.npmjs.com/package/@edx/frontend-component-header-edx
.. |npm_downloads| image:: https://img.shields.io/npm/dt/@edx/frontend-component-header-edx.svg
   :target: @edx/frontend-component-header-edx
.. |license| image:: https://img.shields.io/npm/l/@edx/frontend-component-header-edx.svg
   :target: https://github.com/edx/frontend-component-header-edx/blob/master/LICENSE
