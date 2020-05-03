import React, { PureComponent } from 'react';
import { Grid } from 'semantic-ui-react';
import { map } from 'lodash';

import { RoomIcon } from '../../components';

import './styles/Dashboard.scss';

const roomNo = '303';
const commonRoomConfig = {
  western: true,
  airConditioned: true,
  priorityCleaned: 'P2',
};

const config = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  [11, 12, 13, 14, 15, 16, 17, 18, 19, 10, 101, 102],
  [21, 22, 23, 24, 25, 26, 27, 28, 29, 20, 201, 202],
];

class Dashboard extends PureComponent {
  renderRow = (room, index) => {
    const className = index % 2 ? 'icon-right' : 'icon-left';
    return (
      <Grid.Column key={room}>
        <RoomIcon
          className={className}
          size={60}
          config={commonRoomConfig}
          roomNo={roomNo}
        />
      </Grid.Column>
    );
  };

  renderCol = (rows, index) => (
    <Grid.Column key={index}>
      <Grid container centered relaxed columns={2}>
        {map(rows, this.renderRow)}
      </Grid>
    </Grid.Column>
  );
  render() {
    return (
      <Grid
        container
        centered
        relaxed
        doubling
        columns={3}
        className="dashboard"
      >
        {map(config, this.renderCol)}
      </Grid>
    );
  }
}

export default Dashboard;
