import * as React from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { Segment, Grid, Image, Table } from 'semantic-ui-react';

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
  const { id } = useParams();
  if (!id) return null;
  const profile = '';

  return (
    <Grid as={Segment} container centered relaxed celled className="bill">
      <Grid.Row>
        <Grid.Column className="bill__title">
          <span>back</span>
          <span>Name</span>
          <span>
            <Image
              src={
                profile ||
                'https://react.semantic-ui.com/images/wireframe/square-image.png'
              }
              circular
              size="mini"
            />
          </span>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={3}>
        <Field label="Toiletries" value="1" />
        <Field label="Room no" value="1" />
        <Field label="Rate" value="1" />
      </Grid.Row>
      <Grid.Row columns={4}>
        <Field label="Check-in Date" value="1" />
        <Field label="Time" value="1" />
        <Field label="No. of Person" value="1" />
        <Field label="Bill no." value="1" />
      </Grid.Row>
      <Grid.Row columns={4}>
        <Field label="Check-out Date" value="1" />
        <Field label="Time" value="1" />
        <Field label="Total Days" value="1" />
        <Field label="Bill Date" value="1" />
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
