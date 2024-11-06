import React from 'react';

import { useAppNotifications } from './data/hook';

export default function withNotifications(Component) {
  return function WrapperComponent(props) {
    const { notificationAppData } = useAppNotifications();
    return <Component {...props} notificationAppData={notificationAppData} />;
  };
}
