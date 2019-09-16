import React, { useContext } from 'react';
import Responsive from 'react-responsive';
import { injectIntl, intlShape } from '@edx/frontend-i18n';
import { sendTrackEvent } from '@edx/frontend-analytics';
import { App, AuthenticationContext } from '@edx/frontend-base';

import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

import LogoSVG from './logo.svg';

import messages from './SiteHeader.messages';


const {
  LMS_BASE_URL,
  LOGOUT_URL,
  LOGIN_URL,
  MARKETING_SITE_BASE_URL,
  ORDER_HISTORY_URL,
} = App.requireConfig(
  [
    'LMS_BASE_URL',
    'LOGOUT_URL',
    'LOGIN_URL',
    'MARKETING_SITE_BASE_URL',
    'ORDER_HISTORY_URL',
  ],
  'Header component',
);

function SiteHeader({ intl }) {
  const { username, avatar } = useContext(AuthenticationContext);

  const mainMenu = [
    {
      type: 'item',
      href: `${LMS_BASE_URL}/dashboard`,
      content: intl.formatMessage(messages['header.links.courses']),
    },
    {
      type: 'item',
      href: `${LMS_BASE_URL}/dashboard/programs`,
      content: intl.formatMessage(messages['header.links.programs']),
    },
    {
      type: 'item',
      href: `${MARKETING_SITE_BASE_URL}/course`,
      content: intl.formatMessage(messages['header.links.content.search']),
      onClick: () => {
        sendTrackEvent(
          'edx.bi.dashboard.find_courses_button.clicked',
          { category: 'header', label: 'header' },
        );
      },
    },
  ];

  const userMenu = [
    {
      type: 'item',
      href: `${LMS_BASE_URL}/dashboard`,
      content: intl.formatMessage(messages['header.user.menu.dashboard']),
    },
    {
      type: 'item',
      href: `${LMS_BASE_URL}/u/${username}`,
      content: intl.formatMessage(messages['header.user.menu.profile']),
    },
    {
      type: 'item',
      href: `${LMS_BASE_URL}/account/settings`,
      content: intl.formatMessage(messages['header.user.menu.account.settings']),
    },
    {
      type: 'item',
      href: ORDER_HISTORY_URL,
      content: intl.formatMessage(messages['header.user.menu.order.history']),
    },
    {
      type: 'item',
      href: LOGOUT_URL,
      content: intl.formatMessage(messages['header.user.menu.logout']),
    },
  ];

  const loggedOutItems = [
    {
      type: 'item',
      href: LOGIN_URL,
      content: intl.formatMessage(messages['header.user.menu.login']),
    },
    {
      type: 'item',
      href: `${LMS_BASE_URL}/register`,
      content: intl.formatMessage(messages['header.user.menu.register']),
    },
  ];

  const props = {
    logo: LogoSVG,
    logoAltText: 'edX',
    siteName: 'edX',
    logoDestination: `${LMS_BASE_URL}/dashboard`,
    loggedIn: !!username,
    username,
    avatar,
    mainMenu,
    userMenu,
    loggedOutItems,
  };

  return (
    <React.Fragment>
      <Responsive maxWidth={768}>
        <MobileHeader {...props} />
      </Responsive>
      <Responsive minWidth={769}>
        <DesktopHeader {...props} />
      </Responsive>
    </React.Fragment>
  );
}

SiteHeader.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(SiteHeader);
