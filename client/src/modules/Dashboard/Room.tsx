import * as React from 'react';
import { Grid } from 'semantic-ui-react';

import { RoomIcon } from '../../components';

const Room = ({
  room,
  mirror,
  housekeeping,
}: {
  room: Record<string, any>;
  mirror: boolean;
  housekeeping: boolean;
}) => {
  const { displayName, config } = room;

  const roomInfo = () => {
    return <>Info</>;
  };

  const roomHousekeeping = () => {
    return <>Housekeeping</>;
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
        {housekeeping ? roomHousekeeping() : roomInfo()}
      </Grid.Column>
    </Grid>
  );
};

export default Room;
