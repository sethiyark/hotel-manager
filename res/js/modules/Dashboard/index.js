import React, { PureComponent } from 'react';

import { RoomIcon } from '../../components';

const roomNo = '303';
const commonRoomConfig = {
  western: true,
  airConditioned: true,
  priorityCleaned: 'P2',
};

class Dashboard extends PureComponent {
  render() {
    return <RoomIcon config={commonRoomConfig} roomNo={roomNo} />;
  }
}

export default Dashboard;
