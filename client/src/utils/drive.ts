const IMAGE_DIR_NAME = 'images';
const APP_DATA_DIR = 'HotelManager';
const GOOGLE_DIR_MIME_TYPE = 'application/vnd.google-apps.folder';
const APP_DATA_ROOT_DIR_KEY = 'appDataRootDir';
const IMG_DATA_DIR_KEY = 'imgDataDir';
const DRIVE_SIGNED_IN_KEY = 'isDriveSignedIn';

const CLIENT_ID =
  '619957848870-tl7oklvc20i7493lpro08e2crtie8ls5.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBTC8QIXqjEoOEDETFSqtMiTpjec2IHRyM';

const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
];

const SCOPES = 'https://www.googleapis.com/auth/drive';

const updateSigninStatus = (isSignedIn) => {
  window[DRIVE_SIGNED_IN_KEY] = isSignedIn;
  // eslint-disable-next-line no-console
  console.log(`Drive signed in: ${isSignedIn}`);
};

const driveSignIn = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return gapi.auth2.getAuthInstance().signIn();
};

const driveSignOut = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  gapi.auth2.getAuthInstance().signOut();
};

const searchFile = (fileName, mimeType, parents) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    gapi.client.drive.files
      .list({
        q: `mimeType='${mimeType}' and name='${fileName}' and trashed = false`,
        spaces: 'drive',
        fields: 'files(id)',
        parents,
      })
      .then((response) => {
        const { files } = response.result;
        if (files && files.length > 0) {
          resolve(files[0].id);
        }
        resolve(null);
      });
  });
};

const createFile = (fileName, mimeType, parents) => {
  return new Promise((resolve) => {
    const fileMetadata = {
      name: fileName,
      mimeType,
      parents,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    gapi.client.drive.files
      .create({
        resource: fileMetadata,
        fields: 'id',
      })
      .then((resp) => {
        if (resp.status === 200) {
          resolve(resp.result.id);
        } else {
          resolve(null);
        }
      });
  });
};

const createPublicViewPermission = (fileId) => {
  const permission = {
    type: 'anyone',
    role: 'reader',
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  gapi.client.drive.permissions
    .create({
      resource: permission,
      fileId,
      fields: 'id',
    })
    .then((resp) => {
      if (resp.status === 200) {
        // eslint-disable-next-line no-console
        console.log(`Public view pemission granted to file ${fileId}`);
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          'Unexpected response while creating public view permission: ',
          resp
        );
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error while creating public view permission: ', error);
    });
};

const createAppDataDirs = () => {
  searchFile(APP_DATA_DIR, GOOGLE_DIR_MIME_TYPE, null)
    .then((rootDirId) => {
      if (rootDirId) {
        window[APP_DATA_ROOT_DIR_KEY] = rootDirId;
        return rootDirId;
      }
      return createFile(APP_DATA_DIR, GOOGLE_DIR_MIME_TYPE, null).then(
        (newRootDirId) => {
          window[APP_DATA_ROOT_DIR_KEY] = newRootDirId;
          return newRootDirId;
        }
      );
    })
    .then((appDataDirId) => {
      createPublicViewPermission(appDataDirId);
      searchFile(IMAGE_DIR_NAME, GOOGLE_DIR_MIME_TYPE, [appDataDirId]).then(
        (imgDirId) => {
          if (imgDirId) {
            window[IMG_DATA_DIR_KEY] = imgDirId;
          } else {
            createFile(IMAGE_DIR_NAME, GOOGLE_DIR_MIME_TYPE, [
              appDataDirId,
            ]).then((newImgDirId) => {
              window[IMG_DATA_DIR_KEY] = newImgDirId;
            });
          }
        }
      );
    });
};

/**
 *  Initializes and loads the API client library and sets up sign-in state
 *  listeners.
 */
gapi.load('client:auth2', () => {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(
      () => {
        // Listen for sign-in state changes.
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.error(JSON.stringify(error, null, 2));
      }
    )
    .then(() => {
      if (!window['isDriveSignedIn'])
        driveSignIn().then(() => createAppDataDirs());
      else createAppDataDirs();
    });
});

const uploadFile = (file, parents) => {
  return new Promise((resolve, reject) => {
    const { name, mimeType, data } = file;

    const metadata = {
      name, // Filename at Google Drive
      mimeType, // mimeType at Google Drive
      parents, // Folder ID at Google Drive
    };

    const accessToken = gapi.auth.getToken().access_token;

    const form = new FormData();

    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );

    form.append('file', data);

    fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
      {
        method: 'POST',
        headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
        body: form,
      }
    )
      .then((res) => {
        resolve(res.json());
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(`Error while uploading ${name}: `, err);
      });
  });
};

const getFileWebViewLink = (fileId) => {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

export {
  IMG_DATA_DIR_KEY,
  driveSignIn,
  driveSignOut,
  createAppDataDirs,
  uploadFile,
  getFileWebViewLink,
};
