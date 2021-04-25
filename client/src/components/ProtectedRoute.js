import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {

  const checkValidToken = () => {
    if(localStorage.getItem('auth-token')) return true;
  }

  return (
    <Fragment>
      {checkValidToken()
          ? <Route {...rest} render={props => <Component {...rest} {...props} />} />
          : <Redirect to="/Login" />
      }
    </Fragment>
  );
}

export default ProtectedRoute