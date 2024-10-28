import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';

import { AppContext } from '@edx/frontend-platform/react';
import AuthenticatedUserDropdown from './AuthenticatedUserDropdown';
import messages from './messages';
import { useAppNotifications } from '../Notification/data/hook';
import Notifications from '../Notification';

const BaseAuthenticatedUser = ({ children }) => {
  const intl = useIntl();
  return (
    <>
      <a className="text-gray-700" href={getConfig().SUPPORT_URL}>
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
}) => {
  const { authenticatedUser } = useContext(AppContext);
  const { showTray, notificationAppData } = useAppNotifications();

  return (
    <BaseAuthenticatedUser>
      {showTray && <Notifications notificationAppData={notificationAppData} />}
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

AuthenticatedUser.propTypes = {
  enterpriseLearnerPortalLink: PropTypes.string.isRequired,
  showUserDropdown: PropTypes.bool.isRequired,
};

export default AuthenticatedUser;
