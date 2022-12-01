frontend-component-header-edx
=============================

|npm_version| |npm_downloads| |license|

This is the standard edX header for use in React applications. It has two exports:

- **default**: The Header Component
- **messages**: for i18n in the form of ``{ locale: { key: translatedString } }``

Usage
-----

``import Header, { messages } from '@edx/frontend-component-header-edx';`` 

Development
-----------

- Install requirements `npm install`
- Install peer dependencies `npm install @edx/frontend-analytics @edx/frontend-base @edx/frontend-i18n prop-types react`
- Start the example server `npm start`
- Visit http://localhost:1234

.. |npm_version| image:: https://img.shields.io/npm/v/@edx/frontend-component-header-edx.svg
   :target: https://www.npmjs.com/package/@edx/frontend-component-header-edx
.. |npm_downloads| image:: https://img.shields.io/npm/dt/@edx/frontend-component-header-edx.svg
   :target: @edx/frontend-component-header-edx
.. |license| image:: https://img.shields.io/npm/l/@edx/frontend-component-header-edx.svg
   :target: https://github.com/edx/frontend-component-header-edx/blob/master/LICENSE
