import { Schema, model } from 'mongoose';

const customerSchema = new Schema({
  name: String,

  age: String,

  address: String,

  checkinId: Schema.Types.ObjectId,

  idProofs: [
    {
      idType: String,
      scans: [
        {
          imgUrl: String,
        },
      ],
    },
  ],

  contact: {
    mobile: String,
    email: String,
  },
});

const Model = model<ICustomer>('Customer', customerSchema);

class Customer extends Model {
  // static saveName(name) {
  //   this.create({ name });
  // }
}

export default Customer;

export { Customer };
