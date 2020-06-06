import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import map from 'lodash/map';
import get from 'lodash/get';

const RoomActions = ({
  showBooking,
  setIsOpenId,
  activeRooms,
  activeState,
}: {
  showBooking(): void;
  setIsOpenId(id: string): void;
  activeRooms: any[];
  activeState: string;
}) => {
  const history = useHistory();
  const goToCheckIn = () => {
    const checkInUrl = `checkin/${map(activeRooms, 'id').join(',')}`;
    history.push(checkInUrl);
  };

  switch (activeState) {
    case 'maintenance':
    case 'cleaning':
      return (
        <>
          <Button
            icon="clipboard check"
            content="Housekeeping"
            size="big"
            color="green"
            onClick={() => setIsOpenId(get(activeRooms, '0.id', ''))}
          />
        </>
      );
    case 'occupied':
      return (
        <>
          <Button
            icon="clipboard check"
            content="Check-out"
            size="big"
            color="green"
            onClick={goToCheckIn}
          />
        </>
      );
    case 'booked':
      return (
        <>
          <Button
            icon="clipboard check"
            content="Check-in"
            size="big"
            color="green"
            onClick={goToCheckIn}
          />
        </>
      );
    default:
      return (
        <>
          <Button
            icon="clipboard list"
            content="Book"
            size="big"
            color="blue"
            onClick={showBooking}
          />
          <Button
            icon="clipboard check"
            content="Check-in"
            size="big"
            color="green"
            onClick={goToCheckIn}
          />
        </>
      );
  }
};

export default RoomActions;
