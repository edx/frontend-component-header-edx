import React from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  breakpoints, Dropdown, useWindowSize,
} from '@openedx/paragon';

import messages from './messages';

const UserDashboardMenu = ({ enterpriseOrg, enterpriseSrc, hasEnterpriseAccount }) => {
  const { formatMessage } = useIntl();
  const { width } = useWindowSize();
  const isMobile = width <= breakpoints.small.maxWidth;

  if (getConfig().ENABLE_EDX_PERSONAL_DASHBOARD) {
    if (!isMobile) {
      return (
        <>
          { hasEnterpriseAccount && <Dropdown.Header>{formatMessage(messages.dashboardSwitch)}</Dropdown.Header> }
          <Dropdown.Item as="a" href="/edx-dashboard" className={document.title === 'Learner Home' ? 'active' : ''} key="item-dashboard">
            {formatMessage(hasEnterpriseAccount ? messages.dashboardPersonal : messages.dashboard)}
          </Dropdown.Item>
          { hasEnterpriseAccount && (
          <Dropdown.Item as="a" href={enterpriseSrc} key={enterpriseOrg}>
            {enterpriseOrg} {formatMessage(messages.dashboard)}
          </Dropdown.Item>
          )}
          {hasEnterpriseAccount && <Dropdown.Divider />}
        </>
      );
    }
    return (
      <>
        <li className="nav-item" key="item-dashboard">
          <a href="/edx-dashboard" className={`nav-link ${document.title === 'Learner Home' ? 'active' : ''})`}>
            {formatMessage(messages.dashboardPersonal)}
          </a>
        </li>
        {hasEnterpriseAccount && (
        <li className="nav-item" key={enterpriseOrg}>
          <a href={enterpriseSrc} className="nav-link">
            {enterpriseOrg} {formatMessage(messages.dashboard)}
          </a>
        </li>
        )}
      </>
    );
  }
  return null;
};

UserDashboardMenu.defaultProps = {
  enterpriseOrg: null,
  enterpriseSrc: null,
  hasEnterpriseAccount: false,
};

UserDashboardMenu.propTypes = {
  enterpriseOrg: PropTypes.string,
  enterpriseSrc: PropTypes.string,
  hasEnterpriseAccount: PropTypes.bool,
};

export default UserDashboardMenu;
