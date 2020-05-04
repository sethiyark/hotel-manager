import { Schema, model } from 'mongoose';

const roomSchema = new Schema({
  displayName: String,

  config: {
    western: Boolean,
    airConditioned: Boolean,
    priorityCleaned: Boolean, // user_id
  },
});

const Model = model('Room', roomSchema);

class Room extends Model {
  //
}

export default Room;

export { Room };
