import React from 'react';

import { PluginSlot } from '@openedx/frontend-plugin-framework';

const UserMenuGroupItemSlot = () => (
  <PluginSlot
    id="org.edx.frontend.header.user_menu_group_item.v1"
    idAliases={['header_user_menu_group_item_slot']}
  />
);

export default UserMenuGroupItemSlot;
