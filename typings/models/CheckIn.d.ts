import { Document } from 'mongoose';

declare global {
  interface ICheckIn extends Document {
    id: string;
    customerId: string;
    inTime: string;
    outTime: string;
    nOccupants: number;
    roomIds: [string];
    billId: string;
    state: 'occupied' | 'maintenance' | 'cleaning' | 'booked';
  }

  interface ECheckIn extends ICheckIn {
    customer: ICustomer;
    bill: IBill;
  }
}
