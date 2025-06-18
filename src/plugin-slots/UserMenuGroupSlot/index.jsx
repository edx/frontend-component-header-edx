import React from 'react';
import PropTypes from 'prop-types';

import { PluginSlot } from '@openedx/frontend-plugin-framework';
import UserDashboardMenu from '../../common/UserDashboardMenu';

const UserMenuGroupSlot = ({ hasEnterpriseAccount, logoAltText, logoDestination }) => (
  <PluginSlot
    id="header_user_menu_group_slot"
  >
    <UserDashboardMenu
      hasEnterpriseAccount={hasEnterpriseAccount}
      enterpriseOrg={logoAltText}
      enterpriseSrc={logoDestination}
    />
  </PluginSlot>
);

UserMenuGroupSlot.defaultProps = {
  hasEnterpriseAccount: false,
  logoAltText: '',
  logoDestination: '',
};

UserMenuGroupSlot.propTypes = {
  hasEnterpriseAccount: PropTypes.bool,
  logoAltText: PropTypes.string,
  logoDestination: PropTypes.string,
};

export default UserMenuGroupSlot;
