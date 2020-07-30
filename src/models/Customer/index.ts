import { Schema, model } from 'mongoose';

const customerSchema = new Schema({
  name: String,
  address: String,
  imageProfile: String,
  idProof: {
    idType: {
      type: String,
      enum: ['drivingLicense', 'adhaar', 'other'],
      default: 'other',
    },
    imagesIdFront: [String],
    imagesIdBack: [String],
  },
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
