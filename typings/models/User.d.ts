import { Document } from 'mongoose';

declare global {
  interface IUser extends Document {
    name: string;

    email: string;

    password: string;

    tokens: {
      token: string;
    }[];

    role: string;

    generateAuthToken(): any;

    generateRefreshToken(): any;
  }
}
