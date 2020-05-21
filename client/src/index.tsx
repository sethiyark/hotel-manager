import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import * as ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import _, { map } from 'lodash';
import Cookies from 'universal-cookie';
import routes from './routes';
import history from './utils/history';
import 'semantic-ui-css/semantic.min.css';

window['accessToken'] = '';
window['userId'] = '';

const { Router, Switch, Route } = ReactRouter;

const cookies = new Cookies();

const REFRESH_TOKEN_API_URL = 'http://localhost:3001/api/v1/refresh_token';

function redirectToLogin() {
  history.push('/login');
}

class App extends React.Component<{}, { client }> {
  constructor(props) {
    super(props);
    this.state = {
      client: new ApolloClient({
        uri: 'http://localhost:3001/api',
      }),
    };
    this.refreshAccessToken();
  }

  getRoute = (route, key) => <Route key={key} {...route} />;

  refreshAccessToken = () => {
    const refreshToken = cookies.get('refreshToken');
    const userId = cookies.get('userId');

    let accessToken = '';

    if (!(refreshToken && window['userId'])) {
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
            accessToken = data.accessToken;
            const client = new ApolloClient({
              uri: 'http://localhost:3001/api',
              request: (operation) => {
                operation.setContext({
                  headers: {
                    authorization: `Bearer ${accessToken}`,
                  },
                });
              },
            });
            this.setState({ client });
          } else {
            redirectToLogin();
          }
        });
    }
  };

  render() {
    const { client } = this.state;
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
