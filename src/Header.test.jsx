/* eslint-disable react/prop-types */
import React from 'react';
import { act } from 'react-dom/test-utils';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import TestRenderer from 'react-test-renderer';
import { isEnterpriseUser, useEnterpriseConfig } from '@edx/frontend-enterprise-utils';
import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import { Context as ResponsiveContext } from 'react-responsive';
import { MemoryRouter } from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import Header from './index';
import { initializeMockApp } from './setupTest';

jest.mock('@edx/frontend-platform');
jest.mock('@edx/frontend-enterprise-utils');

getConfig.mockReturnValue({});

const APP_CONTEXT_CONFIG = {
  LMS_BASE_URL: process.env.LMS_BASE_URL,
  LOGIN_URL: process.env.LOGIN_URL,
  LOGOUT_URL: process.env.LOGOUT_URL,
  MARKETING_SITE_BASE_URL: process.env.MARKETING_SITE_BASE_URL,
  ORDER_HISTORY_URL: process.env.ORDER_HISTORY_URL,
  LOGO_URL: process.env.LOGO_URL,
};

const HeaderContext = ({ width, contextValue }) => (
  <MemoryRouter>
    <ResponsiveContext.Provider value={width}>
      <IntlProvider locale="en" messages={{}}>
        <AppContext.Provider
          value={contextValue}
        >
          <Header />
        </AppContext.Provider>
      </IntlProvider>
    </ResponsiveContext.Provider>
  </MemoryRouter>
);

describe('<Header />', () => {
  beforeEach(() => {
    useEnterpriseConfig.mockReturnValue({});
    getConfig.mockReturnValue({
      ENABLE_EDX_PERSONAL_DASHBOARD: true,
      SUPPORT_URL: 'http://localhost:18000/support',
    });
  });

  beforeAll(async () => {
    // We need to mock AuthService to implicitly use `getAuthenticatedUser` within `AppContext.Provider`.
    await initializeMockApp();
  });

  const mockUseEnterpriseConfig = () => {
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
  };

  const mockIsEnterpriseUser = () => {
    isEnterpriseUser.mockReturnValue(true);
  };

  it('renders correctly for unauthenticated users on desktop', () => {
    const contextValue = {
      authenticatedUser: null,
      config: APP_CONTEXT_CONFIG,
    };
    const component = <HeaderContext width={{ width: 1280 }} contextValue={contextValue} />;

    const wrapper = TestRenderer.create(component);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('renders correctly for authenticated users on desktop', () => {
    const contextValue = {
      authenticatedUser: {
        userId: 'abc123',
        username: 'edX',
        name: 'edX',
        roles: [],
        administrator: false,
      },
      config: APP_CONTEXT_CONFIG,
    };
    const component = <HeaderContext width={{ width: 1280 }} contextValue={contextValue} />;

    const wrapper = TestRenderer.create(component);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('displays user menu in dropdown', () => {
    const authenticatedUser = {
      userId: 'abc123',
      username: 'edX',
      name: 'edX',
      email: 'test@example.com',
      roles: [],
      administrator: false,
    };
    const contextValue = {
      authenticatedUser,
      config: APP_CONTEXT_CONFIG,
    };
    const component = <HeaderContext width={{ width: 1280 }} contextValue={contextValue} />;
    const wrapper = render(component);
    fireEvent.click(wrapper.container.querySelector('#menu-dropdown'));

    expect(screen.getByText(authenticatedUser.name)).toBeInTheDocument();
    expect(screen.getByText(authenticatedUser.email)).toBeInTheDocument();
  });

  it('renders correctly for authenticated users on desktop with or without learner portal links', async () => {
    const contextValue = {
      authenticatedUser: {
        userId: 'abc123',
        username: 'edX',
        roles: [],
        administrator: false,
      },
      config: APP_CONTEXT_CONFIG,
    };
    const component = <HeaderContext width={{ width: 1280 }} contextValue={contextValue} />;

    // When learner portal links are not present, Order History should be a dropdown item
    let wrapper = render(component);
    const flushPromises = () => new Promise(setImmediate);
    await act(async () => {
      await flushPromises();
      fireEvent.click(wrapper.container.querySelector('#menu-dropdown'));
    });

    expect(screen.getByText('Order History')).toBeInTheDocument();
    expect(screen.queryByText('Career')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    wrapper.unmount();

    // When learner portal links are present, Order History and Career should not be a dropdown item
    // We do this in the same test to avoid weird things about jest wanting you to use
    // the "correct" act() function (even though it gives the same warning regardless
    // of where you import it from, be it react-dom/test-utils or react-test-renderer).
    mockIsEnterpriseUser();
    mockUseEnterpriseConfig();
    wrapper = render(component);
    await act(async () => {
      await flushPromises();
      fireEvent.click(wrapper.container.querySelector('#menu-dropdown'));
    });
    expect(screen.queryByText('Order History')).not.toBeInTheDocument();
    expect(screen.queryByText('Career')).not.toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
  });

  it('renders correctly for unauthenticated users on mobile', () => {
    const contextValue = {
      authenticatedUser: null,
      config: APP_CONTEXT_CONFIG,
    };
    const component = <HeaderContext width={{ width: 500 }} contextValue={contextValue} />;

    const wrapper = TestRenderer.create(component);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('renders correctly for authenticated users on mobile', () => {
    const contextValue = {
      authenticatedUser: {
        userId: 'abc123',
        username: 'edX',
        name: 'edX Test',
        roles: [],
        administrator: false,
      },
      config: APP_CONTEXT_CONFIG,
    };
    const component = <HeaderContext width={{ width: 500 }} contextValue={contextValue} />;

    const wrapper = TestRenderer.create(component);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  describe('minimal', () => {
    beforeEach(() => {
      getConfig.mockReturnValue({
        MINIMAL_HEADER: true,
      });
    });

    afterEach(() => {
      getConfig.mockReturnValue({
        MINIMAL_HEADER: false,
      });
    });

    it('renders correctly for unauthenticated users when minimal', () => {
      const contextValue = {
        authenticatedUser: null,
        config: APP_CONTEXT_CONFIG,
      };
      const component = <HeaderContext width={{ width: 1280 }} contextValue={contextValue} />;

      const wrapper = TestRenderer.create(component);

      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('renders correctly for authenticated users when minimal', () => {
      const contextValue = {
        authenticatedUser: {
          userId: 'abc123',
          username: 'edX',
          name: 'edX Test',
          roles: [],
          administrator: false,
        },
        config: APP_CONTEXT_CONFIG,
      };
      const component = <HeaderContext width={{ width: 1280 }} contextValue={contextValue} />;

      const wrapper = TestRenderer.create(component);

      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
