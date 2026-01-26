import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';

import { AppContext } from '@edx/frontend-platform/react';
import AuthenticatedUserDropdown from './AuthenticatedUserDropdown';
import messages from './messages';
import NotificationsSlot from '../plugin-slots/NotificationsSlot';
import { SiteLanguageButton } from './site-language/components/SiteLanguageButton';

const BaseAuthenticatedUser = ({ children }) => {
  const intl = useIntl();
  return (
    <>
      <a className="text-gray-700 user-header-secondary-item" href={getConfig().SUPPORT_URL}>
        {intl.formatMessage(messages.help)}
      </a>
      {children}
    </>
  );
};

BaseAuthenticatedUser.propTypes = {
  children: PropTypes.node.isRequired,
};

const AuthenticatedUser = ({
  showUserDropdown,
  enterpriseLearnerPortalLink,
  showSiteLanguageButton,
  courseId,
}) => {
  const { authenticatedUser } = useContext(AppContext);

  return (
    <BaseAuthenticatedUser>
      <NotificationsSlot />
      {showSiteLanguageButton && (
        <SiteLanguageButton
          courseId={courseId}
          userId={authenticatedUser.userId}
        />
      )}
      {showUserDropdown && (
        <AuthenticatedUserDropdown
          enterpriseLearnerPortalLink={enterpriseLearnerPortalLink}
          username={authenticatedUser.username}
          name={authenticatedUser.name}
          email={authenticatedUser.email}
        />
      )}
    </BaseAuthenticatedUser>
  );
};

AuthenticatedUser.defaultProps = {
  courseId: null,
};

AuthenticatedUser.propTypes = {
  enterpriseLearnerPortalLink: PropTypes.string.isRequired,
  showUserDropdown: PropTypes.bool.isRequired,
  showSiteLanguageButton: PropTypes.bool.isRequired,
  courseId: PropTypes.string,
};

export default AuthenticatedUser;
