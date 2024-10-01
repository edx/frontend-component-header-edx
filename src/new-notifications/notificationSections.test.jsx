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

import AuthenticatedUserDropdown from '../learning-header/New-AuthenticatedUserDropdown';
import { getNotificationsListApiUrl, getNotificationsCountApiUrl } from './data/api';
import mockNotificationsResponse from './test-utils';
import './data/__factories__';
import { getDiscussionTourUrl } from './tours/data/api';

const notificationCountsApiUrl = getNotificationsCountApiUrl();
const notificationsApiUrl = getNotificationsListApiUrl();
const notificationsTourApiUrl = getDiscussionTourUrl();

let axiosMock;

async function renderComponent() {
  render(
    <ResponsiveContext.Provider>
      <IntlProvider locale="en" messages={{}}>
        <AuthenticatedUserDropdown />
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
  });

  it('Successfully viewed last 24 hours and earlier section along with mark all as read label.', async () => {
    await mockNotificationsResponse();
    await renderComponent();

    await waitFor(async () => {
      const bellIcon = screen.queryByTestId('notification-bell-icon');
      await act(async () => { fireEvent.click(bellIcon); });
      const notificationTraySection = screen.queryByTestId('notification-tray-section');

      expect(within(notificationTraySection).queryByText('Last 24 hours')).toBeInTheDocument();
      expect(within(notificationTraySection).queryByText('Earlier')).toBeInTheDocument();
      expect(within(notificationTraySection).queryByText('Mark all as read')).toBeInTheDocument();
    });
  });

  it('Successfully marked all notifications as read, removing the unread status.', async () => {
    await mockNotificationsResponse();
    await renderComponent();

    await waitFor(async () => {
      const bellIcon = screen.queryByTestId('notification-bell-icon');
      await act(async () => { fireEvent.click(bellIcon); });
      const markAllReadButton = screen.queryByTestId('mark-all-read');

      expect(screen.queryByTestId('unread-notification-1')).toBeInTheDocument();
      await act(async () => { fireEvent.click(markAllReadButton); });
    });

    await waitFor(async () => {
      expect(screen.queryByTestId('unread-notification-1')).not.toBeInTheDocument();
    });
  });

  it('Successfully load more notifications by clicking on load more notification button.', async () => {
    await mockNotificationsResponse(10, 2);
    await renderComponent();

    await waitFor(async () => {
      const bellIcon = screen.queryByTestId('notification-bell-icon');
      await act(async () => { fireEvent.click(bellIcon); });

      const loadMoreButton = screen.queryByTestId('load-more-notifications');
      await act(async () => { fireEvent.click(loadMoreButton); });
    });

    await waitFor(() => {
      expect(screen.queryAllByTestId('notification-contents')).toHaveLength(12);
    });
  });

  it('Successfully showed No notification yet message when the notification tray is empty.', async () => {
    const notificationCountsMock = {
      show_notifications_tray: true,
      count: 0,
      count_by_app_name: {
        discussion: 0,
      },
      isNewNotificationViewEnabled: true,
    };

    axiosMock.onGet(notificationCountsApiUrl).reply(200, notificationCountsMock);
    axiosMock.onGet(notificationsApiUrl).reply(200, { results: [] });
    axiosMock.onGet(notificationsTourApiUrl).reply(200, []);

    await renderComponent();

    await waitFor(async () => {
      const bellIcon = screen.queryByTestId('notification-bell-icon');
      await act(async () => { fireEvent.click(bellIcon); });
    });

    await waitFor(() => {
      expect(screen.queryByTestId('notifications-empty-list')).toBeInTheDocument();
    });
  });
});
