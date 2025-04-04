import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React, {StrictMode} from 'react';
import { AppContext, AppProvider } from '@edx/frontend-platform/react';
import { initialize, getConfig, subscribe, APP_READY } from '@edx/frontend-platform';
import Header, { StudioHeader } from '@edx/frontend-component-header';

import './index.scss';
import { createRoot } from "react-dom/client";

const rootNode = createRoot(document.getElementById('root'));
subscribe(APP_READY, () => {
  rootNode.render(
      <StrictMode>
          <AppProvider>
          {/* We can fake out authentication by including another provider here with the data we want */}
          <AppContext.Provider value={{
            authenticatedUser: null,
            config: getConfig(),
          }}>
            <Header />
          </AppContext.Provider>
          <h5 className="mt-2 mb-5">Logged out state</h5>

          {/* We can fake out authentication by including another provider here with the data we want */}
          <AppContext.Provider value={{
            authenticatedUser: {
              userId: '123abc',
              username: 'testuser',
              name: 'Test User',
              email: 'test@example.com',
              roles: [],
              administrator: false,
            },
            config: getConfig(),
          }}>
            <Header />
          </AppContext.Provider>
          <h5 className="mt-2  mb-5">Logged in state</h5>
          <AppContext.Provider value={{
            authenticatedUser: {
              userId: '123abc',
              username: 'testuser',
              name: 'Test User',
              email: 'test@example.com',
              roles: [],
              administrator: false,
            },
            config: getConfig(),
          }}>
            <StudioHeader
              number="run123"
              org="testX"
              title="Course Name"
              isHiddenMainMenu={false}
              mainMenuDropdowns={[
                {
                  id: 'content-dropdown',
                  buttonTitle: 'Content',
                  items: [{
                    href: '#',
                    title: 'Outline',
                  }],
                },
              ]}
              outlineLink="#"
            />
          </AppContext.Provider>
          <h5 className="mt-2">Logged in state for Studio header</h5>
        </AppProvider>
      </StrictMode>,
  );
});

initialize({
  messages: []
});
