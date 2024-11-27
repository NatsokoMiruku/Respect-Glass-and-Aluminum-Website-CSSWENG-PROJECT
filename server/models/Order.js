const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    }
}],
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  qty: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shippingAddress: {
    street: { type: String, required: false, trim: true },
    city: { type: String, required: false, trim: true },
    province: { type: String, required: false, trim: true },
    zip: { type: String, required: false, trim: true },
    country: { type: String, required: false, trim: true },
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In transit', 'Delivered'],
    default: 'Pending'
  }
});

const Orders = mongoose.model('Order', orderSchema);

module.exports = Orders;