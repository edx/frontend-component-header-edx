import React from 'react';

import {
  act, fireEvent, render, screen, waitFor, within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Factory } from 'rosie';

import { initializeMockApp } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';

import LearningHeader from '../learning-header/LearningHeader';
import mockNotificationsResponse from './test-utils';

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

describe('Notification Tabs test cases.', () => {
  beforeEach(async () => {
    initializeMockApp({
      authenticatedUser: {
        userId: '123abc',
        username: 'testuser',
        administrator: false,
        roles: [],
      },
    });

    Factory.resetAll();

    await mockNotificationsResponse();
  });

  it('Successfully displayed with default discussion tab selected under notification tabs .', async () => {
    await renderComponent();

    await waitFor(async () => {
      const bellIcon = screen.queryByTestId('notification-bell-icon');
      await act(async () => { fireEvent.click(bellIcon); });

      const tabs = screen.queryAllByRole('tab');
      const selectedTab = tabs.find(tab => tab.getAttribute('aria-selected') === 'true');

      expect(tabs.length).toEqual(5);
      expect(within(selectedTab).queryByText('discussion')).toBeInTheDocument();
    });
  });

  it('Successfully showed unseen counts for unselected tabs.', async () => {
    await renderComponent();
    await waitFor(async () => {
      const bellIcon = screen.queryByTestId('notification-bell-icon');
      await act(async () => { fireEvent.click(bellIcon); });

      const tabs = screen.getAllByRole('tab');

      expect(within(tabs[0]).queryByRole('status')).toBeInTheDocument();
    });
  });

  it('Successfully selected reminder tab.', async () => {
    await renderComponent();

    await waitFor(async () => {
      const bellIcon = screen.queryByTestId('notification-bell-icon');
      await act(async () => { fireEvent.click(bellIcon); });
      const notificationTab = screen.getAllByRole('tab');
      let selectedTab = screen.queryByTestId('notification-tab-reminders');

      expect(selectedTab).not.toHaveClass('active');

      fireEvent.click(notificationTab[0], { dataset: { rbEventKey: 'reminders' } });
      selectedTab = screen.queryByTestId('notification-tab-reminders');

      expect(selectedTab).toHaveClass('active');
    });
  });
});
