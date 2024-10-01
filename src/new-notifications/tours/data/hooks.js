import { useMemo, useContext, useCallback } from 'react';
import { camelCaseObject } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from '../messages';
import tourCheckpoints from '../constants';
import { getNotificationsTours, updateNotificationsTour } from './api';
import { RequestStatus } from '../../data/constants';
import { HeaderContext } from '../../../common/context';

export function camelToConstant(string) {
  return string.replace(/[A-Z]/g, (match) => `_${match}`).toUpperCase();
}

export function useNotificationTour() {
  const { tours, updateNotificationData } = useContext(HeaderContext);

  function normaliseTourData(data) {
    return data.map(tour => ({ ...tour, enabled: true }));
  }

  const fetchNotificationTours = useCallback(async () => {
    try {
      const data = await getNotificationsTours();
      const normalizedData = camelCaseObject(normaliseTourData(data));

      return { tours: normalizedData, loading: RequestStatus.SUCCESSFUL };
    } catch (error) {
      return { notificationStatus: RequestStatus.FAILED };
    }
  }, []);

  const updateTourShowStatus = useCallback(async (tourId) => {
    try {
      const data = await updateNotificationsTour(tourId);
      const normalizedData = camelCaseObject(data);
      const tourIndex = tours.findIndex(tour => tour.id === normalizedData.id);
      tours[tourIndex] = normalizedData;

      return { tours, loading: RequestStatus.SUCCESSFUL };
    } catch (error) {
      return { notificationStatus: RequestStatus.FAILED };
    }
  }, [tours]);

  const handleOnOkay = useCallback(async (id) => {
    const data = await updateTourShowStatus(id);
    updateNotificationData(data);
  }, [updateNotificationData, updateTourShowStatus]);

  const useTourConfiguration = async () => {
    const intl = useIntl();

    const toursConfig = useMemo(() => (
      tours?.map((tour) => Object.keys(tourCheckpoints(intl)).includes(tour.tourName) && (
        {
          tourId: tour.tourName,
          dismissButtonText: intl.formatMessage(messages.dismissButtonText),
          endButtonText: intl.formatMessage(messages.endButtonText),
          enabled: tour && Boolean(tour.enabled && tour.showTour),
          onEnd: () => handleOnOkay(tour.id),
          checkpoints: tourCheckpoints(intl)[camelToConstant(tour.tourName)],
        }
      ))
    ), [intl]);

    return toursConfig;
  };

  return {
    fetchNotificationTours,
    updateTourShowStatus,
    useTourConfiguration,
  };
}
