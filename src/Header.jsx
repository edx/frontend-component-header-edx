import React, { useContext } from 'react';
import Responsive from 'react-responsive';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { AppContext } from '@edx/frontend-platform/react';
import { Badge } from '@edx/paragon';
import {
  APP_CONFIG_INITIALIZED,
  ensureConfig,
  mergeConfig,
  getConfig,
  subscribe,
} from '@edx/frontend-platform';
import { useEnterpriseConfig } from '@edx/frontend-enterprise-utils';

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
], 'Header component');

subscribe(APP_CONFIG_INITIALIZED, () => {
  mergeConfig({
    MINIMAL_HEADER: !!process.env.MINIMAL_HEADER,
    ENTERPRISE_LEARNER_PORTAL_HOSTNAME: process.env.ENTERPRISE_LEARNER_PORTAL_HOSTNAME,
    AUTHN_MINIMAL_HEADER: !!process.env.AUTHN_MINIMAL_HEADER,
  }, 'Header additional config');
});

const Header = ({ intl }) => {
  const { authenticatedUser, config } = useContext(AppContext);
  const {
    enterpriseLearnerPortalLink,
    enterpriseCustomerBrandingConfig,
  } = useEnterpriseConfig(authenticatedUser, config.ENTERPRISE_LEARNER_PORTAL_HOSTNAME, config.LMS_BASE_URL);

  const mainMenu = [
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
    content: intl.formatMessage(messages['header.user.menu.order.subscriptions']),
  };

  // If there is an Enterprise LP link, use that instead of the B2C Dashboard
  let baseUserMenuDashboardLinks = [];
  if (enterpriseLearnerPortalLink) {
    baseUserMenuDashboardLinks = [enterpriseLearnerPortalLink];
  } else {
    baseUserMenuDashboardLinks = [dashboardMenuItem];
  }

  const careerItemContent = <>{intl.formatMessage(messages['header.user.menu.career'])}<Badge className="px-2 mx-2" variant="warning">{intl.formatMessage(messages['header.user.menu.newAlert'])}</Badge></>;
  let userMenu = authenticatedUser === null ? [] : [
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
    logoutMenuItem,
  ];

  // Users should only see Order History if they do not have an available
  // learner portal and have a ORDER_HISTORY_URL define in the environment,
  // because an available learner portal currently means
  // that they access content via Subscriptions, in which context an "order"
  // is not relevant.
  if (!enterpriseLearnerPortalLink && config.ORDER_HISTORY_URL) {
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
    logo: config.LOGO_URL,
    logoAltText: 'edX',
    siteName: 'edX',
    logoDestination: getConfig().MINIMAL_HEADER ? null : `${config.LMS_BASE_URL}/dashboard`,
    loggedIn: authenticatedUser !== null,
    username: authenticatedUser !== null ? authenticatedUser.username : null,
    avatar: authenticatedUser !== null ? authenticatedUser.avatar : null,
    mainMenu: getConfig().MINIMAL_HEADER || getConfig().AUTHN_MINIMAL_HEADER ? [] : mainMenu,
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
      <Responsive maxWidth={768}>
        <MobileHeader {...props} />
      </Responsive>
      <Responsive minWidth={769}>
        <DesktopHeader {...props} />
      </Responsive>
    </>
  );
};

Header.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(Header);
