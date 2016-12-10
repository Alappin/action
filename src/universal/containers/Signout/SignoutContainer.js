import React, {PropTypes, Component} from 'react'; // eslint-disable-line no-unused-vars
import {connect} from 'react-redux';
import {showSuccess} from 'universal/modules/toast/ducks/toastDuck';
import {removeAuthToken} from 'universal/redux/authDuck';
import {reset as resetAppState} from 'universal/redux/rootDuck';
import {withRouter} from 'react-router';
import {segmentEventTrack} from 'universal/redux/segmentActions';
import {cashay} from 'cashay';

const signoutSuccess = {
  title: 'Tootles!',
  message: 'You\'ve been logged out successfully.'
};

@connect()
@withRouter
export default class SignoutContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
  };

  componentWillMount() {
    const {dispatch, router} = this.props;

    dispatch(segmentEventTrack('User Logout'));
    dispatch(removeAuthToken());
    /* reset the app state, but preserve any pending notifications: */
    router.replace('/');
    dispatch(resetAppState());
    dispatch(showSuccess(signoutSuccess));
    cashay.clear();
    if (typeof window !== 'undefined' && typeof window.analytics !== 'undefined') {
      // inform segment of the signout, wipe state:
      window.analytics.reset();
    }
  }

  render() { return null; }
}
