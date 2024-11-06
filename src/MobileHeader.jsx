import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

// Local Components
import { AvatarButton } from '@openedx/paragon';
import UserMenuGroupSlot from './plugin-slots/UserMenuGroupSlot';
import UserMenuGroupItemSlot from './plugin-slots/UserMenuGroupItemSlot';
import { Menu, MenuTrigger, MenuContent } from './Menu';
import { LinkedLogo, Logo } from './Logo';
import UserMenuItem from './common/UserMenuItem';
import withNotifications from './Notification/withNotifications';
import Notifications from './Notification';
// i18n
import messages from './Header.messages';

// Assets
import { MenuIcon } from './Icons';

class MobileHeader extends React.Component {
  constructor(props) { // eslint-disable-line no-useless-constructor
    super(props);
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
        <Menu key={`${type}-${content}`} tag="div" className="nav-item">
          <MenuTrigger onClick={onClick || null} tag="a" role="button" tabIndex="0" className="nav-link">
            {content}
          </MenuTrigger>
          <MenuContent className="position-static pin-left pin-right py-2">
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

  renderUserMenuItems() {
    const { userMenu, name, email } = this.props;
    const userInfoItem = (name || email) ? (
      <li className="nav-item user-info__menu-item" key="user-info">
        <UserMenuItem name={name} email={email} />
      </li>
    ) : null;

    const userMenuItems = userMenu.map((group) => (
      group.items.map(({
        type, content, href, disabled, isActive, onClick,
      }) => (
        <li className="nav-item" key={`${type}-${content}`}>
          <a
            className={`nav-link${isActive ? ' active' : ''}${disabled ? ' disabled' : ''}`}
            href={href}
            onClick={onClick || null}
          >
            {content}
          </a>
        </li>
      ))
    ));

    const userMenuGroupSlot = <UserMenuGroupSlot />;
    const userMenuGroupItemSlot = <UserMenuGroupItemSlot />;

    return userInfoItem
      ? [userInfoItem, userMenuGroupSlot, userMenuGroupItemSlot, ...userMenuItems]
      : [userMenuGroupSlot, userMenuGroupItemSlot, ...userMenuItems];
  }

  renderLoggedOutItems() {
    const { loggedOutItems } = this.props;

    return loggedOutItems.map(({ type, href, content }, i, arr) => (
      <li className="nav-item px-3 my-2" key={`${type}-${content}`}>
        <a
          className={i < arr.length - 1 ? 'btn btn-block btn-outline-primary' : 'btn btn-block btn-primary'}
          href={href}
        >
          {content}
        </a>
      </li>
    ));
  }

  render() {
    const {
      logo,
      logoAltText,
      logoDestination,
      loggedIn,
      avatar,
      name,
      stickyOnMobile,
      intl,
      mainMenu,
      userMenu,
      loggedOutItems,
      notificationAppData,
    } = this.props;
    const logoProps = { src: logo, alt: logoAltText, href: logoDestination };
    const stickyClassName = stickyOnMobile ? 'sticky-top' : '';
    const logoClasses = getConfig().AUTHN_MINIMAL_HEADER ? 'justify-content-left pl-3' : 'justify-content-center';

    return (
      <header
        aria-label={intl.formatMessage(messages['header.label.main.header'])}
        className={`site-header-mobile d-flex justify-content-between align-items-center shadow ${stickyClassName}`}
      >
        <a className="nav-skip sr-only sr-only-focusable" href="#main">{intl.formatMessage(messages['header.label.skip.nav'])}</a>
        {mainMenu.length > 0 ? (
          <div className="w-100 d-flex justify-content-start">
            <Menu className="position-static">
              <MenuTrigger
                tag="button"
                className="icon-button"
                aria-label={intl.formatMessage(messages['header.label.main.menu'])}
                title={intl.formatMessage(messages['header.label.main.menu'])}
              >
                <MenuIcon role="img" aria-hidden focusable="false" style={{ width: '1.5rem', height: '1.5rem' }} />
              </MenuTrigger>
              <MenuContent
                tag="nav"
                aria-label={intl.formatMessage(messages['header.label.main.nav'])}
                className="nav flex-column pin-left pin-right border-top shadow py-2"
              >
                {this.renderMainMenu()}
                {this.renderSecondaryMenu()}
              </MenuContent>
            </Menu>
          </div>
        ) : null}
        <div className={`w-100 d-flex ${logoClasses}`}>
          { logoDestination === null ? <Logo className="logo" src={logo} alt={logoAltText} /> : <LinkedLogo className="logo" {...logoProps} itemType="http://schema.org/Organization" />}
        </div>
        {userMenu.length > 0 || loggedOutItems.length > 0 ? (
          <div className="w-100 d-flex justify-content-end align-items-center">
            {notificationAppData?.showNotificationsTray && <Notifications notificationAppData={notificationAppData} />}
            <Menu tag="nav" aria-label={intl.formatMessage(messages['header.label.secondary.nav'])} className="position-static">
              <MenuTrigger
                tag={AvatarButton}
                aria-label={intl.formatMessage(messages['header.label.account.menu'])}
                title={intl.formatMessage(messages['header.label.account.menu'])}
                src={avatar}
                showLabel={false}
              >
                {name}
              </MenuTrigger>
              <MenuContent tag="ul" className="nav flex-column pin-left pin-right border-top shadow py-2">
                {loggedIn ? this.renderUserMenuItems() : this.renderLoggedOutItems()}
              </MenuContent>
            </Menu>
          </div>
        ) : null}
      </header>
    );
  }
}

MobileHeader.propTypes = {
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
  stickyOnMobile: PropTypes.bool,
  notificationAppData: PropTypes.shape({
    apps: PropTypes.objectOf(
      PropTypes.arrayOf(PropTypes.string),
    ).isRequired,
    appsId: PropTypes.arrayOf(PropTypes.string).isRequired,
    isNewNotificationViewEnabled: PropTypes.bool.isRequired,
    notificationExpiryDays: PropTypes.number.isRequired,
    notificationStatus: PropTypes.string.isRequired,
    showNotificationsTray: PropTypes.bool.isRequired,
    tabsCount: PropTypes.shape({
      count: PropTypes.number.isRequired,
    }).isRequired,
  }),
  // i18n
  intl: intlShape.isRequired,
};

MobileHeader.defaultProps = {
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
  stickyOnMobile: true,
  notificationAppData: {
    apps: {},
    tabsCount: {},
    appsId: [],
    isNewNotificationViewEnabled: false,
    notificationExpiryDays: 0,
    notificationStatus: '',
    showNotificationsTray: false,
  },
};

export default injectIntl(withNotifications(MobileHeader));
