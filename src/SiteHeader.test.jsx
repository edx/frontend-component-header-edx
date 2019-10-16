
import React from 'react';
import { IntlProvider } from '@edx/frontend-i18n';
import TestRenderer from 'react-test-renderer';
import { AppContext, App } from '@edx/frontend-base';
import { Context as ResponsiveContext } from 'react-responsive';

import SiteHeader from './index';

App.apiClient = {
  get: jest.fn(),
  getDecodedAccessToken: jest.fn(),
  refreshAccessToken: jest.fn(),
};

describe('<SiteHeader />', () => {
  it('renders correctly for desktop', () => {
    const component = (
      <ResponsiveContext.Provider value={{ width: 1280 }}>
        <IntlProvider locale="en" messages={{}}>
          <AppContext.Provider value={{
            authenticatedUser: {
              userId: null,
              username: null,
              roles: [],
              administrator: false,
            },
            config: {
              LMS_BASE_URL: process.env.LMS_BASE_URL,
              LOGIN_URL: process.env.LOGIN_URL,
              LOGOUT_URL: process.env.LOGOUT_URL,
              MARKETING_SITE_BASE_URL: process.env.MARKETING_SITE_BASE_URL,
              ORDER_HISTORY_URL: process.env.ORDER_HISTORY_URL,
            },
            }}
          >
            <SiteHeader />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

    const wrapper = TestRenderer.create(component);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('renders correctly for mobile', () => {
    const component = (
      <ResponsiveContext.Provider value={{ width: 500 }}>
        <IntlProvider locale="en" messages={{}}>
          <AppContext.Provider value={{
            authenticatedUser: {
              userId: null,
              username: null,
              roles: [],
              administrator: false,
            },
            config: {
              LMS_BASE_URL: process.env.LMS_BASE_URL,
              LOGIN_URL: process.env.LOGIN_URL,
              LOGOUT_URL: process.env.LOGOUT_URL,
              MARKETING_SITE_BASE_URL: process.env.MARKETING_SITE_BASE_URL,
              ORDER_HISTORY_URL: process.env.ORDER_HISTORY_URL,
            },
            }}
          >
            <SiteHeader />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

    const wrapper = TestRenderer.create(component);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  describe('minimal', () => {
    beforeEach(() => {
      App.config.MINIMAL_HEADER = true;
    });

    afterEach(() => {
      App.config.MINIMAL_HEADER = false;
    });

    it('renders correctly when minimal', () => {
      const component = (
        <ResponsiveContext.Provider value={{ width: 1280 }}>
          <IntlProvider locale="en" messages={{}}>
            <AppContext.Provider value={{
              authenticatedUser: {
                userId: null,
                username: null,
                roles: [],
                administrator: false,
              },
              config: {
                LMS_BASE_URL: process.env.LMS_BASE_URL,
                LOGIN_URL: process.env.LOGIN_URL,
                LOGOUT_URL: process.env.LOGOUT_URL,
                MARKETING_SITE_BASE_URL: process.env.MARKETING_SITE_BASE_URL,
                ORDER_HISTORY_URL: process.env.ORDER_HISTORY_URL,
              },
              }}
            >
              <SiteHeader />
            </AppContext.Provider>
          </IntlProvider>
        </ResponsiveContext.Provider>
      );

      const wrapper = TestRenderer.create(component);

      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
