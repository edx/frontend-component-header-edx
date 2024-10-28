import React, { useEffect, useContext } from 'react';
import isEmpty from 'lodash/isEmpty';
import { ProductTour } from '@openedx/paragon';
import { useNotificationTour } from './data/hooks';
import { notificationsContext } from '../context/notificationsContext';

const NotificationTour = () => {
  const { useTourConfiguration, fetchNotificationTours } = useNotificationTour();
  const config = useTourConfiguration();
  const { updateNotificationData } = useContext(notificationsContext);

  useEffect(() => {
    const fetchTourData = async () => {
      const data = await fetchNotificationTours();
      updateNotificationData(data);
    };

    fetchTourData();
  }, [fetchNotificationTours, updateNotificationData]);

  return (
    !isEmpty(config) && (
      <ProductTour
        tours={config}
      />
    )
  );
};

export default NotificationTour;
