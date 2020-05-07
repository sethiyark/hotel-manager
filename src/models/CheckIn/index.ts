import { Schema, model } from 'mongoose';

const checkInSchema = new Schema({
  customerId: Schema.Types.ObjectId,

  inTime: String,

  outTime: String,

  nOccupants: Number,

  roomIds: [{ type: Number }],

  billId: Schema.Types.ObjectId,

  state: String, // [occupied/maintenance/cleaning/booked]

  instructions: [
    {
      type: String,
      uri: String,
      from: Number, // user_id
    },
  ],
});

const Model = model('CheckIn', checkInSchema);

class CheckIn extends Model {
  //
}

export default CheckIn;

export { CheckIn };
