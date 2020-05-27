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
  Modal,
  Icon,
} from 'semantic-ui-react';
import SignatureCanvas from 'react-signature-canvas';
import { useQuery } from '@apollo/react-hooks';
import get from 'lodash/get';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import { DashboardModal } from '@uppy/react';
import ReactCrop from 'react-image-crop';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import 'react-image-crop/dist/ReactCrop.css';

import { FETCH_ROOM } from '../../api';
import './styles/CheckIn.scss';
import createUppyInstance from './uppy';

const uppys = map(Array(3), createUppyInstance);
const BASE_CROP_CONFIG = {
  unit: '%',
  width: 30,
  aspect: 1,
};

const CheckIn = () => {
  const { id } = useParams();
  if (!id) return null;

  const { loading, data, error } = useQuery(FETCH_ROOM, {
    variables: { id },
  });
  const today = moment();
  let signatureRef;
  const [canvasInit, setCanvasInit] = React.useState(false);
  const [canvasSize, updateCanvasSize] = React.useState({
    width: 100,
    height: 100,
  });
  const [signature, setSignature] = React.useState();

  const [openDashboardIndex, setOpenDashboardIndex] = React.useState(-1);
  const [uppyInstances] = React.useState(uppys);
  const [selectedImgIdFront, setSelectedImgIdFront] = React.useState('');
  const [selectedImgIdBack, setSelectedImgIdBack] = React.useState('');
  const [selectedImgProfile, setSelectedImgProfile] = React.useState('');
  const [imageToEdit, setImageToEdit] = React.useState('');
  const [crop, setCrop] = React.useState(BASE_CROP_CONFIG);
  const [imageBeingEdited, setImageBeingEdited] = React.useState(null);
  const [originalFile, setOriginalFile] = React.useState(null);

  const setCanvasSize = () => {
    const canvasWrapper = document.getElementById('canvas-wrapper');
    updateCanvasSize({
      width: canvasWrapper.offsetWidth - 22,
      height: canvasWrapper.offsetHeight - 22,
    });
  };

  const currentState = React.useRef({
    signature,
    openDashboardIndex,
    crop,
    imageBeingEdited,
    originalFile,
  });

  React.useEffect(() => {
    currentState.current = {
      signature,
      openDashboardIndex,
      crop,
      imageBeingEdited,
      originalFile,
    };
  }, [signature, openDashboardIndex, crop, imageBeingEdited, originalFile]);

  const registerUppyListeners = () => {
    forEach(uppyInstances, (i) => {
      i.setOptions({
        onBeforeFileAdded: (file) => {
          const imgUrl = URL.createObjectURL(file.data);
          setImageToEdit(imgUrl);
          setOriginalFile(file);
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          return file.isEdited;
        },
      });
    });
  };

  React.useEffect(() => {
    window.addEventListener('resize', setCanvasSize);
    registerUppyListeners();
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      uppyInstances.forEach((i) => i.close());
    };
  }, [id]);

  const onEditImageLoad = (img) => {
    setImageBeingEdited(img);
  };

  if (error) return null;
  if (loading) return <Loader active />;

  const room = get(data, 'room');
  if (!room) return null;

  if (!canvasInit) {
    setTimeout(setCanvasSize, 0);
    setCanvasInit(true);
  }

  const onImageClick = (_id) => {
    switch (_id) {
      case 'img_id_front':
        setOpenDashboardIndex(0);
        break;
      case 'img_id_back':
        setOpenDashboardIndex(1);
        break;
      case 'img_profile':
        setOpenDashboardIndex(2);
        break;
      default:
        setOpenDashboardIndex(-1);
        // eslint-disable-next-line no-console
        console.error(`Image onClick handler not defined for id: ${_id}`);
    }
  };

  function getCroppedImg(image, fileType, _crop) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = _crop.width;
    canvas.height = _crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      _crop.x * scaleX,
      _crop.y * scaleY,
      _crop.width * scaleX,
      _crop.height * scaleY,
      0,
      0,
      _crop.width,
      _crop.height
    );

    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        fileType,
        1
      );
    });
  }

  const onCropImageClose = async () => {
    const editedImage = await getCroppedImg(
      currentState.current.imageBeingEdited,
      currentState.current.originalFile.type,
      currentState.current.crop
    );
    uppyInstances[currentState.current.openDashboardIndex].addFile({
      ...currentState.current.originalFile,
      data: editedImage,
      isEdited: true,
    });

    // Reset editor
    setImageToEdit('');
    setImageBeingEdited(null);
    setOriginalFile(null);
    setCrop(BASE_CROP_CONFIG);
  };

  const handleModalClose = () => {
    const selectedImage = uppyInstances[
      currentState.current.openDashboardIndex
    ].getFiles()[0];

    if (selectedImage) {
      switch (currentState.current.openDashboardIndex) {
        case 0:
          setSelectedImgIdFront(selectedImage.preview);
          break;
        case 1:
          setSelectedImgIdBack(selectedImage.preview);
          break;
        case 2:
          setSelectedImgProfile(selectedImage.preview);
          break;
        default: // Might be evaluated for -1 as well. Ignore
      }
    }
    setOpenDashboardIndex(-1);
  };

  return (
    <>
      <Grid as={Segment} container centered relaxed className="checkin">
        <Grid.Row columns={3} className="header">
          <Grid.Column>
            <div className="identification">
              <Image
                src={
                  selectedImgIdFront ||
                  'https://react.semantic-ui.com/images/wireframe/square-image.png'
                }
                circular
                size="tiny"
                onClick={() => onImageClick('img_id_front')}
              />
              <Image
                src={
                  selectedImgIdBack ||
                  'https://react.semantic-ui.com/images/wireframe/square-image.png'
                }
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
              src={
                selectedImgProfile ||
                'https://react.semantic-ui.com/images/wireframe/square-image.png'
              }
              label={{
                icon: 'camera',
                corner: 'right',
                circular: true,
                size: 'massive',
              }}
              circular
              size="small"
              onClick={() => onImageClick('img_profile')}
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
          open={index === openDashboardIndex}
          animateOpenClose
          onRequestClose={() => handleModalClose()}
          showLinkToFileUploadResult
          proudlyDisplayPoweredByUppy={false}
        />
      ))}
      <Modal
        size="small"
        open={imageToEdit !== ''}
        dimmer="blurring"
        closeOnDimmerClick={false}
      >
        <Modal.Header>Crop before save</Modal.Header>
        <Modal.Description>
          <ReactCrop
            src={imageToEdit}
            onImageLoaded={onEditImageLoad}
            crop={crop}
            onChange={(c) => setCrop(c)}
          />
        </Modal.Description>
        <Modal.Actions>
          <Button primary onClick={() => onCropImageClose()}>
            Proceed
            <Icon name="angle right" />
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default withRouter(CheckIn);
