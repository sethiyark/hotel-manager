import { Schema, model } from 'mongoose';

const checkInSchema = new Schema({
  customerId: Number,

  inTime: String,

  outTime: String,

  nOccupants: Number,

  roomIds: [{ type: Number }],

  billId: Number,

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
