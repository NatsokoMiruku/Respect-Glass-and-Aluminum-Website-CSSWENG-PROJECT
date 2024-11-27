const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true, 
  },
  description: {
    type: String,
    required: true, 
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const Quotation = mongoose.model('quotation', quotationSchema);

module.exports = Quotation;