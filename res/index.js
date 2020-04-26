import React from 'react';
import { render } from 'react-dom';

import RoomIcon from './components/RoomIcon';

class App extends React.Component {
  render() {
    return (
      <>
        <h1>React App</h1>
        <RoomIcon />
      </>
    );
  }
}

render(<App />, document.getElementById('app'));
