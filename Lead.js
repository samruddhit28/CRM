const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: String,
  phone: String,
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Closed', 'Lost'], // ← added 'Closed'
    default: 'New',
  },
  nextFollowUp: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
