import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContext, AppProvider } from '@edx/frontend-platform/react';
import { initialize, getConfig, subscribe, APP_READY } from '@edx/frontend-platform';
import Header, { StudioHeader } from '@edx/frontend-component-header';
import { Stack } from '@edx/paragon';

import './index.scss';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider>
      <Stack gap={5}>
        {/* We can fake out authentication by including another provider here with the data we want, an unauthenticated user. */}
        <div>
          <h4>Logged out state</h4>
          <AppContext.Provider value={{
            authenticatedUser: null,
            config: getConfig(),
          }}>
            <Header />
          </AppContext.Provider>
        </div>

        {/* We can fake out authentication by including another provider here with the data we want, an authenticated user. */}
        <AppContext.Provider value={{
          authenticatedUser: {
            userId: '123abc',
            username: 'testuser',
            roles: [],
            administrator: false,
          },
          config: getConfig(),
        }}>
          {/* Default header */}
          <div>
            <h4>Logged in state</h4>
            <Header />
          </div>

          {/* Studio header */}
          <div>
            <h4>Logged in state for Studio header</h4>
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
          </div>
        </AppContext.Provider>

        {/* Default header, using actual `AppContext` values */}
        <div>
          <h4>Actual logged in state</h4>
          <Header />
          <p className="small mt-2 px-2">
            If you are authenticated with the LMS (<code>edx-platform</code>), you will see the logged in state. Additionally, if
            you are an enterprise learner, you should see a custom logo and Dashboard links
            that direct you to http://localhost:8734 (<code>frontend-app-learner-portal-enterprise</code>). Otherwise,
            you will see the logged out state.
          </p>
        </div>
      </Stack>
    </AppProvider>,
    document.getElementById('root'),
  );
});

initialize({
  messages: []
});
