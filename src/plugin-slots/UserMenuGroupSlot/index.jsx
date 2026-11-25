import React from 'react';

import { PluginSlot } from '@openedx/frontend-plugin-framework';

const UserMenuGroupSlot = () => (
  <PluginSlot
    id="org.edx.frontend.header.user_menu_group.v1"
    idAliases={['header_user_menu_group_slot']}
  />
);

export default UserMenuGroupSlot;
