import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Responsive from 'react-responsive';
import { AppContext } from '@edx/frontend-platform/react';
import {
  APP_CONFIG_INITIALIZED,
  ensureConfig,
  mergeConfig,
  subscribe,
} from '@edx/frontend-platform';

import MobileHeader from './MobileHeader';
import HeaderBody from './HeaderBody';
import { StatusAlert } from '../status-alert';

ensureConfig([
  'STUDIO_BASE_URL',
  'SITE_NAME',
  'LOGOUT_URL',
  'LOGIN_URL',
  'LOGO_URL',
], 'Studio Header component');

subscribe(APP_CONFIG_INITIALIZED, () => {
  mergeConfig({
    // Temporary per-MFE rollout toggle. The ENV_ prefix distinguishes the
    // build-time env var from the runtime config setting STATUS_ALERT_ENABLED.
    ENV_STATUS_ALERT_ENABLED: !!process.env.ENV_STATUS_ALERT_ENABLED,
  }, 'Studio Header additional config');
});

const StudioHeader = ({
  number, org, title, isHiddenMainMenu, mainMenuDropdowns, outlineLink,
}) => {
  const { authenticatedUser, config } = useContext(AppContext);
  const props = {
    logo: config.LOGO_URL,
    logoAltText: `Studio ${config.SITE_NAME}`,
    number,
    org,
    title,
    name: authenticatedUser?.name,
    email: authenticatedUser?.email,
    isAdmin: authenticatedUser?.administrator,
    authenticatedUserAvatar: authenticatedUser?.avatar,
    studioBaseUrl: config.STUDIO_BASE_URL,
    logoutUrl: config.LOGOUT_URL,
    isHiddenMainMenu,
    mainMenuDropdowns,
    outlineLink,
  };

  const showStatusAlert = config.ENV_STATUS_ALERT_ENABLED
    && config.STATUS_ALERT_ENABLED
    && config.STATUS_ALERT_MESSAGE;
  const statusAlertMessage = config.STATUS_ALERT_MESSAGE;

  return (
    <div className="studio-header">
      {showStatusAlert && <StatusAlert message={statusAlertMessage} />}
      <a className="nav-skip sr-only sr-only-focusable" href="#main">Skip to content</a>
      <Responsive maxWidth={841}>
        <MobileHeader {...props} />
      </Responsive>
      <Responsive minWidth={842}>
        <HeaderBody {...props} />
      </Responsive>
    </div>
  );
};

StudioHeader.propTypes = {
  number: PropTypes.string,
  org: PropTypes.string,
  title: PropTypes.string.isRequired,
  isHiddenMainMenu: PropTypes.bool,
  mainMenuDropdowns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    buttonTitle: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      href: PropTypes.string,
      title: PropTypes.string,
    })),
  })),
  outlineLink: PropTypes.string,
};

StudioHeader.defaultProps = {
  number: '',
  org: '',
  isHiddenMainMenu: false,
  mainMenuDropdowns: [],
  outlineLink: null,
};

export default StudioHeader;
