import React from 'react';

import {
  act, fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import { Context as ResponsiveContext } from 'react-responsive';
import { Factory } from 'rosie';

import { initializeMockApp } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppContext, AppProvider } from '@edx/frontend-platform/react';

import AuthenticatedUserDropdown from '../learning-header/AuthenticatedUserDropdown';
import { initializeStore } from '../store';
import executeThunk from '../test-utils';
import * as notificationApi from './data/api';
import { fetchAppsNotificationCount } from './data/thunks';

import './data/__factories__';

const notificationCountsApiUrl = notificationApi.getNotificationsCountApiUrl();

let axiosMock;
let store;

function renderComponent(location = '/') {
  render(
    <ResponsiveContext.Provider>
      <IntlProvider locale="en" messages={{}}>
        <AppProvider store={store} wrapWithRouter={false}>
          <AppContext.Provider>
            <MemoryRouter initialEntries={[location]}>
              <AuthenticatedUserDropdown />
            </MemoryRouter>
          </AppContext.Provider>
        </AppProvider>
      </IntlProvider>
    </ResponsiveContext.Provider>,
  );
}

describe('Notification test cases.', () => {
  beforeEach(async () => {
    initializeMockApp({
      authenticatedUser: {
        userId: '123abc',
        username: 'testuser',
        administrator: false,
        roles: [],
      },
    });

    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    Factory.resetAll();
    store = initializeStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  async function setupMockNotificationCountResponse(count = 45, showNotificationsTray = true) {
    axiosMock.onGet(notificationCountsApiUrl)
      .reply(200, (Factory.build('notificationsCount', { count, showNotificationsTray })));
    await executeThunk(fetchAppsNotificationCount(), store.dispatch, store.getState);
  }

  it('Successfully showed bell icon and unseen count on it if unseen count is greater then 0.', async () => {
    await setupMockNotificationCountResponse();
    renderComponent();

    const bellIcon = screen.queryByTestId('notification-bell-icon');
    const notificationCount = screen.queryByTestId('notification-count');

    expect(bellIcon).toBeInTheDocument();
    expect(notificationCount).toBeInTheDocument();
    expect(screen.queryByText(45)).toBeInTheDocument();
  });

  it('Successfully showed bell icon and hide unseen count tag when unseen count is zero.', async () => {
    await setupMockNotificationCountResponse(0);
    renderComponent();

    const bellIcon = screen.queryByTestId('notification-bell-icon');
    const notificationCount = screen.queryByTestId('notification-count');

    expect(bellIcon).toBeInTheDocument();
    expect(notificationCount).not.toBeInTheDocument();
  });

  it('Successfully hides bell icon when showNotificationsTray is false.', async () => {
    await setupMockNotificationCountResponse(45, false);
    renderComponent();

    const bellIcon = screen.queryByTestId('notification-bell-icon');

    expect(bellIcon).not.toBeInTheDocument();
  });

  it('Successfully viewed setting icon and show/hide notification tray by clicking on the bell icon .', async () => {
    await setupMockNotificationCountResponse();
    renderComponent();

    const bellIcon = screen.queryByTestId('notification-bell-icon');

    await act(async () => { fireEvent.click(bellIcon); });
    expect(screen.queryByTestId('notification-tray')).toBeInTheDocument();
    expect(screen.queryByTestId('setting-icon')).toBeInTheDocument();

    await act(async () => { fireEvent.click(bellIcon); });
    await waitFor(() => expect(screen.queryByTestId('notification-tray')).not.toBeInTheDocument());
  });

  it.each(['/', '/notification', '/my-post'])(
    'Successfully call getNotificationCounts on URL %s change',
    async (url) => {
      const getNotificationCountsSpy = jest.spyOn(notificationApi, 'getNotificationCounts').mockReturnValue(() => true);
      renderComponent(url);

      expect(getNotificationCountsSpy).toHaveBeenCalledTimes(1);
    },
  );
});
