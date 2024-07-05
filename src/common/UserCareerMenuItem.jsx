import React from 'react';
import { reduxHooks } from 'hooks'; // eslint-disable-line import/no-unresolved
import {
  Badge, breakpoints, Dropdown, useWindowSize,
} from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import _ from 'lodash';
import { getConfig } from '@edx/frontend-platform';
import messages from './messages';

const UserCareerMenuItem = () => {
  const { formatMessage } = useIntl();
  const { width } = useWindowSize();
  const isMobile = width <= breakpoints.small.maxWidth;

  const dashboard = reduxHooks.useEnterpriseDashboardData();

  if (!_.isEmpty(dashboard)) {
    return null;
  }
  if (isMobile) {
    return (
      <li className="nav-item" key="item-career">
        <a href={`${getConfig().CAREER_LINK_URL}`} className="nav-link">
          {formatMessage(messages.career)}
          <Badge className="px-2 mx-2" variant="warning">
            {formatMessage(messages.newAlert)}
          </Badge>
        </a>
      </li>
    );
  }
  return (
    <Dropdown.Item href={`${getConfig().CAREER_LINK_URL}`} key="item-career">
      {formatMessage(messages.career)}
      <Badge className="px-2 mx-2" variant="warning">
        {formatMessage(messages.newAlert)}
      </Badge>
    </Dropdown.Item>
  );
};

export default UserCareerMenuItem;
