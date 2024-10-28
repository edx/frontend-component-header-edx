import React from 'react';

import {
  act, fireEvent, render, screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Factory } from 'rosie';

import { initializeMockApp } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';

import LearningHeader from '../learning-header/LearningHeader';
import mockNotificationsResponse from './data/api';

import './data/__factories__';

const authenticatedUser = {
  userId: 'abc123',
  username: 'edX',
  name: 'edX',
  email: 'test@example.com',
  roles: [],
  administrator: false,
};
const contextValue = {
  authenticatedUser,
  config: {},
};

async function renderComponent() {
  render(
    <MemoryRouter>
      <AppContext.Provider value={contextValue}>
        <IntlProvider locale="en" messages={{}}>
          <LearningHeader />
        </IntlProvider>
      </AppContext.Provider>
    </MemoryRouter>,
  );
}

describe('Notification row item test cases.', () => {
  beforeEach(async () => {
    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });

    Factory.resetAll();

    await mockNotificationsResponse();
  });

  it(
    'Successfully viewed notification icon, notification context, unread , course name and notification time.',
    async () => {
      await renderComponent();

      await waitFor(async () => {
        const bellIcon = screen.queryByTestId('notification-bell-icon');
        await act(async () => { fireEvent.click(bellIcon); });

        expect(screen.queryByTestId('notification-icon-1')).toBeInTheDocument();
        expect(screen.queryByTestId('notification-content-1')).toBeInTheDocument();
        expect(screen.queryByTestId('notification-course-1')).toBeInTheDocument();
        expect(screen.queryByTestId('notification-created-date-1')).toBeInTheDocument();
        expect(screen.queryByTestId('unread-notification-1')).toBeInTheDocument();
      });
    },
  );

  it('Successfully marked notification as read.', async () => {
    await renderComponent();

    await waitFor(async () => {
      const bellIcon = screen.queryByTestId('notification-bell-icon');
      await act(async () => { fireEvent.click(bellIcon); });

      const notification = screen.queryByTestId('notification-1');
      await act(async () => { fireEvent.click(notification); });

      expect(screen.queryByTestId('unread-notification-1')).not.toBeInTheDocument();
    });
  });
});
