import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Dropdown, Badge } from '@edx/paragon';

import messages from './messages';
import Notifications from '../Notifications';
import { selectShowNotificationTray } from '../Notifications/data/selectors';
import { fetchAppsNotificationCount } from '../Notifications/data/thunks';

const AuthenticatedUserDropdown = ({ enterpriseLearnerPortalLink, intl, username }) => {
  const dispatch = useDispatch();
  const showNotificationsTray = useSelector(selectShowNotificationTray);

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

  return (
    <>
      <a className="text-gray-700" href={`${getConfig().SUPPORT_URL}`}>{intl.formatMessage(messages.help)}</a>
      {showNotificationsTray && <Notifications />}
      <Dropdown className="user-dropdown ml-3">
        <Dropdown.Toggle variant="outline-primary" id="user-dropdown">
          <FontAwesomeIcon icon={faUserCircle} className="d-md-none" size="lg" />
          <span data-hj-suppress className="d-none d-md-inline">
            {username}
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-right zIndex-2">
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
};

AuthenticatedUserDropdown.defaultProps = {
  enterpriseLearnerPortalLink: '',
};

export default injectIntl(AuthenticatedUserDropdown);
