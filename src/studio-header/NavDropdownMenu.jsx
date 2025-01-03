import React from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownButton,
} from '@openedx/paragon';

import UserMenuItem from '../common/UserMenuItem';

const NavDropdownMenu = ({
  id,
  buttonTitle,
  name,
  email,
  items,
}) => (
  <DropdownButton
    id={id}
    title={buttonTitle}
    variant="outline-primary"
    className="mr-2"
  >
    {(name || email) && (
    <Dropdown.Item
      key="user-info"
      className="small user-info__menu-item"
    >
      <UserMenuItem
        name={name}
        email={email}
      />
    </Dropdown.Item>
    )}
    {items.map(item => (
      <Dropdown.Item
        key={`${item.title}-dropdown-item`}
        href={item.href}
        className="small"
      >
        {item.title}
      </Dropdown.Item>
    ))}
  </DropdownButton>
);

NavDropdownMenu.propTypes = {
  id: PropTypes.string.isRequired,
  email: PropTypes.string,
  name: PropTypes.string,
  buttonTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string,
    title: PropTypes.string,
  })).isRequired,
};

NavDropdownMenu.defaultProps = {
  name: '',
  email: '',
};

export default NavDropdownMenu;
