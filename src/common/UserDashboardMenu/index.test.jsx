import React from 'react';
import { mergeConfig } from '@edx/frontend-platform';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import {
  screen,
  render,
} from '@testing-library/react';
import { useEnterpriseConfig } from '@edx/frontend-enterprise-utils';

import UserDashboardMenu from './index'; // eslint-disable-line

jest.mock('@edx/frontend-enterprise-utils');
mergeConfig({ ENABLE_EDX_PERSONAL_DASHBOARD: true });
const IntlUserDashboardMenu = injectIntl(UserDashboardMenu);

describe('User Dashboard Menu', () => {
  const Wrapper = children => (
    // eslint-disable-next-line react/jsx-filename-extension
    <IntlProvider locale="en">
      {children}
    </IntlProvider>
  );

  it('should render dashboard menu in the user menu dropdown', () => {
    useEnterpriseConfig.mockReturnValue({
      enterpriseLearnerPortalLink: {
        type: 'item',
        href: 'http://localhost:8000',
        content: 'Dashboard',
      },
      enterpriseCustomerBrandingConfig: {
        logoAltText: 'fake-enterprise-name',
        logoDestination: 'http://fake.url',
        logo: 'http://fake-logo.url',
      },
    });

    render(Wrapper(<IntlUserDashboardMenu />));

    const dashboardSwitchMenu = screen.getByText('SWITCH DASHBOARD');
    const dashboardMenu = screen.getByText('Personal');
    expect(dashboardMenu).toBeTruthy();
    expect(dashboardSwitchMenu).toBeTruthy();
  });
});
