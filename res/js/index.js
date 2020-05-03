import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { map } from 'lodash';
import 'semantic-ui-css/semantic.min.css';

import routes from './routes';

const client = new ApolloClient({
  uri: 'http://localhost:3001/api',
});

class App extends React.Component {
  getRoute = (route, key) => <Route key={key} {...route} />;

  render() {
    return (
      <main id="main">
        <Switch>{map(routes, this.getRoute)}</Switch>
      </main>
    );
  }
}

render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('app')
);
