import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  pincode: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  line1: { type: String, required: true },
  line2: { type: String },
  landmark: { type: String },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    addresses: [addressSchema],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
