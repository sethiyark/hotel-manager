import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { render } from 'react-dom';
import { map } from 'lodash';
import 'semantic-ui-css/semantic.min.css';

import routes from './routes';

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
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('app')
);
