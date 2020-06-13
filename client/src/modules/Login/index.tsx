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
import PropTypes from 'prop-types';

const LOGIN_API_URL = 'http://localhost:3001/api/v1/login';

const cookies = new Cookies();

const LoginForm = ({ setClient }) => {
  const history = useHistory();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [loginError, setLoginError] = React.useState('');

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
            cookies.set('refreshToken', `${data.token.refreshToken}`);
            cookies.set('user', JSON.stringify(data.user));
            setClient(data.token.accessToken);
            history.push('/dashboard');
          } else {
            setIsSubmitting(false);
            setLoginError(`Invalid token received`);
          }
        } else {
          setIsSubmitting(false);
          setLoginError(`Server response: ${data.message}`);
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    if (isSubmitting && !emailError && !passwordError) {
      attemptLogin();
    }
  }, [isSubmitting]);

  const onSubmit = () => {
    validateEmail();
    validatePassword();
    setIsSubmitting(true);
  };

  const onEmailChange = (e, { value }) => {
    if (isSubmitting) setIsSubmitting(false);
    if (loginError) setLoginError('');
    if (emailError) setEmailError('');
    setEmail(value);
  };

  const onPasswordChange = (e, { value }) => {
    if (isSubmitting) setIsSubmitting(false);
    if (loginError) setLoginError('');
    if (passwordError) setPasswordError('');
    setPassword(value);
  };

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" textAlign="center">
          Log-in to your account
        </Header>
        <Message
          hidden={!loginError}
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
                emailError
                  ? {
                      content: emailError,
                      pointing: 'above',
                    }
                  : null
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
                passwordError
                  ? {
                      content: passwordError,
                      pointing: 'above',
                    }
                  : null
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

LoginForm.propTypes = {
  setClient: PropTypes.func.isRequired,
};

export default LoginForm;
