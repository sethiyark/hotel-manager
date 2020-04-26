import { Schema, model } from 'mongoose';

const customerSchema = Schema({
  name: String,

  age: String,

  address: String,

  checkin_id: Number,

  id_proofs: [
    {
      id_type: String,
      scans: [
        {
          img_url: String,
        },
      ],
    },
  ],

  contact: {
    mobile: String,
    email: String,
  },
});

const Model = model('Customer', customerSchema);

class Customer extends Model {
  // static saveName(name) {
  //   this.create({ name });
  // }
}

export default Customer;

export { Customer };
