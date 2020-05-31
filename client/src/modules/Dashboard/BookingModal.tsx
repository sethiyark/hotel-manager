import * as React from 'react';
import { Modal, Form, Button, Icon } from 'semantic-ui-react';
import map from 'lodash/map';

const BookingModal = ({
  open,
  onClose,
  activeRooms,
}: {
  open: boolean;
  onClose: () => void;
  activeRooms: any[];
}) => {
  const roomDisplayName = map(activeRooms, 'displayName').join(', ');

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
            <Form.Input label="Name" />
            <Form.Input label="No. of Person" type="number" />
          </Form.Group>
          <Form.Input label="Contact" />
          <Form.Group widths="equal">
            <Form.Input label="Date" type="date" />
            <Form.Input label="Time" type="time" />
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon="cancel"
          content="Cancel"
          negative
          basic
          onClick={onClose}
        />
        <Button icon="check" content="Book" positive />
      </Modal.Actions>
    </Modal>
  );
};

export default BookingModal;
