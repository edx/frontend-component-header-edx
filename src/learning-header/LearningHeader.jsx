import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useEnterpriseConfig } from '@edx/frontend-enterprise-utils';
import {
  APP_CONFIG_INITIALIZED, getConfig, ensureConfig, subscribe, mergeConfig,
} from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { AppContext, AppProvider } from '@edx/frontend-platform/react';
import classNames from 'classnames';
import AnonymousUserMenu from './AnonymousUserMenu';
import AuthenticatedUserDropdown from './AuthenticatedUserDropdown';
import messages from './messages';
import lightning from '../lightning';
import store from '../store';

ensureConfig([
  'ACCOUNT_SETTINGS_URL',
  'NOTIFICATION_FEEDBACK_URL',
], 'Learning Header component');

subscribe(APP_CONFIG_INITIALIZED, () => {
  lightning();
  mergeConfig({
    ACCOUNT_SETTINGS_URL: process.env.ACCOUNT_SETTINGS_URL || '',
    NOTIFICATION_FEEDBACK_URL: process.env.NOTIFICATION_FEEDBACK_URL || '',
    HIDE_USERNAME_FROM_HEADER: !!process.env.HIDE_USERNAME_FROM_HEADER,
  }, 'Learning Header additional config');
});

const LinkedLogo = ({
  href,
  src,
  alt,
  ...attributes
}) => (
  <a href={href} {...attributes}>
    <img className="d-block" src={src} alt={alt} />
  </a>
);

LinkedLogo.propTypes = {
  href: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

const LearningHeader = ({
  courseOrg, courseNumber, courseTitle, intl, showUserDropdown,
}) => {
  const { authenticatedUser } = useContext(AppContext);

  const { enterpriseLearnerPortalLink, enterpriseCustomerBrandingConfig } = useEnterpriseConfig(
    authenticatedUser,
    getConfig().ENTERPRISE_LEARNER_PORTAL_HOSTNAME,
    getConfig().LMS_BASE_URL,
  );

  let headerLogo = (
    <LinkedLogo
      className="logo"
      href={`${getConfig().LMS_BASE_URL}/dashboard`}
      src={getConfig().LOGO_URL}
      alt={getConfig().SITE_NAME}
    />
  );
  if (enterpriseCustomerBrandingConfig && Object.keys(enterpriseCustomerBrandingConfig).length > 0) {
    headerLogo = (
      <LinkedLogo
        className="logo"
        href={enterpriseCustomerBrandingConfig.logoDestination}
        src={enterpriseCustomerBrandingConfig.logo}
        alt={enterpriseCustomerBrandingConfig.logoAltText}
      />
    );
  }

  return (
    <AppProvider store={store} wrapWithRouter={false}>
      <header className="learning-header">
        <a className="sr-only sr-only-focusable" href="#main-content">{intl.formatMessage(messages.skipNavLink)}</a>
        <div className="px-4 py-2.5 d-flex align-items-center learning-header-container">
          {headerLogo}
          <div
            className={classNames('flex-grow-1', {
              'course-title-lockup': courseTitle || courseOrg || courseNumber,
            })}
            style={{ lineHeight: 1 }}
          >
            <span className="d-block small m-0">{courseOrg} {courseNumber}</span>
            <span className="d-block m-0 font-weight-bold course-title">{courseTitle}</span>
          </div>
          {showUserDropdown && authenticatedUser && (
          <AuthenticatedUserDropdown
            enterpriseLearnerPortalLink={enterpriseLearnerPortalLink}
            username={authenticatedUser.username}
            name={authenticatedUser.name}
          />
          )}
          {showUserDropdown && !authenticatedUser && (
          <AnonymousUserMenu />
          )}
        </div>
      </header>
    </AppProvider>
  );
};

LearningHeader.propTypes = {
  courseOrg: PropTypes.string,
  courseNumber: PropTypes.string,
  courseTitle: PropTypes.string,
  intl: intlShape.isRequired,
  showUserDropdown: PropTypes.bool,
};

LearningHeader.defaultProps = {
  courseOrg: null,
  courseNumber: null,
  courseTitle: null,
  showUserDropdown: true,
};

export default injectIntl(LearningHeader);
