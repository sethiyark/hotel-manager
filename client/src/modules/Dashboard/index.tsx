import * as React from 'react';
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
import RoomActions from './RoomActions';

import './styles/Dashboard.scss';

const Dashboard = () => {
  const { loading, data } = useQuery(GET_ROOMS);

  const [selectedRooms, setSelectedRooms] = React.useState([]);
  const [showBooking, setShowBooking] = React.useState(false);
  const [isOpenId, setIsOpenId] = React.useState('');

  if (loading) return <Loader active />;
  const rooms = get(data, 'rooms', []);
  const flatRooms = flatMap(rooms);

  const activeRooms = filter(flatRooms, ({ id }) => selectedRooms.includes(id));
  const activeState = get(activeRooms, '0.checkIn.state', '');

  const RenderRow = ({
    room,
    index,
  }: {
    room: Record<string, any>;
    index: number;
  }) => {
    const textAlign = index % 2 ? 'left' : 'right';
    const mirror = !!(index % 2);
    const { displayName, config, id, checkIn } = room;
    const state = get(checkIn, 'state', '');

    const openModal = useLongPress(() => {
      setIsOpenId(id);
    });

    const selectRoom = () => {
      if (selectedRooms.includes(id)) {
        setSelectedRooms(without(selectedRooms, id));
      } else if (['maintenance', 'cleaning'].includes(state)) {
        setSelectedRooms([id]);
      } else if (activeState === state) {
        setSelectedRooms([...selectedRooms, id]);
      } else setSelectedRooms([id]);
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
                state={state}
              />
            </Button>
          }
          open={isOpenId === id}
          onClose={() => setIsOpenId('')}
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
            <RoomActions
              activeRooms={activeRooms}
              activeState={activeState}
              showBooking={() => {
                setShowBooking(true);
              }}
              setIsOpenId={setIsOpenId}
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
