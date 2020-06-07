import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';
import map from 'lodash/map';
import get from 'lodash/get';
import moment from 'moment';

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

  const customerName = get(activeRooms, '0.checkIn.customer.name', '');
  const inTime = get(activeRooms, '0.checkIn.inTIme');
  const customerInfo = (
    <>
      <div>
        <strong>Name:&nbsp;</strong>
        {customerName}
      </div>
      <div>
        <strong>In-Time:&nbsp;</strong>
        {moment(inTime).format('DD/MM HH:MMa')}
      </div>
    </>
  );

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
        <Grid>
          <Grid.Column width={4}>
            <Button
              icon="sign-out"
              content="Check-out"
              size="big"
              color="red"
              onClick={goToCheckIn}
            />
          </Grid.Column>
          <Grid.Column width={12}>{customerInfo}</Grid.Column>
        </Grid>
      );
    case 'booked':
      return (
        <Grid>
          <Grid.Column width={4}>
            <Button
              icon="clipboard check"
              content="Check-in"
              size="big"
              color="green"
              onClick={goToCheckIn}
            />
          </Grid.Column>
          <Grid.Column width={12}>{customerInfo}</Grid.Column>
        </Grid>
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
