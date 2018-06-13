const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    required: true,
    type: String
  },
  password: {
    default: null,
    type: String
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: null
  },
  sallary: {
    type: String,
    default: null
  },
  addedBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    default: null
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', UserSchema);