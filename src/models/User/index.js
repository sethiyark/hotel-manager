import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: String,
});

const Model = model('User', userSchema);

class User extends Model {
  //
}

export default User;

export { User };
