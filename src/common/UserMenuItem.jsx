import React from 'react';
import PropTypes from 'prop-types';

import { Avatar } from '@openedx/paragon';
import { injectIntl } from '@edx/frontend-platform/i18n';

import './style.scss';

const UserMenuItem = ({ name, email }) => (
  <>
    <Avatar
      size="sm"
      className="mr-2"
      alt={name}
      data-testid="avatar-icon"
    />
    <div className="text-left">
      {name && <span className="h5 d-block">{name}</span>}
      {email && <span className="small d-block">{email}</span>}
    </div>
  </>
);

UserMenuItem.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
};

UserMenuItem.defaultProps = {
  name: '',
  email: '',
};

export default injectIntl(UserMenuItem);
