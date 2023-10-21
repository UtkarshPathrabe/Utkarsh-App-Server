import mongoose from 'mongoose';

const IPAddress = new mongoose.Schema({
  address: { type: String, required: true, unique: true, },
});

const IPAddressSchema = mongoose.models.IPAddress || mongoose.model('IPAddress', IPAddress);

export default IPAddressSchema;
