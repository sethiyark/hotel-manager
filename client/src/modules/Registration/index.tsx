import _ from 'lodash';
import * as React from 'react';
import validator from 'validator';
import { Link } from 'react-router-dom';

import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
  Message,
} from 'semantic-ui-react';
import { useEffect } from 'react';

const REGISTRATION_API_URL = 'http://localhost:3001/api/v1/registration';

const LoginForm = () => {
  const [userName, setUserName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [registrationSuccess, setRegistrationSuccess] = React.useState(false);

  const [userNameError, setUserNameError] = React.useState(null);
  const [emailError, setEmailError] = React.useState(null);
  const [passwordError, setPasswordError] = React.useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = React.useState(null);
  const [registrationError, setRegistrationError] = React.useState(null);

  const validateUserName = () => {
    if (!userName) setUserNameError('Required');
  };

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

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError('Required');
    } else if (!_.isEqual(password, confirmPassword)) {
      setConfirmPasswordError("Passwords don't match");
    }
  };

  useEffect(() => {
    if (
      isSubmitting &&
      _.isEmpty(userNameError) &&
      _.isEmpty(emailError) &&
      _.isEmpty(passwordError) &&
      _.isEmpty(confirmPasswordError)
    ) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          email,
          password,
        }),
      };

      fetch(REGISTRATION_API_URL, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (_.isEqual(data.status, 'success')) {
            setRegistrationSuccess(true);
            setTimeout(() => setRegistrationSuccess(false), 5000);
          } else {
            setRegistrationError(`Server response: ${data.message}`);
            setTimeout(() => setRegistrationError(null), 5000);
          }
        })
        .then(() => {
          setIsSubmitting(false);
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setUserName('');
        });
    }
  }, [
    userNameError,
    emailError,
    passwordError,
    confirmPasswordError,
    userName,
    email,
    password,
    isSubmitting,
  ]);

  const onSubmit = () => {
    validateUserName();
    validateEmail();
    validatePassword();
    validateConfirmPassword();
    setIsSubmitting(true);
  };

  const onUserNameChange = (e, { value }) => {
    if (userNameError) setUserNameError(null);
    if (isSubmitting) setIsSubmitting(false);
    setUserName(value);
  };

  const onEmailChange = (e, { value }) => {
    if (emailError) setEmailError(null);
    if (isSubmitting) setIsSubmitting(false);
    setEmail(value);
  };

  const onPasswordChange = (e, { value }) => {
    if (passwordError) setPasswordError(null);
    if (isSubmitting) setIsSubmitting(false);
    setPassword(value);
  };

  const onConfirmPasswordChange = (e, { value }) => {
    if (_.isEqual(password, value)) setConfirmPasswordError(null);
    else setConfirmPasswordError("Passwords don't match");
    if (isSubmitting) setIsSubmitting(false);
    setConfirmPassword(value);
  };

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" textAlign="center">
          New User Registration
        </Header>
        <Message
          hidden={!registrationSuccess}
          success
          header="Your user registration was successful"
          content="You may now log-in with the username you have chosen"
        />
        <Message
          hidden={_.isEmpty(registrationError)}
          error
          header="Your user registration failed"
          content={registrationError}
        />
        <Form size="large" onSubmit={onSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="User name"
              onChange={onUserNameChange}
              value={userName}
              error={
                userNameError && {
                  content: userNameError,
                  pointing: 'above',
                }
              }
            />
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
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Confirm password"
              type="password"
              onChange={onConfirmPasswordChange}
              value={confirmPassword}
              error={
                confirmPasswordError && {
                  content: confirmPasswordError,
                  pointing: 'above',
                }
              }
            />

            <Button fluid size="large" primary basic loading={isSubmitting}>
              Register
            </Button>
          </Segment>
        </Form>
        <Segment>
          Already registered?
          <Link to="/login"> Log in </Link>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
