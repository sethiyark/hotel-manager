// eslint-disable-next-line no-unused-vars
import Uppy from '@uppy/core';

declare global {
  interface UppyFile extends Uppy.UppyFile<{}, {}> {
    isEdited: boolean;
  }
}
