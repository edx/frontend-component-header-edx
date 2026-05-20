/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import {
  render,
  fireEvent,
  waitFor,
} from '@testing-library/react';

import { AppContext } from '@edx/frontend-platform/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { Context as ResponsiveContext } from 'react-responsive';

import StudioHeader from './StudioHeader';
import messages from './messages';

const authenticatedUser = {
  userId: 3,
  username: 'abc123',
  name: 'test',
  email: 'test@example.com',
  administrator: true,
  roles: [],
  avatar: '/imges/test.png',
};
let currentUser;
let screenWidth = 1280;
let extraConfig = {};

const RootWrapper = ({
  ...props
}) => {
  const appContextValue = useMemo(() => ({
    authenticatedUser: currentUser,
    config: {
      LOGOUT_URL: process.env.LOGOUT_URL,
      LOGO_URL: process.env.LOGO_URL,
      SITE_NAME: process.env.SITE_NAME,
      STUDIO_BASE_URL: process.env.STUDIO_BASE_URL,
      LOGIN_URL: process.env.LOGIN_URL,
      ...extraConfig,
    },
  }), []);
  const responsiveContextValue = useMemo(() => ({ width: screenWidth }), []);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values, react/prop-types
    <IntlProvider locale="en">
      <AppContext.Provider value={appContextValue}>
        <ResponsiveContext.Provider value={responsiveContextValue}>
          <StudioHeader
            {...props}
          />
        </ResponsiveContext.Provider>
      </AppContext.Provider>
    </IntlProvider>
  );
};

const props = {
  number: '123',
  org: 'Ed',
  title: 'test',
  mainMenuDropdowns: [
    {
      id: 'testId',
      buttonTitle: 'test',
      items: [
        {
          title: 'link',
          href: '#',
        },
      ],
    },
  ],
  outlineLink: 'tEsTLInK',
};

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentUser = authenticatedUser;
    extraConfig = {};
  });
  describe('desktop', () => {
    it('course lock up should be visible', () => {
      const { getByTestId } = render(<RootWrapper {...props} />);
      const courseLockUpBlock = getByTestId('course-lock-up-block');

      expect(courseLockUpBlock).toBeVisible();
    });

    it('mobile menu should not be visible', () => {
      const { queryByTestId } = render(<RootWrapper {...props} />);
      const mobileMenuButton = queryByTestId('mobile-menu-button');

      expect(mobileMenuButton).toBeNull();
    });

    it('desktop menu should be visible', () => {
      const { getByTestId } = render(<RootWrapper {...props} />);
      const desktopMenu = getByTestId('desktop-menu');

      expect(desktopMenu).toBeVisible();
    });

    it('should render one dropdown', async () => {
      const { getAllByRole, getByText } = render(<RootWrapper {...props} />);
      const dropdownMenu = getAllByRole('button')[0];

      expect(dropdownMenu).toBeVisible();

      await waitFor(() => fireEvent.click(dropdownMenu));
      const dropdownOption = getByText('link');

      expect(dropdownOption).toBeVisible();
    });

    it('maintenance should not be in user menu', async () => {
      currentUser = { ...authenticatedUser, administrator: false };
      const { getAllByRole, queryByText } = render(<RootWrapper {...props} />);
      const userMenu = getAllByRole('button')[1];
      await waitFor(() => fireEvent.click(userMenu));
      const maintenanceButton = queryByText(messages['header.user.menu.maintenance'].defaultMessage);

      expect(maintenanceButton).toBeNull();
    });

    it('user menu should use avatar icon', async () => {
      currentUser = { ...authenticatedUser, avatar: null };
      const { getByTestId } = render(<RootWrapper {...props} />);
      const avatarIcon = getByTestId('avatar-icon');

      expect(avatarIcon).toBeVisible();
    });

    it('user menu should not contain username', async () => {
      const { container } = render(<RootWrapper {...props} />);
      const userMenu = container.querySelector('#user-dropdown-menu');
      expect(userMenu.textContent).toContain('');
    });

    it('should hide nav items if prop isHiddenMainMenu true', async () => {
      const initialProps = { ...props, isHiddenMainMenu: true };
      const { queryByTestId } = render(<RootWrapper {...initialProps} />);
      const desktopMenu = queryByTestId('desktop-menu');
      const mobileMenuButton = queryByTestId('mobile-menu-button');

      expect(mobileMenuButton).toBeNull();

      expect(desktopMenu).toBeNull();
    });

    it('displays user menu in dropdown', () => {
      const wrapper = render(<RootWrapper {...props} />);
      fireEvent.click(wrapper.container.querySelector('#user-dropdown-menu'));

      expect(wrapper.container.querySelector('.h5')).toBeInTheDocument();
      expect(wrapper.container.querySelector('.small')).toBeInTheDocument();
    });
  });

  describe('mobile', () => {
    beforeEach(() => { screenWidth = 500; });
    it('course lock up should not be visible', async () => {
      const { queryByTestId } = render(<RootWrapper {...props} />);
      const courseLockUpBlock = queryByTestId('course-lock-up-block');

      expect(courseLockUpBlock).toBeNull();
    });

    it('mobile menu should be visible', async () => {
      const { getByTestId } = render(<RootWrapper {...props} />);
      const mobileMenuButton = getByTestId('mobile-menu-button');

      expect(mobileMenuButton).toBeVisible();
      await waitFor(() => fireEvent.click(mobileMenuButton));
      const mobileMenu = getByTestId('mobile-menu');

      expect(mobileMenu).toBeVisible();
    });

    it('desktop menu should not be visible', () => {
      const { queryByTestId } = render(<RootWrapper {...props} />);
      const desktopMenu = queryByTestId('desktop-menu');

      expect(desktopMenu).toBeNull();
    });

    it('maintenance should be in user menu', async () => {
      const { getAllByRole, getByText } = render(<RootWrapper {...props} />);
      const userMenu = getAllByRole('button')[1];
      await waitFor(() => fireEvent.click(userMenu));
      const maintenanceButton = getByText(messages['header.user.menu.maintenance'].defaultMessage);

      expect(maintenanceButton).toBeVisible();
    });

    it('user menu should use avatar image', async () => {
      const { getByTestId } = render(<RootWrapper {...props} />);
      const avatarImage = getByTestId('avatar-image');

      expect(avatarImage).toBeVisible();
    });

    it('should hide nav items if prop isHiddenMainMenu true', async () => {
      const initialProps = { ...props, isHiddenMainMenu: true };
      const { queryByTestId } = render(<RootWrapper {...initialProps} />);
      const desktopMenu = queryByTestId('desktop-menu');
      const mobileMenuButton = queryByTestId('mobile-menu-button');

      expect(mobileMenuButton).toBeNull();

      expect(desktopMenu).toBeNull();
    });
  });

  describe('status alert', () => {
    const STATUS_ALERT_MESSAGE = 'System maintenance in progress';

    beforeEach(() => { screenWidth = 1280; });

    it('shows the banner when runtime settings are enabled', () => {
      extraConfig = {
        STATUS_ALERT_ENABLED: true,
        STATUS_ALERT_MESSAGE,
      };
      const { getByText } = render(<RootWrapper {...props} />);
      expect(getByText(STATUS_ALERT_MESSAGE)).toBeVisible();
    });

    it('hides the banner when runtime config disables it', () => {
      extraConfig = {
        STATUS_ALERT_ENABLED: false,
        STATUS_ALERT_MESSAGE,
      };
      const { queryByText } = render(<RootWrapper {...props} />);
      expect(queryByText(STATUS_ALERT_MESSAGE)).toBeNull();
    });

    it('hides the banner when the message is absent', () => {
      extraConfig = {
        STATUS_ALERT_ENABLED: true,
      };
      const { queryByText } = render(<RootWrapper {...props} />);
      expect(queryByText(STATUS_ALERT_MESSAGE)).toBeNull();
    });
  });
});
