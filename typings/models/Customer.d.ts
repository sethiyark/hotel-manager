import { Document } from 'mongoose';

export interface Customer extends Document {
  name: string;

  age: string;

  address: string;

  checkinId: number;

  idProofs: {
    idType: string;
    scans: {
      imgUrl: string;
    }[];
  }[];

  contact: {
    mobile: string;
    email: string;
  };
}
