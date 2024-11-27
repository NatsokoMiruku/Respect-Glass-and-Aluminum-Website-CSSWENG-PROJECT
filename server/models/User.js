const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  shippingAddress: {
    street: { type: String, required: false, trim: true },
    city: { type: String, required: false, trim: true },
    province: { type: String, required: false, trim: true },
    zip: { type: String, required: false, trim: true },
    country: { type: String, required: false, trim: true },
  },
  shoppingCart: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', 
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  picture: {
    type: String,
    required: false,
    trim: true,
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: false
  }],
  isAdmin: {
    type: Boolean,
    required: true
  }
});
userSchema.index({ email: 1 }); 
const User = mongoose.model('User', userSchema);

module.exports = User;