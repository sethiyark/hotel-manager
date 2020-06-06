import { Schema, model } from 'mongoose';

const billSchema = new Schema({
  billLog: [Object],

  billPaid: [Object],
});

const Model = model<IBill>('Bill', billSchema);

class Bill extends Model {
  //
}

export default Bill;

export { Bill };
