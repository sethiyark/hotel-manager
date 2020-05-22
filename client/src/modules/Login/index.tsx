import * as React from 'react';
import validator from 'validator';
import Cookies from 'universal-cookie';
import { Link, useHistory } from 'react-router-dom';
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from 'semantic-ui-react';
import { useEffect } from 'react';
import _ from 'lodash';

const LOGIN_API_URL = 'http://localhost:3001/api/v1/login';

const cookies = new Cookies();

const LoginForm = ({ setClient }) => {
  const history = useHistory();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoginSuccessful, setIsLoginSuccessful] = React.useState(false);

  const [emailError, setEmailError] = React.useState(null);
  const [passwordError, setPasswordError] = React.useState(null);
  const [loginError, setLoginError] = React.useState(null);

  const validateEmail = () => {
    if (!email) {
      setEmailError('Required');
    } else if (!validator.isEmail(email)) {
      setEmailError('Invalid email address');
    }
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError('Required');
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
    }
  };

  const attemptLogin = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
      }),
    };

    fetch(LOGIN_API_URL, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (_.isEqual(data.status, 'success')) {
          if (
            _.has(data, 'token.refreshToken') &&
            _.has(data, 'token.accessToken')
          ) {
            setIsLoginSuccessful(true);
            cookies.set('refreshToken', `${data.token.refreshToken}`);
            cookies.set('userId', `${data.user.id}`);
            setClient(data.token.accessToken);
          } else {
            setLoginError(`Invalid token received`);
            setTimeout(() => setLoginError(null), 5000);
          }
        } else {
          setLoginError(`Server response: ${data.message}`);
          setTimeout(() => setLoginError(null), 5000);
        }
      })
      .then(() => {
        setIsSubmitting(false);
        setEmail('');
        setPassword('');
      })
      .then(() => {
        if (isLoginSuccessful) {
          history.push('/dashboard');
        }
      });
  };

  useEffect(() => {
    if (isSubmitting && _.isEmpty(emailError) && _.isEmpty(passwordError)) {
      attemptLogin();
    }
  }, [
    emailError,
    passwordError,
    email,
    password,
    isLoginSuccessful,
    isSubmitting,
  ]);

  const onSubmit = () => {
    validateEmail();
    validatePassword();
    setIsSubmitting(true);
  };

  const onEmailChange = (e, { value }) => {
    if (emailError) setEmailError(null);
    setEmail(value);
  };

  const onPasswordChange = (e, { value }) => {
    if (passwordError) setPasswordError(null);
    setPassword(value);
  };

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" textAlign="center">
          Log-in to your account
        </Header>
        <Message
          hidden={_.isEmpty(loginError)}
          error
          header="Login failure"
          content={loginError}
        />
        <Form size="large" onSubmit={onSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="mail"
              iconPosition="left"
              placeholder="E-mail address"
              onChange={onEmailChange}
              value={email}
              error={
                emailError && {
                  content: emailError,
                  pointing: 'above',
                }
              }
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              onChange={onPasswordChange}
              value={password}
              error={
                passwordError && {
                  content: passwordError,
                  pointing: 'above',
                }
              }
            />

            <Button fluid size="large" primary basic loading={isSubmitting}>
              Login
            </Button>
          </Segment>
        </Form>
        <Segment>
          Not registered yet?
          <Link to="/registration"> Sign Up </Link>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
