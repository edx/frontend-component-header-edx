import React from 'react';
import { reduxHooks } from 'hooks'; // eslint-disable-line import/no-unresolved
import { breakpoints, Dropdown, useWindowSize } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import _ from 'lodash';
import messages from './messages';

const UserDashboardMenuGroup = () => {
  const { formatMessage } = useIntl();
  const { width } = useWindowSize();
  const isMobile = width <= breakpoints.small.maxWidth;

  const dashboard = reduxHooks.useEnterpriseDashboardData();

  if (isMobile) {
    return (
      <>
        <li className="nav-item" key="item-dashboard">
          <a href="/edx-dashboard" className="nav-link active">
            {formatMessage(messages.dashboardPersonal)}
          </a>
        </li>
        {!_.isEmpty(dashboard) && (
        <li className="nav-item" key={dashboard.label}>
          <a href={dashboard.url} className="nav-link active">
            {dashboard.label} {formatMessage(messages.dashboard)}
          </a>
        </li>
        )}
      </>
    );
  }
  return (
    <>
      <Dropdown.Header>{formatMessage(messages.dashboardSwitch)}</Dropdown.Header>
      <Dropdown.Item as="a" href="/edx-dashboard" className="active" key="item-dashboard">
        {formatMessage(messages.dashboardPersonal)}
      </Dropdown.Item>
      {!_.isEmpty(dashboard) && (
        <Dropdown.Item as="a" href={dashboard.url} key={dashboard.label}>
          {dashboard.label} {formatMessage(messages.dashboard)}
        </Dropdown.Item>
      )}
      <Dropdown.Divider />
    </>
  );
};

export default UserDashboardMenuGroup;
