import { Schema, model } from 'mongoose';

const billSchema = new Schema({
  billLog: Object,

  billPaid: Object,
});

const Model = model('Checkin', billSchema);

class Bill extends Model {
  //
}

export default Bill;

export { Bill };
