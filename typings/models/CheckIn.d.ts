import { Document } from 'mongoose';

declare global {
  interface ICheckIn extends Document {
    customerId: string;
    inTime: string;
    outTime: string;
    nOccupants: number;
    roomIds: [string];
    billId: string;
    state: 'occupied' | 'maintenance' | 'cleaning' | 'booked';
    getCustomer(): Promise<ICustomer>;
    getBill(): Promise<IBill>;
  }
}
