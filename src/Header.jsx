import React, { useContext } from 'react';
import Responsive from 'react-responsive';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { AppContext } from '@edx/frontend-platform/react';
import { Badge } from '@openedx/paragon';
import {
  APP_CONFIG_INITIALIZED,
  ensureConfig,
  mergeConfig,
  getConfig,
  subscribe,
} from '@edx/frontend-platform';
import { useEnterpriseConfig } from '@edx/frontend-enterprise-utils';

import PropTypes from 'prop-types';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

import messages from './Header.messages';

ensureConfig([
  'LMS_BASE_URL',
  'LOGOUT_URL',
  'LOGIN_URL',
  'MARKETING_SITE_BASE_URL',
  'ORDER_HISTORY_URL',
  'LOGO_URL',
  'ACCOUNT_SETTINGS_URL',
  'NOTIFICATION_FEEDBACK_URL',
], 'Header component');

subscribe(APP_CONFIG_INITIALIZED, () => {
  mergeConfig({
    MINIMAL_HEADER: !!process.env.MINIMAL_HEADER,
    ENTERPRISE_LEARNER_PORTAL_HOSTNAME: process.env.ENTERPRISE_LEARNER_PORTAL_HOSTNAME,
    AUTHN_MINIMAL_HEADER: !!process.env.AUTHN_MINIMAL_HEADER,
    ACCOUNT_SETTINGS_URL: process.env.ACCOUNT_SETTINGS_URL,
    NOTIFICATION_FEEDBACK_URL: process.env.NOTIFICATION_FEEDBACK_URL,
  }, 'Header additional config');
});

/**
 * Header component for the application.
 * Displays a header with the provided main menu, secondary menu, and user menu when the user is authenticated.
 * If any of the props (mainMenuItems, secondaryMenuItems, userMenuItems) are not provided, default
 * items are displayed.
 * For more details on how to use this component, please refer to this document:
 * https://github.com/edx/frontend-component-header-edx/blob/master/docs/using_custom_header.rst
 *
 * @param {list} mainMenuItems - The list of main menu items to display.
 * See the documentation for the structure of main menu item.
 * @param {list} secondaryMenuItems - The list of secondary menu items to display.
 * See the documentation for the structure of secondary menu item.
 * @param {list} userMenuItems - The list of user menu items to display.
 * See the documentation for the structure of user menu item.
 */
const Header = ({
  intl, mainMenuItems, secondaryMenuItems, userMenuItems,
}) => {
  const { authenticatedUser, config } = useContext(AppContext);
  const {
    enterpriseLearnerPortalLink,
    enterpriseCustomerBrandingConfig,
  } = useEnterpriseConfig(authenticatedUser, config.ENTERPRISE_LEARNER_PORTAL_HOSTNAME, config.LMS_BASE_URL);

  const defaultMainMenu = [
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/dashboard`,
      content: intl.formatMessage(messages['header.links.courses']),
    },
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/dashboard/programs`,
      content: intl.formatMessage(messages['header.links.programs']),
    },
    {
      type: 'item',
      href: `${config.MARKETING_SITE_BASE_URL}/course`,
      content: intl.formatMessage(messages['header.links.content.search']),
      onClick: () => {
        sendTrackEvent(
          'edx.bi.dashboard.find_courses_button.clicked',
          { category: 'header', label: 'header' },
        );
      },
    },
  ];

  const dashboardMenuItem = {
    type: 'item',
    href: `${config.LMS_BASE_URL}/dashboard`,
    content: intl.formatMessage(messages['header.user.menu.dashboard']),
  };

  const logoutMenuItem = {
    type: 'item',
    href: config.LOGOUT_URL,
    content: intl.formatMessage(messages['header.user.menu.logout']),
  };

  // If there is an Enterprise LP link, use that instead of the B2C Dashboard
  let baseUserMenuDashboardLinks = [];
  if (enterpriseLearnerPortalLink) {
    baseUserMenuDashboardLinks = [enterpriseLearnerPortalLink];
  } else {
    baseUserMenuDashboardLinks = [dashboardMenuItem];
  }

  const careerItemContent = <>{intl.formatMessage(messages['header.user.menu.career'])}<Badge className="px-2 mx-2" variant="warning">{intl.formatMessage(messages['header.user.menu.newAlert'])}</Badge></>;
  const defaultUserMenu = authenticatedUser === null ? [] : [{
    heading: '',
    items: [
      ...baseUserMenuDashboardLinks,
      {
        type: 'item',
        href: 'https://careers.edx.org/',
        content: careerItemContent,
        onClick: () => {
          sendTrackEvent(
            'edx.bi.user.menu.career.clicked',
            { category: 'header', label: 'header' },
          );
        },
      },
      {
        type: 'item',
        href: `${config.ACCOUNT_PROFILE_URL}/u/${authenticatedUser.username}`,
        content: intl.formatMessage(messages['header.user.menu.profile']),
      },
      {
        type: 'item',
        href: config.ACCOUNT_SETTINGS_URL,
        content: intl.formatMessage(messages['header.user.menu.account.settings']),
      },
      // Users should only see Order History if they do not have an available
      // learner portal and have a ORDER_HISTORY_URL define in the environment,
      // because an available learner portal currently means
      // that they access content via B2B Subscriptions, in which context an "order"
      // is not relevant.
      ...(!enterpriseLearnerPortalLink && config.ORDER_HISTORY_URL ? [{
        type: 'item',
        href: config.ORDER_HISTORY_URL,
        content: intl.formatMessage(messages['header.user.menu.order.history']),
      }] : []),
      logoutMenuItem,
    ],
  }];

  const mainMenu = mainMenuItems || defaultMainMenu;
  const secondaryMenu = secondaryMenuItems || [];
  let userMenu = authenticatedUser === null ? [] : userMenuItems || defaultUserMenu;

  if (getConfig().MINIMAL_HEADER && authenticatedUser !== null) {
    userMenu = [{
      heading: '',
      items: [
        dashboardMenuItem,
        logoutMenuItem,
      ],
    }];
  }

  const loggedOutItems = [
    {
      type: 'item',
      href: config.LOGIN_URL,
      content: intl.formatMessage(messages['header.user.menu.login']),
    },
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/register`,
      content: intl.formatMessage(messages['header.user.menu.register']),
    },
  ];

  let props = {
    logo: config.LOGO_URL,
    logoAltText: 'edX',
    siteName: 'edX',
    logoDestination: getConfig().MINIMAL_HEADER ? null : `${config.LMS_BASE_URL}/dashboard`,
    loggedIn: authenticatedUser !== null,
    name: authenticatedUser !== null ? authenticatedUser.name : '',
    email: authenticatedUser !== null ? authenticatedUser.email : '',
    avatar: authenticatedUser !== null ? authenticatedUser.avatar : null,
    mainMenu: getConfig().MINIMAL_HEADER || getConfig().AUTHN_MINIMAL_HEADER ? [] : mainMenu,
    secondaryMenu: getConfig().MINIMAL_HEADER || getConfig().AUTHN_MINIMAL_HEADER ? [] : secondaryMenu,
    userMenu: getConfig().AUTHN_MINIMAL_HEADER ? [] : userMenu,
    loggedOutItems: getConfig().AUTHN_MINIMAL_HEADER ? [] : loggedOutItems,
  };

  if (enterpriseCustomerBrandingConfig) {
    props = {
      ...props,
      ...enterpriseCustomerBrandingConfig,
    };
  }

  return (
    <>
      <Responsive maxWidth={769}>
        <MobileHeader {...props} />
      </Responsive>
      <Responsive minWidth={769}>
        <DesktopHeader {...props} />
      </Responsive>
    </>
  );
};

Header.defaultProps = {
  mainMenuItems: null,
  secondaryMenuItems: null,
  userMenuItems: null,
};

Header.propTypes = {
  intl: intlShape.isRequired,
  mainMenuItems: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.array,
  ]),
  secondaryMenuItems: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.array,
  ]),
  userMenuItems: PropTypes.arrayOf(PropTypes.shape({
    heading: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf(['item', 'menu']),
      href: PropTypes.string,
      content: PropTypes.string,
      disabled: PropTypes.bool,
      isActive: PropTypes.bool,
    })),
  })),
};

export default injectIntl(Header);
