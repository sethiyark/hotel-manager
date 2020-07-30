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
  Message,
  Container,
} from 'semantic-ui-react';
import SignatureCanvas from 'react-signature-canvas';
import { useQuery, useMutation } from '@apollo/react-hooks';
import get from 'lodash/get';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import some from 'lodash/some';
import { DashboardModal } from '@uppy/react';
import ReactCrop from 'react-image-crop';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/webcam/dist/style.css';
import 'react-image-crop/dist/ReactCrop.css';

import { FETCH_ROOM, NEW_CHECK_IN, GET_ROOMS } from '../../api';
import {
  IMG_DATA_DIR_KEY,
  getFileWebViewLink,
  uploadFile,
} from '../../utils/drive';
import './styles/CheckIn.scss';
import createUppyInstance from './uppy';

const uppys = map(Array(3), createUppyInstance);
const BASE_CROP_CONFIG = {
  unit: '%',
  width: 30,
  aspect: 1,
};

const CheckIn = () => {
  const { ids } = useParams();
  if (!ids) return null;

  const id = ids.split(',');

  const today = moment();
  const { loading, data, error } = useQuery(FETCH_ROOM, {
    variables: { id },
  });
  const [newCheckInMutation] = useMutation(NEW_CHECK_IN, {
    refetchQueries: [{ query: GET_ROOMS }],
  });
  let signatureRef;
  const [canvasInit, setCanvasInit] = React.useState(false);
  const [canvasSize, updateCanvasSize] = React.useState({
    width: 100,
    height: 100,
  });
  const [checkInData, setCheckInData] = React.useState({
    roomIds: id,
    state: 'occupied',
    name: '',
    contact: '',
    imagesIdFront: [],
    imagesIdBack: [],
    imageProfile: '',
    address: '',
    time: '',
    inTime: today.toISOString(),
    nOccupants: 1,
    amount: 1500,
    toiletries: 0,
    advance: {
      mode: 'cash',
      amount: 0,
    },
    signature: null,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [openDashboardIndex, setOpenDashboardIndex] = React.useState(-1);
  const [uppyInstances] = React.useState(uppys);
  const [selectedImgIdFront, setSelectedImgIdFront] = React.useState([]);
  const [selectedImgIdBack, setSelectedImgIdBack] = React.useState([]);
  const [selectedImgProfile, setSelectedImgProfile] = React.useState('');
  const [imageToEdit, setImageToEdit] = React.useState('');
  const [crop, setCrop] = React.useState(BASE_CROP_CONFIG);
  const [imageBeingEdited, setImageBeingEdited] = React.useState(null);
  const [originalFile, setOriginalFile] = React.useState(null);

  const setCanvasSize = () => {
    const canvasWrapper = document.getElementById('canvas-wrapper');
    if (!canvasWrapper) return;
    updateCanvasSize({
      width: canvasWrapper.offsetWidth - 22,
      height: canvasWrapper.offsetHeight - 22,
    });
  };

  const currentState = React.useRef({
    openDashboardIndex,
    crop,
    imageBeingEdited,
    originalFile,
    selectedImgIdFront,
    selectedImgIdBack,
    selectedImgProfile,
  });

  React.useEffect(() => {
    currentState.current = {
      openDashboardIndex,
      crop,
      imageBeingEdited,
      originalFile,
      selectedImgIdFront,
      selectedImgIdBack,
      selectedImgProfile,
    };
  }, [
    openDashboardIndex,
    crop,
    imageBeingEdited,
    originalFile,
    selectedImgIdFront,
    selectedImgIdBack,
    selectedImgProfile,
  ]);

  const registerUppyListeners = () => {
    for (let i = 0; i < uppyInstances.length; i += 1) {
      const uppyInstance = uppyInstances[i];

      uppyInstance.setOptions({
        allowMultipleUploads: i !== 2,
        onBeforeFileAdded: (file: UppyFile) => {
          const imgUrl = URL.createObjectURL(file.data);
          setImageToEdit(imgUrl);
          setOriginalFile(file);
          return file.isEdited === true;
        },
      });

      uppyInstance.on('upload', (d) => {
        d.fileIDs.forEach((fileId) => {
          const f = uppyInstance.getFile(fileId);
          if (!f['uploaded']) {
            // eslint-disable-next-line no-console
            console.log('Uploading file : ', f);
            const fileToUpload = {
              name: f.name,
              mimeType: f.type,
              data: f.data,
            };
            uploadFile(fileToUpload, [window[IMG_DATA_DIR_KEY]]).then(
              (resp) => {
                if (resp && resp['id']) {
                  const webViewLink = getFileWebViewLink(resp['id']);
                  uppyInstance.setFileState(f.id, {
                    ...f,
                    preview: webViewLink,
                    uploaded: true,
                  });
                  uppyInstance.emit(
                    'upload-success',
                    f,
                    { uploadURL: webViewLink },
                    webViewLink
                  );
                  switch (i) {
                    case 0:
                      setSelectedImgIdFront(
                        currentState.current.selectedImgIdFront.concat(
                          webViewLink
                        )
                      );
                      break;
                    case 1:
                      setSelectedImgIdBack(
                        currentState.current.selectedImgIdBack.concat(
                          webViewLink
                        )
                      );
                      break;
                    case 2:
                      setSelectedImgProfile(webViewLink);
                      break;
                    default:
                  }
                } else {
                  uppyInstance.setFileState(f.id, {
                    error: 'No resp after upload',
                  });
                  uppyInstance.emit('upload-error', f, {
                    error: 'No resp after upload',
                  });
                }
              }
            );
          }
        });
      });
    }
  };

  React.useEffect(() => {
    window.addEventListener('resize', setCanvasSize);
    registerUppyListeners();
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      uppyInstances.forEach((i) => i.close());
    };
  }, [ids]);

  const onEditImageLoad = (img) => {
    setImageBeingEdited(img);
  };

  if (error) return null;
  if (loading) return <Loader active />;

  const rooms = get(data, 'room');
  if (isEmpty(rooms)) return null;
  if (some(rooms, 'checkIn')) {
    return (
      <Container>
        <Message error header="Check-in failure" content="Room not vacant" />
      </Container>
    );
  }

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
    setOpenDashboardIndex(-1);
  };

  const roomNos = map(rooms, 'displayName').join(', ');

  return (
    <>
      <Grid as={Segment} container centered relaxed className="checkin">
        <Grid.Row columns={3} className="header">
          <Grid.Column>
            <div className="identification">
              <Image
                src={
                  selectedImgIdFront.length > 0
                    ? selectedImgIdFront[selectedImgIdFront.length - 1]
                    : 'https://react.semantic-ui.com/images/wireframe/square-image.png'
                }
                circular
                size="tiny"
                onClick={() => onImageClick('img_id_front')}
                onLoad={() => {
                  setCheckInData({
                    ...checkInData,
                    imagesIdFront: selectedImgIdFront,
                  });
                }}
              />
              <Image
                src={
                  selectedImgIdBack.length > 0
                    ? selectedImgIdBack[selectedImgIdBack.length - 1]
                    : 'https://react.semantic-ui.com/images/wireframe/square-image.png'
                }
                circular
                size="tiny"
                onClick={() => onImageClick('img_id_back')}
                onLoad={() => {
                  setCheckInData({
                    ...checkInData,
                    imagesIdBack: selectedImgIdBack,
                  });
                }}
              />
            </div>
            <div className="customer-info">
              <Input
                label="Contact"
                size="mini"
                value={checkInData.contact}
                onChange={(e, { value: contact }) => {
                  setCheckInData({ ...checkInData, contact });
                }}
              />
              <Input
                label="Name"
                size="mini"
                value={checkInData.name}
                onChange={(e, { value: name }) => {
                  setCheckInData({ ...checkInData, name });
                }}
              />
              <div className="address">
                <Label>Address</Label>
                <TextArea
                  value={checkInData.address}
                  onChange={(e, { value }) => {
                    setCheckInData({
                      ...checkInData,
                      address: value.toString(),
                    });
                  }}
                />
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
              onLoad={() => {
                setCheckInData({
                  ...checkInData,
                  imageProfile: selectedImgProfile,
                });
              }}
            />
            <Label size="medium">
              Room no.
              <Label.Detail>{roomNos}</Label.Detail>
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
              value={checkInData.nOccupants}
              onChange={(e, { value }) => {
                setCheckInData({ ...checkInData, nOccupants: Number(value) });
              }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column className="details">
            <div className="payment">
              <Input
                label="Time"
                type="time"
                icon="pencil"
                size="large"
                value={checkInData.time}
                onChange={(e, { value: time }) => {
                  setCheckInData({ ...checkInData, time });
                }}
              />
              <Input
                label="Rate"
                icon="pencil"
                size="large"
                value={checkInData.amount}
                onChange={(e, { value }) => {
                  setCheckInData({ ...checkInData, amount: Number(value) });
                }}
              />
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
                    onChange={(e, { value }) => {
                      setCheckInData({
                        ...checkInData,
                        advance: {
                          mode: String(value),
                          amount: checkInData.advance.amount,
                        },
                      });
                    }}
                  />
                }
                label="Advance"
                value={checkInData.advance.amount}
                onChange={(e, { value }) => {
                  setCheckInData({
                    ...checkInData,
                    advance: {
                      mode: checkInData.advance.mode,
                      amount: Number(value),
                    },
                  });
                }}
              />
              <span>
                <div className="bill">
                  <Label pointing="right">Bill</Label>
                  <Radio toggle />
                </div>
                <Button
                  primary
                  loading={isSubmitting}
                  onClick={() => {
                    setIsSubmitting(true);
                    newCheckInMutation({ variables: checkInData })
                      .catch((err) => {
                        // eslint-disable-next-line no-console
                        console.log(err);
                      })
                      .finally(() => {
                        setIsSubmitting(false);
                      });
                  }}
                >
                  Submit
                </Button>
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
                setCheckInData({
                  ...checkInData,
                  signature: signatureRef.toDataURL(),
                });
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
          onRequestClose={handleModalClose}
          showLinkToFileUploadResult
          proudlyDisplayPoweredByUppy={false}
          hideUploadButton
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
            onChange={setCrop}
          />
        </Modal.Description>
        <Modal.Actions>
          <Button primary onClick={onCropImageClose}>
            Proceed
            <Icon name="angle right" />
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default withRouter(CheckIn);
