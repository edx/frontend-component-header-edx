/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext } from 'react';
import isEmpty from 'lodash/isEmpty';
import { ProductTour } from '@openedx/paragon';
import { useNotificationTour } from './data/hooks';
import { HeaderContext } from '../../common/context';

const NotificationTour = () => {
  const { useTourConfiguration, fetchNotificationTours } = useNotificationTour();
  const config = useTourConfiguration();
  const { updateNotificationData } = useContext(HeaderContext);

  useEffect(() => {
    const fetchTourData = async () => {
      const data = await fetchNotificationTours();
      updateNotificationData(data);
    };

    fetchTourData();
  }, []);

  return (
    !isEmpty(config) && (
      <ProductTour
        tours={config}
      />
    )
  );
};

export default NotificationTour;
