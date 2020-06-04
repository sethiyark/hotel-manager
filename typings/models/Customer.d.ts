import { Document } from 'mongoose';

declare global {
  interface ICustomer extends Document {
    name: string;
    address: string;
    idProofs: [
      {
        idType: string;
        scans: [
          {
            imgUrl: string;
          }
        ];
      }
    ];
    contact: string;
  }
}
