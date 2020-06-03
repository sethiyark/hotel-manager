import * as React from 'react';
import { Modal, Form, Button, Icon } from 'semantic-ui-react';
import map from 'lodash/map';
import moment from 'moment';
import { useMutation } from '@apollo/react-hooks';

import { NEW_CHECK_IN, GET_ROOMS } from '../../api';

const BookingModal = ({
  open,
  onClose,
  activeRooms,
}: {
  open: boolean;
  onClose: () => void;
  activeRooms: any[];
}) => {
  const [newCheckInMutation] = useMutation(NEW_CHECK_IN, {
    refetchQueries: [{ query: GET_ROOMS }],
  });
  const roomDisplayName = map(activeRooms, 'displayName').join(', ');
  const [bookingData, setBookingData] = React.useState({
    roomIds: map(activeRooms, 'id'),
    state: 'booked',
    name: '',
    contact: '',
    time: moment().toISOString(),
    nOccupants: 1,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header className="room-header">
        <Icon name="bed" />
        Room:&nbsp;
        {roomDisplayName}
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <Form.Input
              name="name"
              label="Name"
              value={bookingData.name}
              onChange={(e, { value: name }) => {
                setBookingData({ ...bookingData, name });
              }}
            />
            <Form.Input
              name="nOccupants"
              label="No. of Person"
              type="number"
              value={bookingData.nOccupants}
              onChange={(e, { value }) => {
                setBookingData({ ...bookingData, nOccupants: Number(value) });
              }}
            />
          </Form.Group>
          <Form.Input
            name="contact"
            label="Contact"
            value={bookingData.contact}
            onChange={(e, { value: contact }) => {
              setBookingData({ ...bookingData, contact });
            }}
          />
          <Form.Group widths="equal">
            <Form.Input
              name="date"
              label="Date"
              type="date"
              onChange={(e, { value }) => {
                const time = moment(bookingData.time).format('HH:MM');
                setBookingData({
                  ...bookingData,
                  time: moment(`${value} ${time}`).toISOString(),
                });
              }}
            />
            <Form.Input
              name="time"
              label="Time"
              type="time"
              onChange={(e, { value }) => {
                const date = moment(bookingData.time).format('YYYY-MM-DD');
                setBookingData({
                  ...bookingData,
                  time: moment(`${date} ${value}`).toISOString(),
                });
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon="cancel"
          content="Cancel"
          negative
          basic
          disabled={isSubmitting}
          onClick={onClose}
        />
        <Button
          icon="check"
          content="Book"
          positive
          disabled={isSubmitting}
          onClick={() => {
            setIsSubmitting(true);
            newCheckInMutation({ variables: bookingData })
              .then(() => {
                onClose();
              })
              .catch((err) => {
                console.log(err);
              })
              .finally(() => {
                setIsSubmitting(false);
              });
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default BookingModal;
