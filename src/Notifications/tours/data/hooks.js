import { useCallback } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useDispatch, useSelector } from 'react-redux';
import messages from '../messages';
import tourCheckpoints from '../constants';
import { disableTourStatus } from '../../data/slice';
import { selectTourStatus } from '../../data/selectors';

const useTourConfiguration = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const tourStatus = useSelector(selectTourStatus);

  const disableTour = useCallback(() => {
    dispatch(disableTourStatus());
  }, [dispatch]);

  const tours = [{
    tourId: intl.formatMessage(messages.notificationTourId),
    dismissButtonText: intl.formatMessage(messages.dismissButtonText),
    endButtonText: intl.formatMessage(messages.endButtonText),
    enabled: tourStatus && true,
    onEnd: disableTour,
    checkpoints: tourCheckpoints(intl).Notification,
  }];

  return tours;
};

export default useTourConfiguration;
