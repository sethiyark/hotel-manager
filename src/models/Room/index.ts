import { Schema, model } from 'mongoose';

import { CheckIn } from '../CheckIn';

const roomSchema = new Schema({
  displayName: String,
  floor: Number,
  config: {
    type: {
      western: Boolean,
      airConditioned: Boolean,
      priorityCleaned: Number,
    },
    default: {
      western: false,
      airConditioned: false,
      priorityCleaned: -1,
    },
  },
  instructions: [
    {
      type: String,
      uri: String,
      from: Schema.Types.ObjectId, // user_id
    },
  ],
});

const Model = model<IRoom>('Room', roomSchema);

class Room extends Model {
  getCheckIn = async () => {
    return CheckIn.findOne({ roomIds: this.id, outTime: null });
  };
}

export default Room;

export { Room };
