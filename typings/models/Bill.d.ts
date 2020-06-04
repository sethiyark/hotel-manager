import { Document } from 'mongoose';

declare global {
  interface IBill extends Document {
    id: string;
    billLog: [{}];
    billPaid: [{}];
  }
}
