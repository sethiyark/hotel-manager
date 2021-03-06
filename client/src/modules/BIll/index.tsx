import * as React from 'react';
import { useParams, withRouter, useHistory } from 'react-router-dom';
import { Segment, Grid, Image, Table, Loader, Button } from 'semantic-ui-react';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import get from 'lodash/get';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import forEach from 'lodash/forEach';
import pickBy from 'lodash/pickBy';

import { FETCH_CHECKIN_BILL } from '../../api';
import './styles/Bill.scss';

const GST = 5;

const Field = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <Grid.Column className="bill__field">
      <strong>{label}: </strong>
      <span>{value}</span>
    </Grid.Column>
  );
};

const BillRow = ({
  log,
}: {
  log: { type: string; createdAt: string; amount: number; gst: number };
}) => {
  const { type, amount, createdAt, gst } = log;
  const bill = { [type]: amount };
  const date = moment(createdAt);

  return (
    <Table.Row>
      <Table.Cell>{date.format('DD MMMM, HH:MM')}</Table.Cell>
      <Table.Cell>{get(bill, 'room', '-')}</Table.Cell>
      <Table.Cell>{get(bill, 'restaurant', '-')}</Table.Cell>
      <Table.Cell>{get(bill, 'laundry', '-')}</Table.Cell>
      <Table.Cell>{get(bill, 'other', '-')}</Table.Cell>
      <Table.Cell>{gst || '-'}</Table.Cell>
      <Table.Cell>-</Table.Cell>
      <Table.Cell>{get(bill, 'paid', '-')}</Table.Cell>
      <Table.Cell>{amount + gst}</Table.Cell>
    </Table.Row>
  );
};

const getBillLog = (bill) => {
  const billLog = map(get(bill, 'billLog', []), (log) => {
    const gst = (log.amount * GST) / 100;
    return { ...log, gst };
  });
  forEach(get(bill, 'billPaid'), (log) => {
    billLog.push({
      ...log,
      type: 'paid',
      gst: 0,
    });
  });
  return billLog;
};

const computeBillLog = (billLog) => {
  const totalBill = reduce(
    billLog,
    (total, log) => {
      const result = total;
      result[log.type] = (total[log.type] || 0) + (log.amount || 0);
      result.gst = total.gst + (log.gst || 0);
      return result;
    },
    { room: 0, restaurant: 0, laundry: 0, other: 0, paid: 0, gst: 0, total: 0 }
  );
  totalBill.total = reduce(
    totalBill,
    (result, amount, type) => {
      if (type === 'paid') return result - amount;
      return result + amount;
    },
    0
  );
  return pickBy(totalBill);
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

  const billLog = getBillLog(get(checkIn, 'bill', {}));
  const totalBill = computeBillLog(billLog);

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
                history.push('/dashboard');
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
              {map(billLog, (log, index) => (
                <BillRow log={log} key={index} />
              ))}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell>Total</Table.HeaderCell>
                <Table.HeaderCell>
                  {get(totalBill, 'room', '-')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {get(totalBill, 'restaurant', '-')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {get(totalBill, 'laundry', '-')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {get(totalBill, 'other', '-')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {get(totalBill, 'gst', '-')}
                </Table.HeaderCell>
                <Table.HeaderCell>-</Table.HeaderCell>
                <Table.HeaderCell>
                  {get(totalBill, 'paid', '-')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {get(totalBill, 'total', '-')}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column>
          <Button basic color="black">
            Increase Stay
          </Button>
        </Grid.Column>
        <Grid.Column>
          <Button basic color="violet">
            Proceed
          </Button>
          <Button basic color="violet">
            Checkout
          </Button>
          <Button basic color="violet">
            Print
          </Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default withRouter(Bill);
