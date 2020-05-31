import { Schema, model } from 'mongoose';

const customerSchema = new Schema({
  name: String,
  address: String,
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
  contact: String,
});

const Model = model<ICustomer>('Customer', customerSchema);

class Customer extends Model {
  // static saveName(name) {
  //   this.create({ name });
  // }
}

export default Customer;

export { Customer };
