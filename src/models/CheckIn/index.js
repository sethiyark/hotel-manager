import { Schema, model } from 'mongoose';

const checkInSchema = Schema({
  customer_id: Number,

  in_time: String,

  out_time: String,

  n_occupants: Number,

  room_ids: [{ type: Number }],

  bill_id: Number,

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
