import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import TestRenderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { getLearnerPortalLinks } from '@edx/frontend-enterprise';
import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import { Context as ResponsiveContext } from 'react-responsive';

import { StudioHeader } from './index';

jest.mock('@edx/frontend-platform');
jest.mock('@edx/frontend-enterprise');

getConfig.mockReturnValue({});

describe('<StudioHeader />', () => {
  beforeEach(() => {
    getLearnerPortalLinks.mockReturnValue(Promise.resolve([]));
  });

  it('renders correctly on desktop', () => {
    const component = (
      <ResponsiveContext.Provider value={{ width: 1280 }}>
        <IntlProvider locale="en" messages={{}}>
          <AppContext.Provider value={{
            authenticatedUser: {
              userId: 'abc123',
              username: 'edX',
              roles: [],
              administrator: false,
            },
            config: {
              LIB_AUTHORING_BASE_URL: process.env.LIB_AUTHORING_BASE_URL,
              STUDIO_BASE_URL: process.env.STUDIO_BASE_URL,
              LOGIN_URL: process.env.LOGIN_URL,
              LOGOUT_URL: process.env.LOGOUT_URL,
            },
            }}
          >
            <StudioHeader />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

    const wrapper = TestRenderer.create(component);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('renders correctly on mobile', () => {
    const component = (
      <ResponsiveContext.Provider value={{ width: 500 }}>
        <IntlProvider locale="en" messages={{}}>
          <AppContext.Provider value={{
            authenticatedUser: {
              userId: 'abc123',
              username: 'edX',
              roles: [],
              administrator: false,
            },
            config: {
              LIB_AUTHORING_BASE_URL: process.env.LIB_AUTHORING_BASE_URL,
              STUDIO_BASE_URL: process.env.STUDIO_BASE_URL,
              LOGIN_URL: process.env.LOGIN_URL,
              LOGOUT_URL: process.env.LOGOUT_URL,
            },
            }}
          >
            <StudioHeader />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

    const wrapper = TestRenderer.create(component);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('renders item details correctly on desktop', () => {
    const itemDetails = {
      id: 'some-id',
      url: 'https://edx.org',
      org: 'edX',
      title: 'Demonstration Library',
    };

    const component = (
      <ResponsiveContext.Provider value={{ width: 1280 }}>
        <IntlProvider locale="en" messages={{}}>
          <AppContext.Provider value={{
            authenticatedUser: {
              userId: 'abc123',
              username: 'edX',
              roles: [],
              administrator: false,
            },
            config: {
              LIB_AUTHORING_BASE_URL: process.env.LIB_AUTHORING_BASE_URL,
              STUDIO_BASE_URL: process.env.STUDIO_BASE_URL,
              LOGIN_URL: process.env.LOGIN_URL,
              LOGOUT_URL: process.env.LOGOUT_URL,
            },
            }}
          >
            <StudioHeader itemDetails={itemDetails} />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

    const wrapper = mount(component);
    const itemDetailsWrapper = wrapper.find('.item-details-container .item-details');

    expect(itemDetailsWrapper.find('a[href="https://edx.org"]')).toHaveLength(1);
    expect(itemDetailsWrapper.find('span[children="edX"]')).toHaveLength(1);
    expect(itemDetailsWrapper.find('span[children="some-id"]')).toHaveLength(1);
    expect(itemDetailsWrapper.find('span[children="Demonstration Library"]')).toHaveLength(1);
  });

  it('renders the expected default navigation items on desktop', () => {
    const component = (
      <ResponsiveContext.Provider value={{ width: 1280 }}>
        <IntlProvider locale="en" messages={{}}>
          <AppContext.Provider value={{
            authenticatedUser: {
              userId: 'abc123',
              username: 'edX',
              roles: [],
              administrator: false,
            },
            config: {
              LIB_AUTHORING_BASE_URL: process.env.LIB_AUTHORING_BASE_URL,
              STUDIO_BASE_URL: process.env.STUDIO_BASE_URL,
              LOGIN_URL: process.env.LOGIN_URL,
              LOGOUT_URL: process.env.LOGOUT_URL,
            },
            }}
          >
            <StudioHeader />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

    const wrapper = mount(component);

    expect(wrapper.find('.nav-link')).toHaveLength(2);
    expect(wrapper.find('a[children="Courses"]')).toHaveLength(1);
    expect(wrapper.find('a[children="Libraries"]')).toHaveLength(1);
  });

  it('renders the expected default navigation items on mobile', () => {
    const component = (
      <ResponsiveContext.Provider value={{ width: 500 }}>
        <IntlProvider locale="en" messages={{}}>
          <AppContext.Provider value={{
            authenticatedUser: {
              userId: 'abc123',
              username: 'edX',
              roles: [],
              administrator: false,
            },
            config: {
              LIB_AUTHORING_BASE_URL: process.env.LIB_AUTHORING_BASE_URL,
              STUDIO_BASE_URL: process.env.STUDIO_BASE_URL,
              LOGIN_URL: process.env.LOGIN_URL,
              LOGOUT_URL: process.env.LOGOUT_URL,
            },
            }}
          >
            <StudioHeader />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

    const wrapper = mount(component);

    wrapper.find('.menu-trigger[title="Main Menu"]').simulate('click');
    expect(wrapper.find('.nav-link')).toHaveLength(2);
    expect(wrapper.find('a[children="Courses"]')).toHaveLength(1);
    expect(wrapper.find('a[children="Libraries"]')).toHaveLength(1);
  });

  it('renders main menu override on desktop', () => {
    const mainMenu = [
      {
        type: 'item',
        href: 'https://edx.org',
        content: 'Test item 1',
      },
      {
        type: 'item',
        href: 'https://edx.org',
        content: 'Test item 2',
      },
    ];

    const component = (
      <ResponsiveContext.Provider value={{ width: 1280 }}>
        <IntlProvider locale="en" messages={{}}>
          <AppContext.Provider value={{
            authenticatedUser: null,
            config: {
              LIB_AUTHORING_BASE_URL: process.env.LIB_AUTHORING_BASE_URL,
              STUDIO_BASE_URL: process.env.STUDIO_BASE_URL,
              LOGIN_URL: process.env.LOGIN_URL,
              LOGOUT_URL: process.env.LOGOUT_URL,
            },
            }}
          >
            <StudioHeader mainMenu={mainMenu} />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

    const wrapper = mount(component);

    expect(wrapper.find('.nav-link')).toHaveLength(2);
    expect(wrapper.find('a[children="Test item 1"]')).toHaveLength(1);
    expect(wrapper.find('a[children="Test item 2"]')).toHaveLength(1);
  });

  it('renders main menu override on mobile', () => {
    const mainMenu = [
      {
        type: 'item',
        href: 'https://edx.org',
        content: 'Test item 1',
      },
      {
        type: 'item',
        href: 'https://edx.org',
        content: 'Test item 2',
      },
    ];

    const component = (
      <ResponsiveContext.Provider value={{ width: 500 }}>
        <IntlProvider locale="en" messages={{}}>
          <AppContext.Provider value={{
            authenticatedUser: null,
            config: {
              LIB_AUTHORING_BASE_URL: process.env.LIB_AUTHORING_BASE_URL,
              STUDIO_BASE_URL: process.env.STUDIO_BASE_URL,
              LOGIN_URL: process.env.LOGIN_URL,
              LOGOUT_URL: process.env.LOGOUT_URL,
            },
            }}
          >
            <StudioHeader mainMenu={mainMenu} />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

    const wrapper = mount(component);

    wrapper.find('.menu-trigger[title="Main Menu"]').simulate('click');
    expect(wrapper.find('.nav-link')).toHaveLength(2);
    expect(wrapper.find('a[children="Test item 1"]')).toHaveLength(1);
    expect(wrapper.find('a[children="Test item 2"]')).toHaveLength(1);
  });

  it('renders extra main menu items on desktop', () => {
    const extraMainMenuItems = [
      {
        type: 'item',
        href: 'https://edx.org',
        content: 'Test item 1',
      },
      {
        type: 'item',
        href: 'https://edx.org',
        content: 'Test item 2',
      },
    ];

    const component = (
      <ResponsiveContext.Provider value={{ width: 1280 }}>
        <IntlProvider locale="en" messages={{}}>
          <AppContext.Provider value={{
            authenticatedUser: null,
            config: {
              LIB_AUTHORING_BASE_URL: process.env.LIB_AUTHORING_BASE_URL,
              STUDIO_BASE_URL: process.env.STUDIO_BASE_URL,
              LOGIN_URL: process.env.LOGIN_URL,
              LOGOUT_URL: process.env.LOGOUT_URL,
            },
            }}
          >
            <StudioHeader extraMainMenuItems={extraMainMenuItems} />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

    const wrapper = mount(component);

    expect(wrapper.find('.nav-link')).toHaveLength(4);
    expect(wrapper.find('a[children="Courses"]')).toHaveLength(1);
    expect(wrapper.find('a[children="Libraries"]')).toHaveLength(1);
    expect(wrapper.find('a[children="Test item 1"]')).toHaveLength(1);
    expect(wrapper.find('a[children="Test item 2"]')).toHaveLength(1);
  });

  it('renders extra main menu items on mobile', () => {
    const extraMainMenuItems = [
      {
        type: 'item',
        href: 'https://edx.org',
        content: 'Test item 1',
      },
      {
        type: 'item',
        href: 'https://edx.org',
        content: 'Test item 2',
      },
    ];

    const component = (
      <ResponsiveContext.Provider value={{ width: 500 }}>
        <IntlProvider locale="en" messages={{}}>
          <AppContext.Provider value={{
            authenticatedUser: null,
            config: {
              LIB_AUTHORING_BASE_URL: process.env.LIB_AUTHORING_BASE_URL,
              STUDIO_BASE_URL: process.env.STUDIO_BASE_URL,
              LOGIN_URL: process.env.LOGIN_URL,
              LOGOUT_URL: process.env.LOGOUT_URL,
            },
            }}
          >
            <StudioHeader extraMainMenuItems={extraMainMenuItems} />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

    const wrapper = mount(component);

    wrapper.find('.menu-trigger[title="Main Menu"]').simulate('click');
    expect(wrapper.find('.nav-link')).toHaveLength(4);
    expect(wrapper.find('a[children="Courses"]')).toHaveLength(1);
    expect(wrapper.find('a[children="Libraries"]')).toHaveLength(1);
    expect(wrapper.find('a[children="Test item 1"]')).toHaveLength(1);
    expect(wrapper.find('a[children="Test item 2"]')).toHaveLength(1);
  });
});
