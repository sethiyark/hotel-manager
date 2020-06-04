import { Document } from 'mongoose';

declare global {
  interface IRoom extends Document {
    displayName: string;
    floor: number;
    config: {
      western: boolean;
      airConditioned: boolean;
      priorityCleaned: number;
    };
    getCheckInInfo(): Promise<ICheckIn>;
  }
}
