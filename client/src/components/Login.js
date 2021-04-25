import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useHistory } from 'react-router';
import { AUTH_TOKEN } from '../constants';
import '../styles/Login.css';
import logo from '../styles/icons/logo2.png'

const SIGN_UP_MUTATION = gql`
mutation signUp($email: String!, $password: String!, $name: String!) {
  signUp(input: {email: $email, password: $password, name: $name}){
    token
    user {
      id
      name
      email
    }
  }
}
`;

const SIGN_IN_MUTATION = gql`
mutation signIn($email: String!, $password: String!){
    signIn(input:{
      email: $email,
      password: $password
    }) {
      token
    }
  }
`;

const Login = () => {
  const history = useHistory();
  //const authToken = localStorage.getItem(AUTH_TOKEN);

  const [formState, setFormState] = useState({
    login: true,
    email: '',
    password: '',
    name: ''
  });

  const [err, setError] = useState (false);
  const [usernameSmall, setUsernameSmall] = useState ('');
  const [emailSmall, setEmailSmall] = useState ('');
  const [passwordSmall, setPasswordSmall] = useState ('');

    const [login] = useMutation(SIGN_IN_MUTATION, {
      variables: {
        email: formState.email,
        password: formState.password
      },
      onError: (e) => {
        setError(true);
      },
      onCompleted: ( {signIn} ) => {
        localStorage.setItem(AUTH_TOKEN, signIn.token);
        history.push('/');
      }
    });

  const validateUsername = () => {
    if(formState.name.length < 8 || formState.name.length > 24){
      setUsernameSmall('Min. 8 symbols, max 24 symbols');
      return false;
    };
    setUsernameSmall('');
    return true;
  }

  const validateEmail = () => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(formState.email)) {
      setEmailSmall('Wrong email format');
      return false;
    }
    setEmailSmall('');
    return true;
  }

  const validatePassword = () => {
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    if (!re.test(formState.password)) {
      setPasswordSmall('The password must contain at least one lowercase character, at least one uppercase character, at least one number, the password must be eight characters or longer');
      return false;
    }
    setPasswordSmall('');
    return true;
  }

  const signupProcess = () => {
    validateUsername() && validateEmail() && validatePassword() && signup();
  };

  const [signup] = useMutation(SIGN_UP_MUTATION, {
    variables: {
      name: formState.name,
      email: formState.email,
      password: formState.password
    },
    onCompleted: ({ signUp }) => {
      localStorage.setItem(AUTH_TOKEN, signUp.token);
      history.push('/');
    }
  });

  return (
    <div className="login_main">
      <div className="login_left">
      <div className="login_header">
        <img className="login_logo" alt="logo" src={logo}/>
        <h1 className="login_header_title">StudTask</h1>
      </div>
      <h4 className="login_state">
        {formState.login ? 'Log in to your account' : 'Create your account'}
      </h4>
      <div className="login_inputs">
        {!formState.login && (
          <><label htmlFor="username">Username</label>
          <input
            value={formState.name}
            onChange={(e) =>
              setFormState({
                ...formState,
                name: e.target.value
              })
            }
            type="text"
            name="username"
          />
          {!formState.login && <small id="usrnameSmall">{usernameSmall}</small>}</>
        )}
        <label htmlFor="email">Email</label>
        <input
          value={formState.email}
          onChange={(e) =>
            setFormState({
              ...formState,
              email: e.target.value
            })
          }
          type="text"
          name="email"
        />
        {!formState.login && <small id="emailSmall">{emailSmall}</small>}
        <label htmlFor="password">Password</label>
        <input
          value={formState.password}
          onChange={(e) =>
            setFormState({
              ...formState,
              password: e.target.value
            })
          }
          type="password"
          name="password"
        />
        {!formState.login && <small id="passwordSmall">{passwordSmall}</small>}
      </div>
      {formState.login && err && <p className="errorMessage">Please provide a valid email and password.</p>}
      <div className="login_buttons">
        <button type="submit" onClick={formState.login ? login : signupProcess}>
          {formState.login ? 'Login' : 'Sign Up'}
        </button>
        <p>{formState.login
          ? 'Don`t have an account?'
          : 'Have an account?'}</p>
        <h4 onClick={(e) => setFormState({
          ...formState,
          login: !formState.login
        })}>
        {formState.login
          ? 'Sign Up'
          : 'Log In'}
        </h4>
      </div>
    </div>
    <div className="login_right">

    </div>
  </div>
  );
};

export default Login;