import mongoose from 'mongoose';

const billSchema = mongoose.Schema({
  bill_log: Object,

  bill_paid: Object,
});

module.exports = mongoose.model('Checkin', billSchema);
