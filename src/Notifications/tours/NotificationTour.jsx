import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { ProductTour } from '@edx/paragon';
import { useTourConfiguration } from './data/hooks';
import { fetchNotificationTours } from './data/thunks';

const NotificationTour = () => {
  const dispatch = useDispatch();
  const config = useTourConfiguration();

  useEffect(() => {
    dispatch(fetchNotificationTours());
  }, [dispatch]);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {!isEmpty(config) && (
        <ProductTour
          tours={config}
        />
      )}
    </>
  );
};

export default NotificationTour;
