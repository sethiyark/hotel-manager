import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import * as ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { map } from 'lodash';
import 'semantic-ui-css/semantic.min.css';

import routes from './routes';

const { BrowserRouter, Switch, Route } = ReactRouter;

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

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('app')
);
