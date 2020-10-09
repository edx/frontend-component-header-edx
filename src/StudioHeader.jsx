import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
import { ensureConfig } from '@edx/frontend-platform';

import Header from './Header';
import { menuItemShape, itemDetailsShape } from './data/shapes/header';
import messages from './StudioHeader.messages';

ensureConfig([
  'STUDIO_BASE_URL',
  'LIB_AUTHORING_BASE_URL',
], 'StudioHeader component');

export class StudioHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderItemDetails() {
    const { itemDetails } = this.props;

    return (
      <>
        <nav className="nav item-details-container">
          <div className="nav-link item-details">
            <a href={itemDetails.url} className="item-link">
              <span className="item-detail item-org">{itemDetails.org}</span>
              <span className="item-detail item-id">{itemDetails.id}</span>
              <span className="item-detail item-title" title={itemDetails.title}>{itemDetails.title}</span>
            </a>
          </div>
        </nav>
      </>
    );
  }

  render() {
    const {
      intl, mainMenu, extraMainMenuItems, itemDetails,
    } = this.props;
    const { config } = this.context;

    const menu = mainMenu || [
      {
        type: 'item',
        href: `${config.STUDIO_BASE_URL}/home/`,
        content: intl.formatMessage(messages['header.links.courses']),
      },
      {
        type: 'item',
        href: `${config.LIB_AUTHORING_BASE_URL}/`,
        content: intl.formatMessage(messages['header.links.libraries']),
      },
      ...extraMainMenuItems,
    ];

    return (
      <Header variant="studio" mainMenu={menu}>
        {itemDetails && this.renderItemDetails()}
      </Header>
    );
  }
}

StudioHeader.contextType = AppContext;

StudioHeader.propTypes = {
  intl: intlShape.isRequired,
  itemDetails: itemDetailsShape,
  mainMenu: PropTypes.arrayOf(menuItemShape),
  extraMainMenuItems: PropTypes.arrayOf(menuItemShape),
};

StudioHeader.defaultProps = {
  itemDetails: null,
  mainMenu: null,
  extraMainMenuItems: [],
};

export default injectIntl(StudioHeader);
