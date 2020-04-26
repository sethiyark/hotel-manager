import mongoose from 'mongoose';

const customerSchema = mongoose.Schema({
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

module.exports = mongoose.model('Customer', customerSchema);
