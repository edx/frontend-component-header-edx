import React from 'react';
import { PluginSlot } from '@openedx/frontend-plugin-framework';

const NotificationsSlot = () => (
  <PluginSlot
    id="org.edx.frontend.header.notifications_tray.v1"
    idAliases={['notifications_tray']}
  />
);

export default NotificationsSlot;
