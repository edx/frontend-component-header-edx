import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Avatar,
} from '@openedx/paragon';
import NavDropdownMenu from './NavDropdownMenu';
import getUserMenuItems from './utils';

const UserMenu = ({
  name,
  email,
  studioBaseUrl,
  logoutUrl,
  authenticatedUserAvatar,
  isAdmin,
  // injected
  intl,
}) => {
  const avatar = authenticatedUserAvatar ? (
    <img
      className="d-block w-100 h-100"
      src={authenticatedUserAvatar}
      alt={name}
      data-testid="avatar-image"
    />
  ) : (
    <Avatar
      size="sm"
      className="mr-2"
      alt={name}
      data-testid="avatar-icon"
    />
  );

  return (
    <NavDropdownMenu
      buttonTitle={avatar}
      id="user-dropdown-menu"
      name={name}
      email={email}
      items={getUserMenuItems({
        studioBaseUrl,
        logoutUrl,
        intl,
        isAdmin,
      })}
    />
  );
};

UserMenu.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  studioBaseUrl: PropTypes.string.isRequired,
  logoutUrl: PropTypes.string.isRequired,
  authenticatedUserAvatar: PropTypes.string,
  isAdmin: PropTypes.bool,
  // injected
  intl: intlShape.isRequired,
};

UserMenu.defaultProps = {
  isAdmin: false,
  authenticatedUserAvatar: null,
  name: '',
  email: '',
};

export default injectIntl(UserMenu);
