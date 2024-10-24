import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Dropdown, Badge } from '@openedx/paragon';

import messages from './messages';
import Notifications from '../Notifications';
import UserMenuItem from '../common/UserMenuItem';
import { selectShowNotificationTray, selectIsNewNotificationViewEnabled } from '../Notifications/data/selectors';
import { fetchAppsNotificationCount } from '../Notifications/data/thunks';

const AuthenticatedUserDropdown = (props) => {
  const {
    intl,
    enterpriseLearnerPortalLink,
    username,
    name,
    email,
  } = props;
  const dispatch = useDispatch();
  const showNotificationsTray = useSelector(selectShowNotificationTray);
  const isNewNotificationViewEnabled = useSelector(selectIsNewNotificationViewEnabled);

  useEffect(() => {
    dispatch(fetchAppsNotificationCount());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.href]);

  let dashboardMenuItem = (
    <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/dashboard`}>
      {intl.formatMessage(messages.dashboard)}
    </Dropdown.Item>
  );

  let careersMenuItem = (
    <Dropdown.Item href="https://careers.edx.org/">
      {intl.formatMessage(messages.career)}
      <Badge className="px-2 mx-2" variant="warning">
        {intl.formatMessage(messages.newAlert)}
      </Badge>
    </Dropdown.Item>
  );

  const userMenuItem = (name || email) ? (
    <Dropdown.Item
      key="user-info"
      data-testid="user-item"
      className="user-info__menu-item"
    >
      <UserMenuItem
        name={name}
        email={email}
      />
    </Dropdown.Item>
  ) : null;

  if (enterpriseLearnerPortalLink && Object.keys(enterpriseLearnerPortalLink).length > 0) {
    dashboardMenuItem = (
      <Dropdown.Item
        href={enterpriseLearnerPortalLink.href}
      >
        {enterpriseLearnerPortalLink.content}
      </Dropdown.Item>
    );
    careersMenuItem = '';
  }

  if (isNewNotificationViewEnabled) {
    return null;
  }

  return (
    <>
      {showNotificationsTray && <Notifications />}
      <Dropdown className="user-dropdown ml-3">
        <Dropdown.Toggle variant="outline-primary" id="user-dropdown">
          <FontAwesomeIcon icon={faUserCircle} size="lg" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-right zIndex-2">
          {userMenuItem}
          {dashboardMenuItem}
          {careersMenuItem}
          <Dropdown.Item href={`${getConfig().ACCOUNT_PROFILE_URL}/u/${username}`}>
            {intl.formatMessage(messages.profile)}
          </Dropdown.Item>
          <Dropdown.Item href={getConfig().ACCOUNT_SETTINGS_URL}>
            {intl.formatMessage(messages.account)}
          </Dropdown.Item>
          {!enterpriseLearnerPortalLink && getConfig().ORDER_HISTORY_URL && (
            // Users should only see Order History if they do not have an available
            // learner portal, because an available learner portal currently means
            // that they access content via B2B Subscriptions, in which context an "order"
            // is not relevant.
            <Dropdown.Item href={getConfig().ORDER_HISTORY_URL}>
              {intl.formatMessage(messages.orderHistory)}
            </Dropdown.Item>
          )}
          <Dropdown.Item href={getConfig().LOGOUT_URL}>
            {intl.formatMessage(messages.signOut)}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

AuthenticatedUserDropdown.propTypes = {
  enterpriseLearnerPortalLink: PropTypes.string,
  intl: intlShape.isRequired,
  username: PropTypes.string.isRequired,
  name: PropTypes.string,
  email: PropTypes.string,
};

AuthenticatedUserDropdown.defaultProps = {
  enterpriseLearnerPortalLink: '',
  name: '',
  email: '',
};

export default injectIntl(AuthenticatedUserDropdown);
