import { Schema, model } from 'mongoose';

import { Customer } from '../Customer';
import { Bill } from '../Bill';

const checkInSchema = new Schema({
  customerId: Schema.Types.ObjectId,
  inTime: String,
  outTime: String,
  nOccupants: Number,
  roomIds: [{ type: Schema.Types.ObjectId }],
  billId: Schema.Types.ObjectId,
  state: String, // [occupied/maintenance/cleaning/booked]
});

const Model = model<ICheckIn>('CheckIn', checkInSchema);

class CheckIn extends Model {
  getCustomer = async () => {
    return Customer.findById(this.customerId);
  };

  getBill = async () => {
    return Bill.findById(this.billId);
  };
}

export default CheckIn;

export { CheckIn };
