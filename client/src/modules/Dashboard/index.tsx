import * as React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  Loader,
  Button,
  Modal,
  Icon,
  TransitionablePortal,
  Segment,
  Container,
} from 'semantic-ui-react';
import { useQuery } from '@apollo/react-hooks';
import map from 'lodash/map';
import get from 'lodash/get';
import without from 'lodash/without';
import flatMap from 'lodash/flatMap';
import filter from 'lodash/filter';

import { RoomIcon } from '../../components';
import { GET_ROOMS } from '../../api';
import Room from './Room';
import useLongPress from '../../utils/longPress';
import BookingModal from './BookingModal';

import './styles/Dashboard.scss';

const Dashboard = () => {
  const history = useHistory();
  const { loading, data } = useQuery(GET_ROOMS);

  const [selectedRooms, setSelectedRooms] = React.useState([]);
  const [showBooking, setShowBooking] = React.useState(false);

  if (loading) return <Loader active />;
  const rooms = get(data, 'rooms', []);
  const flatRooms = flatMap(rooms);

  const activeRooms = filter(flatRooms, ({ id }) => selectedRooms.includes(id));

  const RenderRow = ({
    room,
    index,
  }: {
    room: Record<string, any>;
    index: number;
  }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const textAlign = index % 2 ? 'left' : 'right';
    const mirror = !!(index % 2);
    const { displayName, config, id } = room;

    const openModal = useLongPress(() => {
      setIsOpen(true);
    });

    const selectRoom = () => {
      if (selectedRooms.includes(id)) {
        setSelectedRooms(without(selectedRooms, id));
      } else {
        setSelectedRooms([...selectedRooms, id]);
      }
    };

    return (
      <Grid.Column textAlign={textAlign}>
        <Modal
          trigger={
            <Button
              active={selectedRooms.includes(id)}
              className="room-item"
              {...openModal}
              onClick={selectRoom}
            >
              <RoomIcon
                size={60}
                config={config}
                roomNo={displayName}
                mirror={mirror}
              />
            </Button>
          }
          open={isOpen}
          onClose={() => setIsOpen(false)}
          basic
          centered={false}
        >
          <Modal.Header className="room-header">
            <Icon name="bed" />
            Room:&nbsp;
            {displayName}
          </Modal.Header>
          <Modal.Content>
            <Room room={room} mirror={mirror} />
          </Modal.Content>
        </Modal>
      </Grid.Column>
    );
  };

  const renderCol = (rows: any[], index) => (
    <Grid.Column key={index}>
      <Grid container centered relaxed columns={2}>
        {map(rows, (room, idx) => (
          <RenderRow key={room.id} room={room} index={idx} />
        ))}
      </Grid>
    </Grid.Column>
  );

  const clearRoomSelection = () => {
    if (!showBooking) setSelectedRooms([]);
  };

  return (
    <>
      <Grid
        container
        centered
        relaxed
        doubling
        columns={3}
        className="dashboard"
      >
        {map(rooms, renderCol)}
      </Grid>
      <TransitionablePortal
        open={!!selectedRooms.length}
        transition={{ animation: 'fly up' }}
        onClose={clearRoomSelection}
      >
        <Segment>
          <Container>
            <Button
              floated="right"
              icon="close"
              basic
              onClick={clearRoomSelection}
            />
            <Button
              icon="clipboard list"
              content="Book"
              size="big"
              color="blue"
              onClick={() => {
                setShowBooking(true);
              }}
            />
            <Button
              icon="clipboard check"
              content="Check-in"
              size="big"
              color="green"
              onClick={() => {
                history.push(`checkin/${selectedRooms.join(',')}`);
              }}
            />
          </Container>
        </Segment>
      </TransitionablePortal>
      <BookingModal
        key={selectedRooms.join()}
        open={showBooking}
        onClose={() => {
          setShowBooking(false);
          setSelectedRooms([]);
        }}
        activeRooms={activeRooms}
      />
    </>
  );
};

export default Dashboard;
