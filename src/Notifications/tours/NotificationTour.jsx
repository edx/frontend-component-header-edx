import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { ProductTour } from '@edx/paragon';

import useTourConfiguration from './data/hooks';

const NotificationTour = () => {
  const config = useTourConfiguration();

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
