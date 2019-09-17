frontend-component-header-edx
=========================

|Build Status| |Codecov| |npm_version| |npm_downloads| |license| |semantic-release|

This is the standard edX header for use in React applications. It has two exports:
  - **default**: The Header Component
  - **messages**: for i18n in the form of ``{ locale: { key: translatedString } }``

TODO
----

This reposistory needs to be added to transifex translation jobs.

Development
-----------

- Install requirements `npm install`
- Install peer dependencies `npm install @edx/frontend-analytics @edx/frontend-base @edx/frontend-i18n prop-types react`
- Start the example server `npm start`
- Visit http://localhost:1234

.. |Build Status| image:: https://api.travis-ci.org/edx/frontend-component-header-edx.svg?branch=master
   :target: https://travis-ci.org/edx/frontend-component-header-edx
.. |Codecov| image:: https://img.shields.io/codecov/c/github/edx/frontend-component-header-edx
   :target: https://codecov.io/gh/edx/frontend-component-header-edx
.. |npm_version| image:: https://img.shields.io/npm/v/@edx/frontend-component-header-edx.svg
   :target: https://www.npmjs.com/package/@edx/frontend-component-header-edx
.. |npm_downloads| image:: https://img.shields.io/npm/dt/@edx/frontend-component-header-edx.svg
   :target: @edx/frontend-component-header-edx
.. |license| image:: https://img.shields.io/npm/l/@edx/frontend-component-header-edx.svg
   :target: https://github.com/edx/frontend-component-header-edx/blob/master/LICENSE
.. |semantic-release| image:: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
   :target: https://github.com/semantic-release/semantic-release
