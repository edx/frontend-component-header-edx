import { fetchAppsNotificationCount } from '../Notifications/data/thunks';
import { selectShowNotificationTray } from '../Notifications/data/selectors';

export const mapDispatchToProps = (dispatch) => ({
  fetchAppsNotificationCount: () => dispatch(fetchAppsNotificationCount()),
});

export const mapStateToProps = (state) => ({
  showNotificationsTray: selectShowNotificationTray(state),
});
