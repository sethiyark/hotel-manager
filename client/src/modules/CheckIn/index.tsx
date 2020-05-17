import * as React from 'react';
import moment from 'moment';
import {
  Image,
  Grid,
  Label,
  Input,
  TextArea,
  Segment,
  Dropdown,
  Radio,
  Button,
} from 'semantic-ui-react';

import './styles/CheckIn.scss';

const CheckIn = () => {
  const today = moment();

  return (
    <Grid as={Segment} container centered relaxed className="checkin">
      <Grid.Row columns={3} className="header">
        <Grid.Column>
          <div className="identification">
            <Image
              src="https://react.semantic-ui.com/images/wireframe/square-image.png"
              circular
              size="tiny"
            />
            <Image
              src="https://react.semantic-ui.com/images/wireframe/square-image.png"
              circular
              size="tiny"
            />
          </div>
          <div className="customer-info">
            <Input label="Contact" size="mini" />
            <Input label="Name" size="mini" />
            <div className="address">
              <Label>Address</Label>
              <TextArea />
            </div>
          </div>
        </Grid.Column>
        <Grid.Column textAlign="center" className="customer">
          <Image
            src="https://react.semantic-ui.com/images/wireframe/square-image.png"
            label={{
              icon: 'camera',
              corner: 'right',
              circular: true,
              size: 'massive',
            }}
            circular
            size="small"
          />
          <Label size="medium">
            Room no.
            <Label.Detail>101</Label.Detail>
          </Label>
        </Grid.Column>
        <Grid.Column className="time">
          <Label size="small">
            Date Check-in
            <Label.Detail>{today.format('DD/MM/YYYY')}</Label.Detail>
          </Label>
          <Label size="small">
            Time Check-in
            <Label.Detail>{today.format('HH:MM a')}</Label.Detail>
          </Label>
          <Input
            type="number"
            label="No. of Person"
            className="person-count"
            size="mini"
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column className="details">
          <div className="payment">
            <Input label="Time" icon="pencil" size="large" />
            <Input label="Rate" icon="pencil" size="large" />
            <Input
              label="Toiletries"
              type="number"
              icon="pencil"
              size="large"
            />
            <Input
              action={
                <Dropdown
                  button
                  basic
                  floating
                  options={[
                    { key: 'cash', text: 'Cash', value: 'cash' },
                    { key: 'online', text: 'Online', value: 'online' },
                  ]}
                  defaultValue="cash"
                />
              }
              label="Advance"
            />
            <span>
              <div className="bill">
                <Label pointing="right">Bill</Label>
                <Radio toggle />
              </div>
              <Button primary>Submit</Button>
            </span>
          </div>
        </Grid.Column>
        <Grid.Column>
          <Label attached="bottom right">Customer Signature</Label>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default CheckIn;
