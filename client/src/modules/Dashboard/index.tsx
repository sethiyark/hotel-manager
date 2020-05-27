import * as React from 'react';
import { Grid, Loader, Button, Modal, Icon } from 'semantic-ui-react';
import { map, get } from 'lodash';
import { useQuery } from '@apollo/react-hooks';

import { RoomIcon } from '../../components';
import { GET_ROOMS } from '../../api';

import './styles/Dashboard.scss';
import Room from './Room';

const Dashboard = () => {
  const { loading, data } = useQuery(GET_ROOMS);

  const [housekeeping, setHousekeeping] = React.useState(false);
  const state = React.useRef({ housekeeping });

  React.useEffect(() => {
    state.current = { housekeeping };
  }, [housekeeping]);

  const toggleHousekeeping = () => {
    setHousekeeping(!state.current.housekeeping);
  };

  if (loading) return <Loader active />;
  const rooms = get(data, 'rooms', []);

  const renderRow = (room, index) => {
    const textAlign = index % 2 ? 'left' : 'right';
    const mirror = !!(index % 2);
    const { displayName, config } = room;
    return (
      <Grid.Column key={index} textAlign={textAlign}>
        <Modal
          trigger={
            <Button className="room-item">
              <RoomIcon
                size={60}
                config={config}
                roomNo={displayName}
                mirror={mirror}
              />
            </Button>
          }
          basic
          centered={false}
        >
          <Modal.Header>
            <Icon name="bed" />
            Room:&nbsp;
            {displayName}
            <Button
              floated="right"
              toggle
              active={housekeeping}
              onClick={toggleHousekeeping}
            >
              Housekeeping
            </Button>
          </Modal.Header>
          <Modal.Content>
            <Room room={room} mirror={mirror} housekeeping={housekeeping} />
          </Modal.Content>
        </Modal>
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
