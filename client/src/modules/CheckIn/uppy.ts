import Uppy from '@uppy/core';
import WebCam from '@uppy/webcam';

function createUppyInstance() {
  const uppy = Uppy({
    meta: { type: 'avatar' },
    restrictions: {
      allowedFileTypes: ['image/*'],
    },
    autoProceed: true,
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

  uppy.on('upload-success', (file, response) => {
    // eslint-disable-next-line no-console
    console.log(`File ${file.name} uploaded with response: `, response);
  });

  return uppy;
}

export default createUppyInstance;
