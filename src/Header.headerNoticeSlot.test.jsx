/* eslint-disable react/prop-types */
import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { useEnterpriseConfig } from '@2uinc/frontend-enterprise-utils';
import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import { Context as ResponsiveContext } from 'react-responsive';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import Header from './index';
import { initializeMockApp } from './setupTest';

jest.mock('@edx/frontend-platform');
jest.mock('@2uinc/frontend-enterprise-utils');
jest.mock('./plugin-slots/HeaderNoticeSlot', () => function HeaderNoticeSlot() {
  return <div data-testid="header-notice-slot" />;
});

getConfig.mockReturnValue({});

const APP_CONTEXT_CONFIG = {
  LMS_BASE_URL: process.env.LMS_BASE_URL,
  LOGIN_URL: process.env.LOGIN_URL,
  LOGOUT_URL: process.env.LOGOUT_URL,
  MARKETING_SITE_BASE_URL: process.env.MARKETING_SITE_BASE_URL,
  ORDER_HISTORY_URL: process.env.ORDER_HISTORY_URL,
  LOGO_URL: process.env.LOGO_URL,
};

const renderHeader = (width, authenticatedUser) => render(
  <MemoryRouter>
    <ResponsiveContext.Provider value={{ width }}>
      <IntlProvider locale="en" messages={{}}>
        <AppContext.Provider value={{ authenticatedUser, config: APP_CONTEXT_CONFIG }}>
          <Header />
        </AppContext.Provider>
      </IntlProvider>
    </ResponsiveContext.Provider>
  </MemoryRouter>,
);

describe('<Header /> header notice slot', () => {
  beforeAll(async () => {
    await initializeMockApp();
  });

  beforeEach(() => {
    useEnterpriseConfig.mockReturnValue({});
  });

  it('renders the slot once for authenticated users on desktop', () => {
    renderHeader(1280, { userId: 'abc123', username: 'edX', name: 'edX User' });

    expect(screen.getAllByTestId('header-notice-slot')).toHaveLength(1);
  });

  it('renders the slot once for authenticated users on mobile', () => {
    renderHeader(500, { userId: 'abc123', username: 'edX', name: 'edX User' });

    expect(screen.getAllByTestId('header-notice-slot')).toHaveLength(1);
  });

  it('does not render the slot for unauthenticated users', () => {
    renderHeader(1280, null);

    expect(screen.queryByTestId('header-notice-slot')).not.toBeInTheDocument();
  });
});
