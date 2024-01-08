import { useCallback, useMemo } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useDispatch, useSelector } from 'react-redux';
import messages from '../messages';
import tourCheckpoints from '../constants';
import { selectTours } from './selectors';
import { updateTourShowStatus } from './thunks';

export function camelToConstant(string) {
  return string.replace(/[A-Z]/g, (match) => `_${match}`).toUpperCase();
}

export const useTourConfiguration = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const tours = useSelector(selectTours);

  const handleOnOkay = useCallback((id) => {
    dispatch(updateTourShowStatus(id));
  }, [dispatch]);

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
  ), [handleOnOkay, intl, tours]);

  return toursConfig;
};
