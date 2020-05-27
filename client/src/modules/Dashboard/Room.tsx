import * as React from 'react';
import { Grid } from 'semantic-ui-react';

import { RoomIcon } from '../../components';

const Room = ({
  room,
  mirror,
}: {
  room: Record<string, any>;
  mirror: boolean;
}) => {
  const { displayName, config } = room;

  const roomInfo = () => {
    return <>Info</>;
  };

  return (
    <Grid centered relaxed columns={2}>
      <Grid.Column width={9}>
        <RoomIcon
          className="current-room"
          size={250}
          config={config}
          roomNo={displayName}
          mirror={mirror}
        />
      </Grid.Column>
      <Grid.Column stretched width={7} className="room-actions">
        {roomInfo()}
      </Grid.Column>
    </Grid>
  );
};

export default Room;
