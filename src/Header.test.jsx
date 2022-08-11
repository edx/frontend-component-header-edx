/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react';
import { act } from 'react-dom/test-utils';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import TestRenderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { useEnterpriseConfig } from '@edx/frontend-enterprise-utils';
import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import { Context as ResponsiveContext } from 'react-responsive';

import Header from './index';

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

describe('<Header />', () => {
  beforeEach(() => {
    useEnterpriseConfig.mockReturnValue({});
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

  it('renders correctly for unauthenticated users on desktop', () => {
    const component = (
      <ResponsiveContext.Provider value={{ width: 1280 }}>
        <IntlProvider locale="en" messages={{}}>
          <AppContext.Provider
            value={{
              authenticatedUser: null,
              config: APP_CONTEXT_CONFIG,
            }}
          >
            <Header />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

    const wrapper = TestRenderer.create(component);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('renders correctly for authenticated users on desktop', () => {
    const component = (
      <ResponsiveContext.Provider value={{ width: 1280 }}>
        <IntlProvider locale="en" messages={{}}>
          <AppContext.Provider
            value={{
              authenticatedUser: {
                userId: 'abc123',
                username: 'edX',
                roles: [],
                administrator: false,
              },
              config: APP_CONTEXT_CONFIG,
            }}
          >
            <Header />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

    const wrapper = TestRenderer.create(component);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('renders correctly for authenticated users on desktop with or without learner portal links', async () => {
    const component = (
      <ResponsiveContext.Provider value={{ width: 1280 }}>
        <IntlProvider locale="en" messages={{}}>
          <AppContext.Provider
            value={{
              authenticatedUser: {
                userId: 'abc123',
                username: 'edX',
                roles: [],
                administrator: false,
              },
              config: APP_CONTEXT_CONFIG,
            }}
          >
            <Header />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

    // When learner portal links are not present, Order History should be a dropdown item
    let wrapper = mount(component);
    const flushPromises = () => new Promise(setImmediate);
    await act(async () => {
      await flushPromises();
      wrapper.update();
      wrapper.find('DropdownToggle').simulate('click');
    });

    expect(wrapper.find('a[children="Order History"]')).toHaveLength(1);
    expect(wrapper.find('a[children="Dashboard"]')).toHaveLength(1);

    // When learner portal links are present, Order History should not be a dropdown item
    // We do this in the same test to avoid weird things about jest wanting you to use
    // the "correct" act() function (even though it gives the same warning regardless
    // of where you import it from, be it react-dom/test-utils or react-test-renderer).
    mockUseEnterpriseConfig();
    wrapper = mount(component);
    await act(async () => {
      await flushPromises();
      wrapper.update();
      wrapper.find('DropdownToggle').simulate('click');
    });
    expect(wrapper.find('a[children="Order History"]')).toHaveLength(0);
    expect(wrapper.find('a[children="Dashboard"]')).toHaveLength(1);
  });

  it('renders correctly for unauthenticated users on mobile', () => {
    const component = (
      <ResponsiveContext.Provider value={{ width: 500 }}>
        <IntlProvider locale="en" messages={{}}>
          <AppContext.Provider
            value={{
              authenticatedUser: null,
              config: APP_CONTEXT_CONFIG,
            }}
          >
            <Header />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

    const wrapper = TestRenderer.create(component);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('renders correctly for authenticated users on mobile', () => {
    const component = (
      <ResponsiveContext.Provider value={{ width: 500 }}>
        <IntlProvider locale="en" messages={{}}>
          <AppContext.Provider
            value={{
              authenticatedUser: {
                userId: 'abc123',
                username: 'edX',
                roles: [],
                administrator: false,
              },
              config: APP_CONTEXT_CONFIG,
            }}
          >
            <Header />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

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
      const component = (
        <ResponsiveContext.Provider value={{ width: 1280 }}>
          <IntlProvider locale="en" messages={{}}>
            <AppContext.Provider
              value={{
                authenticatedUser: null,
                config: APP_CONTEXT_CONFIG,
              }}
            >
              <Header />
            </AppContext.Provider>
          </IntlProvider>
        </ResponsiveContext.Provider>
      );

      const wrapper = TestRenderer.create(component);

      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('renders correctly for authenticated users when minimal', () => {
      const component = (
        <ResponsiveContext.Provider value={{ width: 1280 }}>
          <IntlProvider locale="en" messages={{}}>
            <AppContext.Provider
              value={{
                authenticatedUser: {
                  userId: 'abc123',
                  username: 'edX',
                  roles: [],
                  administrator: false,
                },
                config: APP_CONTEXT_CONFIG,
              }}
            >
              <Header />
            </AppContext.Provider>
          </IntlProvider>
        </ResponsiveContext.Provider>
      );

      const wrapper = TestRenderer.create(component);

      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
