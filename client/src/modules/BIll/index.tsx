import * as React from 'react';
import { useParams, withRouter, useHistory } from 'react-router-dom';
import { Segment, Grid, Image, Table, Loader, Button } from 'semantic-ui-react';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import get from 'lodash/get';
import map from 'lodash/map';

import { FETCH_CHECKIN_BILL } from '../../api';
import './styles/Bill.scss';

const Field = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <Grid.Column className="bill__field">
      <strong>{label}: </strong>
      <span>{value}</span>
    </Grid.Column>
  );
};

const Bill = () => {
  const history = useHistory();
  const { id } = useParams();
  if (!id) return null;

  const { loading, data, error } = useQuery(FETCH_CHECKIN_BILL, {
    variables: { id },
  });

  const profile = '';
  if (error) return null;
  if (loading) return <Loader active />;

  const { checkIn } = data;
  const roomNos = map(get(checkIn, 'rooms'), 'displayName').join(', ');

  return (
    <Grid as={Segment} container centered relaxed celled className="bill">
      <Grid.Row>
        <Grid.Column className="bill__title">
          <span>
            <Button
              icon="arrow left"
              secondary
              content="Back"
              onClick={() => {
                history.push('dashboard');
              }}
            />
          </span>
          <span className="bill__title__name">
            {get(checkIn, 'customer.name')}
          </span>
          <span>
            <Image
              src={
                profile ||
                'https://react.semantic-ui.com/images/wireframe/square-image.png'
              }
              circular
              size="mini"
              className="bill__title__profile"
            />
          </span>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={3}>
        <Field label="Toiletries" value="-" />
        <Field label="Room no" value={roomNos} />
        <Field label="Rate" value="-" />
      </Grid.Row>
      <Grid.Row columns={4}>
        <Field
          label="Check-in Date"
          value={moment(checkIn.inTime).format('DD MMMM YYYY')}
        />
        <Field label="Time" value={moment(checkIn.inTime).format('HH:MMa')} />
        <Field label="No. of Person" value={checkIn.nOccupants || 1} />
        <Field label="Bill no." value="-" />
      </Grid.Row>
      <Grid.Row columns={4}>
        <Field label="Check-out Date" value="-" />
        <Field label="Time" value="-" />
        <Field label="Total Days" value="-" />
        <Field label="Bill Date" value="-" />
      </Grid.Row>
      <Grid.Row columns={1}>
        <Grid.Column>
          <Table celled padded>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Room Rent</Table.HeaderCell>
                <Table.HeaderCell>Restaurant</Table.HeaderCell>
                <Table.HeaderCell>Laundry</Table.HeaderCell>
                <Table.HeaderCell>Other</Table.HeaderCell>
                <Table.HeaderCell>GST</Table.HeaderCell>
                <Table.HeaderCell>Excess Bill</Table.HeaderCell>
                <Table.HeaderCell>Advance</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>-</Table.Cell>
                <Table.Cell>-</Table.Cell>
                <Table.Cell>-</Table.Cell>
                <Table.Cell>-</Table.Cell>
                <Table.Cell>-</Table.Cell>
                <Table.Cell>-</Table.Cell>
                <Table.Cell>-</Table.Cell>
                <Table.Cell>-</Table.Cell>
                <Table.Cell>-</Table.Cell>
              </Table.Row>
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell>Total</Table.HeaderCell>
                <Table.HeaderCell>-</Table.HeaderCell>
                <Table.HeaderCell>-</Table.HeaderCell>
                <Table.HeaderCell>-</Table.HeaderCell>
                <Table.HeaderCell>-</Table.HeaderCell>
                <Table.HeaderCell>-</Table.HeaderCell>
                <Table.HeaderCell>-</Table.HeaderCell>
                <Table.HeaderCell>-</Table.HeaderCell>
                <Table.HeaderCell>-</Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column>Increase Stay</Grid.Column>
        <Grid.Column>
          <span>Proceed</span>
          <span>Checkout</span>
          <span>Print</span>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default withRouter(Bill);
