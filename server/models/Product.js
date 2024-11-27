const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0, 
  },
  price: {
    type: Number,
    required: true,
    min: 0, 
  },
  type: {
    type: String,
    required: true,
    enum: ['Aluminum', 'Glass', 'Frame', 'Bolt'], 
  },
  picture: {
    type: String,
    required: true,
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;