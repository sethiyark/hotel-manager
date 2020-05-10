import * as React from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import { map, get } from 'lodash';
import { useQuery } from '@apollo/react-hooks';

import { RoomIcon } from '../../components';
import { GET_ROOMS } from '../../api';

import './styles/Dashboard.scss';

const Dashboard = () => {
  const { loading, data } = useQuery(GET_ROOMS);

  if (loading) return <Loader active />;
  const rooms = get(data, 'rooms', []);

  const renderRow = (room, index) => {
    const textAlign = index % 2 ? 'left' : 'right';
    const { displayName, config } = room;
    return (
      <Grid.Column key={index} textAlign={textAlign}>
        <RoomIcon
          className="room-item"
          size={60}
          config={config}
          roomNo={displayName}
          mirror={!!(index % 2)}
        />
      </Grid.Column>
    );
  };

  const renderCol = (rows, index) => (
    <Grid.Column key={index}>
      <Grid container centered relaxed columns={2}>
        {map(rows, renderRow)}
      </Grid>
    </Grid.Column>
  );

  return (
    <Grid container centered relaxed doubling columns={3} className="dashboard">
      {map(rooms, renderCol)}
    </Grid>
  );
};

export default Dashboard;
