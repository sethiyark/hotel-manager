import { Schema, model } from 'mongoose';

const checkInSchema = new Schema({
  customerId: Schema.Types.ObjectId,
  inTime: String,
  outTime: String,
  nOccupants: Number,
  roomIds: [{ type: Schema.Types.ObjectId }],
  billId: Schema.Types.ObjectId,
  state: String, // [occupied/maintenance/cleaning/booked]
});

const Model = model('CheckIn', checkInSchema);

class CheckIn extends Model {
  //
}

export default CheckIn;

export { CheckIn };
