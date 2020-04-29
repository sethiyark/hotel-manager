import { Schema, model } from 'mongoose';

const billSchema = new Schema({
  bill_log: Object,

  bill_paid: Object,
});

const Model = model('Checkin', billSchema);

class Bill extends Model {
  //
}

export default Bill;

export { Bill };
