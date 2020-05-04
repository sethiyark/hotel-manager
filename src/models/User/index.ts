import { Schema, model } from 'mongoose';
import config from 'config';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User as IUser } from '../../../typings/models/User';

const JWT_KEY = _.get(config, ['auth', 'jwtKey'], null);

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid Email address');
      }
      return true;
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  role: String,
});

userSchema.pre('save', async function (this: IUser, next) {
  // Hash the password before saving the user model
  if (this.isModified('password')) {
    log.verbose('Hashing password');
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const Model = model<IUser>('User', userSchema);

class User extends Model {
  static async findByCredentials(email, password) {
    // Search for a user by email and password.
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(`User with email '${email}' not found`);
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error('Invalid login credentials');
    }
    return user;
  }

  async generateAuthToken() {
    if (_.isEmpty(JWT_KEY)) {
      throw new Error('Invalid JWT key');
    }
    const token = jwt.sign({ _id: this._id }, JWT_KEY);
    this.tokens = this.tokens.concat({ token });
    try {
      await this.save();
    } catch (e) {
      throw new Error(`Error while generating JWT token: ${e.message}`);
    }
    return token;
  }
}

export default User;

export { User };
