import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContext, AppProvider } from '@edx/frontend-platform/react';
import { initialize, getConfig, subscribe, APP_READY } from '@edx/frontend-platform';

import './index.scss';
import Header from '../src/';
import { StudioHeader, MenuContentItem } from '../src/';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider>
      {/* We can fake out authentication by including another provider here with the data we want */}
      <h5 className="mt-2 mb-2">Default Header - Logged out state</h5>
      <AppContext.Provider value={{
        authenticatedUser: null,
        config: getConfig(),
      }}>
        <Header />
      </AppContext.Provider>

      {/* We can fake out authentication by including another provider here with the data we want */}
      <h5 className="mt-5 mb-2">Default Header - Logged in state</h5>
      <AppContext.Provider value={{
        authenticatedUser: {
          userId: '123abc',
          username: 'testuser',
          roles: [],
          administrator: false,
        },
        config: getConfig(),
      }}>
        <Header />
      </AppContext.Provider>

      {/* We can fake out authentication by including another provider here with the data we want */}
      <h5 className="mt-5 mb-2">Studio header - Default state</h5>
      <AppContext.Provider value={{
        authenticatedUser: {
          userId: '123abc',
          username: 'testuser',
          roles: [],
          administrator: false,
        },
        config: getConfig(),
      }}>
        <StudioHeader />
      </AppContext.Provider>

      {/* We can fake out authentication by including another provider here with the data we want */}
      <h5 className="mt-5 mb-2">Studio header - Extra main menu items </h5>
      <AppContext.Provider value={{
        authenticatedUser: {
          userId: '123abc',
          username: 'testuser',
          roles: [],
          administrator: false,
        },
        config: getConfig(),
      }}>
        <StudioHeader extraMainMenuItems={[
          {
            type: 'item',
            href: 'https://edx.org',
            content: 'Additional',
          },
          {
            type: 'item',
            href: 'https://edx.org',
            content: 'Item',
          },
        ]}/>
      </AppContext.Provider>

      {/* We can fake out authentication by including another provider here with the data we want */}
      <h5 className="mt-5 mb-2">Studio header - Item selected</h5>
      <AppContext.Provider value={{
        authenticatedUser: {
          userId: '123abc',
          username: 'testuser',
          roles: [],
          administrator: false,
        },
        config: getConfig(),
      }}>
        <StudioHeader
          itemDetails={{
            id: 'test-lib-1',
            url: '/',
            org: 'edX',
            title: 'Library with a very long name which will overflow for sure'
          }}
          mainMenu={[
            {
              type: 'dropdown',
              href: '#',
              content: 'Settings',
              submenuContent: (
                <div>
                  <MenuContentItem tag={'a'} href={'/'}>
                    Details
                  </MenuContentItem>
                  <MenuContentItem tag={'a'} href={'/'}>
                    Access
                  </MenuContentItem>
                </div>
              ),
            },
          ]}
        />
      </AppContext.Provider>
    </AppProvider>,
    document.getElementById('root'),
  );
});

initialize({
  messages: []
});
