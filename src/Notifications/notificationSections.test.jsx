import React from 'react';

import {
  act, fireEvent, render, screen, waitFor, within,
} from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { Context as ResponsiveContext } from 'react-responsive';
import { Factory } from 'rosie';

import { initializeMockApp } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppContext, AppProvider } from '@edx/frontend-platform/react';

import AuthenticatedUserDropdown from '../learning-header/AuthenticatedUserDropdown';
import { initializeStore } from '../store';
import {
  markNotificationAsReadApiUrl, markNotificationsSeenApiUrl, getNotificationsListApiUrl, getNotificationsCountApiUrl,
} from './data/api';
import mockNotificationsResponse from './test-utils';
import { markNotificationsAsSeen, fetchNotificationList, fetchAppsNotificationCount } from './data/thunks';
import executeThunk from '../test-utils';
import './data/__factories__';
import { RequestStatus, notificationListStatusRequest } from './data';

const markedAllNotificationsAsReadApiUrl = markNotificationAsReadApiUrl();
const notificationCountsApiUrl = getNotificationsCountApiUrl();
const notificationsApiUrl = getNotificationsListApiUrl();

let axiosMock;
let store;

function renderComponent() {
  render(
    <ResponsiveContext.Provider>
      <IntlProvider locale="en" messages={{}}>
        <AppProvider store={store}>
          <AppContext.Provider>
            <AuthenticatedUserDropdown />
          </AppContext.Provider>
        </AppProvider>
      </IntlProvider>
    </ResponsiveContext.Provider>,
  );
}

describe('Notification sections test cases.', () => {
  beforeEach(async () => {
    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });

    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    Factory.resetAll();
    store = initializeStore();

    ({ store, axiosMock } = await mockNotificationsResponse());
  });

  test.each([
    { status: RequestStatus.IN_PROGRESS, text: 'visible' },
    { status: RequestStatus.SUCCESSFUL, text: 'not visible' },
  ])('Spinner is $text if status is $status', async ({ status }) => {
    await renderComponent();
    const bellIcon = screen.queryByTestId('notification-bell-icon');
    await act(async () => { fireEvent.click(bellIcon); });
    if (status === RequestStatus.IN_PROGRESS) {
      await executeThunk(
        async (dispatch) => { dispatch(notificationListStatusRequest()); },
        store.dispatch,
        store.getState,
      );
      expect(screen.queryByTestId('notifications-loading-spinner')).toBeVisible();
      expect(screen.queryByTestId('notifications-list-complete')).not.toBeInTheDocument();
    } else if (status === RequestStatus.SUCCESSFUL) {
      expect(screen.queryByTestId('notifications-loading-spinner')).not.toBeInTheDocument();
    }
  });

  it('Successfully viewed last 24 hours and earlier section along with mark all as read label.', async () => {
    renderComponent();

    const bellIcon = screen.queryByTestId('notification-bell-icon');
    await act(async () => { fireEvent.click(bellIcon); });
    const notificationTraySection = screen.queryByTestId('notification-tray-section');

    expect(within(notificationTraySection).queryByText('Last 24 hours')).toBeInTheDocument();
    expect(within(notificationTraySection).queryByText('Earlier')).toBeInTheDocument();
    expect(within(notificationTraySection).queryByText('Mark all as read')).toBeInTheDocument();
  });

  it('Successfully marked all notifications as read, removing the unread status.', async () => {
    axiosMock.onPatch(markedAllNotificationsAsReadApiUrl).reply(200, { message: 'Notifications marked read.' });
    renderComponent();

    const bellIcon = screen.queryByTestId('notification-bell-icon');
    await act(async () => { fireEvent.click(bellIcon); });
    const markAllReadButton = screen.queryByTestId('mark-all-read');

    expect(screen.queryByTestId('unread-notification-1')).toBeInTheDocument();
    await act(async () => { fireEvent.click(markAllReadButton); });

    expect(screen.queryByTestId('unread-notification-1')).not.toBeInTheDocument();
  });

  it('Successfully load more notifications by clicking on load more notification button.', async () => {
    axiosMock.onPut(markNotificationsSeenApiUrl('discussion')).reply(200);
    await executeThunk(markNotificationsAsSeen('discussions'), store.dispatch, store.getState);
    renderComponent();

    const bellIcon = screen.queryByTestId('notification-bell-icon');
    await act(async () => { fireEvent.click(bellIcon); });

    expect(screen.queryAllByTestId('notification-contents')).toHaveLength(10);
    expect(screen.queryByTestId('notifications-list-complete')).not.toBeInTheDocument();
    const loadMoreButton = screen.queryByTestId('load-more-notifications');

    axiosMock.onGet(getNotificationsListApiUrl()).reply(
      200,
      (Factory.build('notificationsList', { num_pages: 2, current_page: 2 })),
    );
    await executeThunk(fetchNotificationList({ appName: 'discussion', page: 2 }), store.dispatch, store.getState);

    await act(async () => { fireEvent.click(loadMoreButton); });
    expect(screen.queryAllByTestId('notification-contents')).toHaveLength(12);
    expect(screen.queryByTestId('notifications-list-complete')).toBeInTheDocument();
  });

  it('Successfully showed No notification yet message when the notification tray is empty.', async () => {
    const notificationCountsMock = {
      show_notifications_tray: true,
      count: 0,
      count_by_app_name: {
        discussion: 0,
      },
    };

    axiosMock.onGet(notificationCountsApiUrl).reply(200, notificationCountsMock);
    axiosMock.onGet(notificationsApiUrl).reply(200, { results: [] });

    await executeThunk(fetchAppsNotificationCount(), store.dispatch, store.getState);
    await executeThunk(fetchNotificationList({ appName: 'discussion', page: 1 }), store.dispatch, store.getState);

    renderComponent();

    const bellIcon = screen.queryByTestId('notification-bell-icon');
    await act(async () => { fireEvent.click(bellIcon); });

    await waitFor(() => {
      const noNotiifcationMsg = screen.queryByText('No notifications yet');

      expect(noNotiifcationMsg).toBeInTheDocument();
    });
  });
});
