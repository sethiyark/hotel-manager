import Uppy from '@uppy/core';
import WebCam from '@uppy/webcam';
import XHRUpload from '@uppy/xhr-upload';

function createUppyInstance() {
  const uppy = Uppy({
    meta: { type: 'avatar' },
    restrictions: {
      allowedFileTypes: ['image/*'],
      maxNumberOfFiles: 1,
    },
    autoProceed: false,
    allowMultipleUploads: false,
  });

  uppy.use(WebCam, {
    id: 'webcam',
    title: 'Camera',
    modes: ['picture'],
    mirror: true,
    facingMode: 'user',
  });

  uppy.on('upload', (data) => {
    // eslint-disable-next-line no-console
    console.log(`Starting upload : ${data}`);
  });

  uppy.on('file-added', (file) => {
    // eslint-disable-next-line no-console
    console.log('Added file', file);
  });

  uppy.on('complete', (result) => {
    // eslint-disable-next-line no-console
    console.log('successful files:', result.successful);
    // eslint-disable-next-line no-console
    console.log('failed files:', result.failed);
  });

  uppy.use(XHRUpload, {
    endpoint: 'https://upload-endpoint.uppy.io/upload',
    formData: true,
    fieldName: 'files[]',
  });

  uppy.on('upload-success', (file, response) => {
    // eslint-disable-next-line no-console
    console.log(file);
    // eslint-disable-next-line no-console
    console.log(response);
  });

  return uppy;
}

export default createUppyInstance;
