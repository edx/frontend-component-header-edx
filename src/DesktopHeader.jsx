import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { AvatarButton, Dropdown } from '@openedx/paragon';

// Local Components
import UserMenuGroupItemSlot from './plugin-slots/UserMenuGroupItemSlot';
import UserMenuGroupSlot from './plugin-slots/UserMenuGroupSlot';
import UserMenuItem from './common/UserMenuItem';
import { Menu, MenuTrigger, MenuContent } from './Menu';
import { LinkedLogo, Logo } from './Logo';
import Notifications from './Notifications';
import { selectShowNotificationTray } from './Notifications/data/selectors';
import { fetchAppsNotificationCount } from './Notifications/data/thunks';

// i18n
import messages from './Header.messages';

// Assets
import { CaretIcon } from './Icons';

class DesktopHeader extends React.Component {
  constructor(props) { // eslint-disable-line no-useless-constructor
    super(props);
    this.state = {
      locationHref: window.location.href,
    };
  }

  componentDidMount() {
    this.props.fetchAppsNotificationCount();
  }

  componentDidUpdate() {
    if (window.location.href !== this.state.locationHref) {
      this.setState({ locationHref: window.location.href });
      this.props.fetchAppsNotificationCount();
    }
  }

  renderMenu(menu) {
    // Nodes are accepted as a prop
    if (!Array.isArray(menu)) {
      return menu;
    }

    return menu.map((menuItem) => {
      const {
        type,
        href,
        content,
        submenuContent,
        disabled,
        isActive,
        onClick,
      } = menuItem;

      if (type === 'item') {
        return (
          <a
            key={`${type}-${content}`}
            className={`nav-link${disabled ? ' disabled' : ''}${isActive ? ' active' : ''}`}
            href={href}
            onClick={onClick || null}
          >
            {content}
          </a>
        );
      }

      return (
        <Menu key={`${type}-${content}`} tag="div" className="nav-item" respondToPointerEvents>
          <MenuTrigger onClick={onClick || null} tag="a" className="nav-link d-inline-flex align-items-center" href={href}>
            {content} <CaretIcon role="img" aria-hidden focusable="false" />
          </MenuTrigger>
          <MenuContent className="pin-left pin-right shadow py-2">
            {submenuContent}
          </MenuContent>
        </Menu>
      );
    });
  }

  renderMainMenu() {
    const { mainMenu } = this.props;
    return this.renderMenu(mainMenu);
  }

  renderSecondaryMenu() {
    const { secondaryMenu } = this.props;
    return this.renderMenu(secondaryMenu);
  }

  renderUserMenu() {
    const {
      userMenu,
      avatar,
      name,
      email,
      intl,
    } = this.props;

    return (
      <Dropdown>
        <Dropdown.Toggle
          id="menu-dropdown"
          as={AvatarButton}
          src={avatar}
          alt=""
          aria-label={intl.formatMessage(messages['header.label.account.menu.for'], { name })}
          data-hj-suppress
        />
        <Dropdown.Menu alignRight>
          {(name || email) && (
            <Dropdown.Item
              key="user-info"
              className="user-info__menu-item"
            >
              <UserMenuItem
                name={name}
                email={email}
              />
            </Dropdown.Item>
          )}
          <UserMenuGroupSlot />
          {userMenu.map((group, index) => (
            // eslint-disable-next-line react/jsx-no-comment-textnodes,react/no-array-index-key
            <React.Fragment key={index}>
              {group.heading && <Dropdown.Header>{group.heading}</Dropdown.Header>}
              {index === 0 && (<UserMenuGroupItemSlot />)}
              {group.items.map(({
                type, content, href, disabled, isActive, onClick,
              }) => (
                <Dropdown.Item
                  key={`${type}-${content}`}
                  href={href}
                  onClick={onClick || null}
                  className={`${isActive ? ' active' : ''}${disabled ? ' disabled' : ''}`}
                >
                  {content}
                </Dropdown.Item>
              ))}
              {index < userMenu.length - 1 && <Dropdown.Divider />}
            </React.Fragment>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  renderLoggedOutItems() {
    const { loggedOutItems } = this.props;

    return loggedOutItems.map((item, i, arr) => (
      <a
        key={`${item.type}-${item.content}`}
        className={i < arr.length - 1 ? 'btn mr-2 btn-link' : 'btn mr-2 btn-outline-primary'}
        href={item.href}
      >
        {item.content}
      </a>
    ));
  }

  render() {
    const {
      logo,
      logoAltText,
      logoDestination,
      loggedIn,
      showNotificationsTray,
      intl,
    } = this.props;
    const logoProps = { src: logo, alt: logoAltText, href: logoDestination };
    const logoClasses = getConfig().AUTHN_MINIMAL_HEADER ? 'mw-100' : null;

    return (
      <header className="site-header-desktop">
        <a className="nav-skip sr-only sr-only-focusable" href="#main">{intl.formatMessage(messages['header.label.skip.nav'])}</a>
        <div className={`container-fluid ${logoClasses}`}>
          <div className="nav-container position-relative d-flex align-items-center">
            {logoDestination === null ? <Logo className="logo" src={logo} alt={logoAltText} /> : <LinkedLogo className="logo" {...logoProps} />}
            <nav
              aria-label={intl.formatMessage(messages['header.label.main.nav'])}
              className="nav main-nav"
            >
              {this.renderMainMenu()}
            </nav>
            <nav
              aria-label={intl.formatMessage(messages['header.label.secondary.nav'])}
              className="nav secondary-menu-container align-items-center ml-auto"
            >
              {loggedIn
                ? (
                  <>
                    {this.renderSecondaryMenu()}
                    {showNotificationsTray && <Notifications showLeftMargin={false} />}
                    {this.renderUserMenu()}
                  </>
                ) : this.renderLoggedOutItems()}
            </nav>
          </div>
        </div>
      </header>
    );
  }
}

DesktopHeader.propTypes = {
  mainMenu: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.array,
  ]),
  secondaryMenu: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.array,
  ]),
  userMenu: PropTypes.arrayOf(PropTypes.shape({
    heading: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf(['item', 'menu']),
      href: PropTypes.string,
      content: PropTypes.string,
      disabled: PropTypes.bool,
      isActive: PropTypes.bool,
      onClick: PropTypes.func,
    })),
  })),
  loggedOutItems: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['item', 'menu']),
    href: PropTypes.string,
    content: PropTypes.string,
  })),
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
  logoDestination: PropTypes.string,
  avatar: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  loggedIn: PropTypes.bool,
  showNotificationsTray: PropTypes.bool,
  fetchAppsNotificationCount: PropTypes.func.isRequired,
  // i18n
  intl: intlShape.isRequired,
};

DesktopHeader.defaultProps = {
  mainMenu: [],
  secondaryMenu: [],
  userMenu: [],
  loggedOutItems: [],
  logo: null,
  logoAltText: null,
  logoDestination: null,
  avatar: null,
  name: '',
  email: '',
  loggedIn: false,
  showNotificationsTray: false,
};

const mapDispatchToProps = (dispatch) => ({
  fetchAppsNotificationCount: () => dispatch(fetchAppsNotificationCount()),
});

const mapStateToProps = (state) => ({
  showNotificationsTray: selectShowNotificationTray(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(DesktopHeader));
