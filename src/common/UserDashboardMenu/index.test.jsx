import React from 'react';
import { mergeConfig } from '@edx/frontend-platform';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import {
  screen,
  render,
} from '@testing-library/react';

import UserDashboardMenu from './index'; // eslint-disable-line

mergeConfig({ ENABLE_EDX_PERSONAL_DASHBOARD: true });
const IntlUserDashboardMenu = injectIntl(UserDashboardMenu);

describe('User Dashboard Menu', () => {
  const Wrapper = children => (
    // eslint-disable-next-line react/jsx-filename-extension
    <IntlProvider locale="en">
      {children}
    </IntlProvider>
  );

  it('should render enterprise dashboard menu in the user menu dropdown', () => {
    render(Wrapper(<IntlUserDashboardMenu
      enterpriseOrg="Fake Enterprise"
      enterpriseSrc="http://fake.url"
      hasEnterpriseAccount
    />));

    const dashboardSwitchMenu = screen.getByText('SWITCH DASHBOARD');
    const personalDashboard = screen.getByText('Personal');
    const enterpriseDashboard = screen.getByText('Fake Enterprise Dashboard');
    expect(dashboardSwitchMenu).toBeTruthy();
    expect(personalDashboard).toBeTruthy();
    expect(enterpriseDashboard).toBeTruthy();
  });
  it('should render only one dashboard menu in the user menu dropdown when not enterprise user', () => {
    render(Wrapper(<IntlUserDashboardMenu />));

    const personalDashboard = screen.getByText('Dashboard');
    expect(personalDashboard).toBeTruthy();
  });
});
