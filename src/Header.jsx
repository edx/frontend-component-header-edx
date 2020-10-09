import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import Responsive from 'react-responsive';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';

import { AppContext } from '@edx/frontend-platform/react';
import {
  APP_CONFIG_INITIALIZED,
  ensureConfig,
  mergeConfig,
  getConfig,
  subscribe,
} from '@edx/frontend-platform';

import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

import LogoSVG from './logo.svg';

import messages from './Header.messages';

import useEnterpriseConfig from './data/hooks/enterprise';
import { menuItemShape } from './data/shapes/header';

ensureConfig([
  'LMS_BASE_URL',
  'LOGOUT_URL',
  'LOGIN_URL',
  'MARKETING_SITE_BASE_URL',
  'ORDER_HISTORY_URL',
], 'Header component');

subscribe(APP_CONFIG_INITIALIZED, () => {
  mergeConfig({
    MINIMAL_HEADER: !!process.env.MINIMAL_HEADER,
    ENTERPRISE_LEARNER_PORTAL_HOSTNAME: process.env.ENTERPRISE_LEARNER_PORTAL_HOSTNAME,
  }, 'Header additional config');
});

function Header({
  children, intl, variant, mainMenu,
}) {
  const { authenticatedUser, config } = useContext(AppContext);
  const {
    enterpriseLearnerPortalLink,
    enterpriseCustomerBrandingConfig,
  } = useEnterpriseConfig(authenticatedUser, config);

  const menu = mainMenu || [
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

  const orderHistoryItem = {
    type: 'item',
    href: config.ORDER_HISTORY_URL,
    content: intl.formatMessage(messages['header.user.menu.order.history']),
  };

  // If there is an Enterprise LP link, use that instead of the B2C Dashboard
  let baseUserMenuDashboardLinks = [];
  if (enterpriseLearnerPortalLink) {
    baseUserMenuDashboardLinks = [enterpriseLearnerPortalLink];
  } else {
    baseUserMenuDashboardLinks = [dashboardMenuItem];
  }

  let userMenu = authenticatedUser === null ? [] : [
    ...baseUserMenuDashboardLinks,
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/u/${authenticatedUser.username}`,
      content: intl.formatMessage(messages['header.user.menu.profile']),
    },
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/account/settings`,
      content: intl.formatMessage(messages['header.user.menu.account.settings']),
    },
    logoutMenuItem,
  ];

  // Users should only see Order History if they do not have an available
  // learner portal, because an available learner portal currently means
  // that they access content via Subscriptions, in which context an "order"
  // is not relevant.
  if (!enterpriseLearnerPortalLink) {
    userMenu.splice(-1, 0, orderHistoryItem);
  }

  if (getConfig().MINIMAL_HEADER && authenticatedUser !== null) {
    userMenu = [
      dashboardMenuItem,
      logoutMenuItem,
    ];
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
    logo: LogoSVG,
    logoAltText: 'edX',
    siteName: 'edX',
    logoDestination: getConfig().MINIMAL_HEADER ? null : '/',
    loggedIn: authenticatedUser !== null,
    username: authenticatedUser !== null ? authenticatedUser.username : null,
    avatar: authenticatedUser !== null ? authenticatedUser.avatar : null,
    mainMenu: getConfig().MINIMAL_HEADER ? [] : menu,
    userMenu,
    loggedOutItems,
    variant,
  };

  if (enterpriseCustomerBrandingConfig) {
    props = {
      ...props,
      ...enterpriseCustomerBrandingConfig,
    };
  }

  return (
    <React.Fragment>
      <Responsive maxWidth={768}>
        <MobileHeader {...props} />
      </Responsive>
      <Responsive minWidth={769}>
        <DesktopHeader {...props}>
          {children}
        </DesktopHeader>
      </Responsive>
    </React.Fragment>
  );
}

Header.propTypes = {
  intl: intlShape.isRequired,
  mainMenu: PropTypes.arrayOf(menuItemShape),
  variant: PropTypes.string,
  children: PropTypes.node,
};

Header.defaultProps = {
  mainMenu: null,
  variant: null,
  children: null,
};

export default injectIntl(Header);
