import React from 'react';
import { connect } from 'react-redux';
import Login from './login/Login';
import Secured from './Secured';

class Application extends React.Component {
  render() {
    if (this.props.isLoggedIn) {
      return <Secured />;
    }
    return <Login />;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.authorizationReducer.isLoggedIn,
  };
};

export default connect(mapStateToProps)(Application);
