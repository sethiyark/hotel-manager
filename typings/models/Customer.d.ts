import { Document } from 'mongoose';

declare global {
  interface ICustomer extends Document {
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
}
