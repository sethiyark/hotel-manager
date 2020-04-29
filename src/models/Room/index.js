import { Schema, model } from 'mongoose';

const roomSchema = new Schema({
  display_name: String,

  config: {
    western: Boolean,
    air_conditioned: Boolean,
    priority_cleaned: Boolean, // user_id
  },
});

const Model = model('Room', roomSchema);

class Room extends Model {
  //
}

export default Room;

export { Room };
