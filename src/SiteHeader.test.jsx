
import React from 'react';
import { IntlProvider } from '@edx/frontend-i18n';
import TestRenderer from 'react-test-renderer';

import './__mocks__/reactResponsive.mock';

import SiteHeader from './index';

describe('<SiteHeader />', () => {
  const mainMenu = [
    {
      type: 'menu',
      href: '#',
      content: 'Courses',
      submenuContent: (
        <div>
          <a href="#link">link 1 </a>
          <a href="#link2">link 2 </a>
        </div>
      ),
    },
    {
      type: 'item',
      href: '#',
      content: 'Programs',
    },
    {
      type: 'item',
      href: '#',
      content: 'Schools & Partners',
    },
  ];

  const userMenu = [
    {
      type: 'item',
      href: '#',
      content: 'Dashboard',
    },
    {
      type: 'item',
      href: '#',
      content: 'Profile',
    },
    {
      type: 'item',
      href: '#',
      content: 'Account Settings',
    },
    {
      type: 'item',
      href: '#',
      content: 'Help',
    },
    {
      type: 'item',
      href: '#',
      content: 'Logout',
    },
  ];

  const loggedOutItems = [
    { type: 'item', href: '#', content: 'Login' },
    { type: 'item', href: '#', content: 'Sign Up' },
  ];

  it('renders correctly for desktop', () => {
    global.innerWidth = 1280;

    const component = (
      <IntlProvider locale="en" messages={{}}>
        <SiteHeader
          logo=""
          logoDestination="https://edx.org"
          logoAltText="edX"
          intl={{}}
          mainMenu={mainMenu}
          username="username"
          avatar={null}
          userMenu={userMenu}
          loggedOutItems={loggedOutItems}
        />
      </IntlProvider>
    );

    const wrapper = TestRenderer.create(component);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('renders correctly for mobile', () => {
    global.innerWidth = 500;

    const component = (
      <IntlProvider locale="en" messages={{}}>
        <SiteHeader
          logo=""
          logoDestination="https://edx.org"
          logoAltText="edX"
          intl={{}}
          mainMenu={mainMenu}
          username="username"
          avatar={null}
          userMenu={userMenu}
          loggedOutItems={loggedOutItems}
        />
      </IntlProvider>
    );

    const wrapper = TestRenderer.create(component);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});
