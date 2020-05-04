import { Document } from 'mongoose';

export interface User extends Document {
  name: string;

  email: string;

  password: string;

  tokens: {
    token: string;
  }[];

  role: string;
}
