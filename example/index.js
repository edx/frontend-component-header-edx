import React from 'react';
import { render } from 'react-dom';
import { IntlProvider } from '@edx/frontend-i18n';

import './index.scss';
import SiteHeader from '../src/';

const App = () => (
  <div>
    <IntlProvider locale="en">
      <SiteHeader />
    </IntlProvider>
  </div>
);

render(<App />, document.getElementById('root'));
