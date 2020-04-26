import mongoose from 'mongoose';

const roomSchema = mongoose.Schema({
  display_name: String,

  config: {
    western: Boolean,
    air_conditioned: Boolean,
    priority_cleaned: Boolean, // user_id
  },
});

module.exports = mongoose.model('Room', roomSchema);
