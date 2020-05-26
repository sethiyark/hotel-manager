import * as React from 'react';
import { withRouter, useParams } from 'react-router-dom';
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
  Loader,
} from 'semantic-ui-react';
import SignatureCanvas from 'react-signature-canvas';
import { useQuery } from '@apollo/react-hooks';
import get from 'lodash/get';
import map from 'lodash/map';
import { DashboardModal } from '@uppy/react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import { FETCH_ROOM } from '../../api';
import './styles/CheckIn.scss';
import createUppyInstance from './uppy';

const uppys = () => map(Array(3), createUppyInstance);

const CheckIn = () => {
  const { id } = useParams();
  if (!id) return null;

  const { loading, data, error } = useQuery(FETCH_ROOM, {
    variables: { id },
  });
  const today = moment();
  let signatureRef;
  let canvasInit = false;
  const [canvasSize, updateCanvasSize] = React.useState({
    width: 100,
    height: 100,
  });
  const [signature, setSignature] = React.useState();

  const [isDashboardOpen, setIsDashboardOpen] = React.useState(-1);
  const [uppyInstances] = React.useState(uppys());

  const setCanvasSize = () => {
    const canvasWrapper = document.getElementById('canvas-wrapper');
    updateCanvasSize({
      width: canvasWrapper.offsetWidth - 22,
      height: canvasWrapper.offsetHeight - 22,
    });
  };

  const currentState = React.useRef({ signature, isDashboardOpen });

  React.useEffect(() => {
    currentState.current = { signature, isDashboardOpen };
  }, [signature, isDashboardOpen]);

  React.useEffect(() => {
    window.addEventListener('resize', setCanvasSize);
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      uppyInstances.forEach((i) => i.close());
    };
  }, [id]);

  if (error) return null;
  if (loading) return <Loader active />;

  const room = get(data, 'room');
  if (!room) return null;

  if (!canvasInit) {
    setTimeout(setCanvasSize, 0);
    canvasInit = true;
  }

  const onImageClick = (_id) => {
    switch (_id) {
      case 'img_id_front':
        setIsDashboardOpen(0);
        break;
      case 'img_id_back':
        setIsDashboardOpen(1);
        break;
      case 'img_face':
        setIsDashboardOpen(2);
        break;
      default:
        // eslint-disable-next-line no-console
        console.error(`Image onClick handler not defined for id: ${_id}`);
    }
  };

  const handleModalClose = () => {
    setIsDashboardOpen(-1);
  };

  return (
    <>
      <Grid as={Segment} container centered relaxed className="checkin">
        <Grid.Row columns={3} className="header">
          <Grid.Column>
            <div className="identification">
              <Image
                src="https://react.semantic-ui.com/images/wireframe/square-image.png"
                circular
                size="tiny"
                onClick={() => onImageClick('img_id_front')}
              />
              <Image
                src="https://react.semantic-ui.com/images/wireframe/square-image.png"
                circular
                size="tiny"
                onClick={() => onImageClick('img_id_back')}
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
              onClick={() => onImageClick('img_face')}
            />
            <Label size="medium">
              Room no.
              <Label.Detail>{room.displayName}</Label.Detail>
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
          <Grid.Column id="canvas-wrapper">
            <SignatureCanvas
              ref={(ref) => {
                signatureRef = ref;
              }}
              canvasProps={{
                width: canvasSize.width,
                height: canvasSize.height,
                className: 'sigCanvas',
              }}
              onEnd={() => {
                setSignature(signatureRef.toDataURL());
              }}
            />
            <Label attached="bottom right">Customer Signature</Label>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {map(uppyInstances, (uppy, index) => (
        <DashboardModal
          key={index}
          uppy={uppy}
          plugins={['webcam']}
          open={index === isDashboardOpen}
          animateOpenClose
          onRequestClose={() => handleModalClose()}
          showLinkToFileUploadResult
          proudlyDisplayPoweredByUppy={false}
          hideUploadButton
        />
      ))}
    </>
  );
};

export default withRouter(CheckIn);
