import * as React from 'react';

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

  return (
    <span>
      <RoomIcon
        className="current-room"
        size={250}
        config={config}
        roomNo={displayName}
        mirror={mirror}
      />
    </span>
  );
};

export default Room;
