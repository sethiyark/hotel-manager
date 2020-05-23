import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import * as ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import _, { map } from 'lodash';
import Cookies from 'universal-cookie';
import { Loader } from 'semantic-ui-react';

import getRouteConfig from './routes';
import history from './utils/history';
import 'semantic-ui-css/semantic.min.css';

let token;
try {
  // eslint-disable-next-line global-require, import/no-unresolved, @typescript-eslint/no-var-requires
  const tokenObj = require('../token.json');
  token = tokenObj.token;
} catch {
  //
}

const { Router, Switch, Route } = ReactRouter;

const cookies = new Cookies();

const REFRESH_TOKEN_API_URL = 'http://localhost:3001/api/v1/refresh_token';

class App extends React.Component<
  {},
  { client: ApolloClient<unknown>; loading: boolean }
> {
  constructor(props) {
    super(props);
    this.state = {
      client: new ApolloClient({
        uri: 'http://localhost:3001/api',
        request: (operation) => {
          operation.setContext({
            headers: {
              authorization: `Bearer ${token}`,
            },
          });
        },
      }),
      loading: !token,
    };
  }

  componentDidMount() {
    this.refreshAccessToken();
  }

  isLoginRoute = () => {
    return ['/login', '/registration'].includes(window.location.pathname);
  };

  redirectToLogin = () => {
    history.push('/login');
    this.setState({ loading: false });
  };

  getApolloClient = (accessToken) =>
    new ApolloClient({
      uri: 'http://localhost:3001/api',
      request: (operation) => {
        operation.setContext({
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });
      },
    });

  setClient = (accessToken) =>
    this.setState(
      {
        client: this.getApolloClient(accessToken),
      },
      () => this.setState({ loading: false })
    );

  getRoute = (route, key) => <Route key={key} {...route} />;

  refreshAccessToken = () => {
    const refreshToken = cookies.get('refreshToken');
    const userId = cookies.get('userId');
    const isLoginRoute = this.isLoginRoute();

    if (token) return;
    if (refreshToken && userId) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refreshToken,
          userId,
        }),
      };

      fetch(REFRESH_TOKEN_API_URL, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (_.has(data, 'accessToken')) {
            window['accessToken'] = data.accessToken;
            this.setClient(data.accessToken);
            if (isLoginRoute) {
              history.push('/');
            }
          } else if (!isLoginRoute) {
            this.redirectToLogin();
          } else {
            // Refresh request failed and we are on a login route
            this.setState({ loading: false });
          }
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err);
          this.redirectToLogin();
        });
    } else if (!isLoginRoute) {
      this.redirectToLogin();
    } else {
      this.setState({ loading: false });
    }
  };

  render() {
    const { client, loading } = this.state;
    if (loading) return <Loader active />;

    const routes = getRouteConfig({ setClient: this.setClient });
    return (
      <ApolloProvider client={client}>
        <main id="main">
          <Switch>{map(routes, this.getRoute)}</Switch>
        </main>
      </ApolloProvider>
    );
  }
}

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,

  document.getElementById('app')
);
