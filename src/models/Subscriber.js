import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema(
  {
    email:     { type: String, required: true, unique: true, trim: true, lowercase: true },
    status:    { type: String, enum: ['active', 'unsubscribed'], default: 'active' },
    source:    { type: String, default: 'footer' },
    ipAddress: { type: String, default: '' },
  },
  { timestamps: true }
);

subscriberSchema.index({ email: 1 }, { unique: true });

const Subscriber = mongoose.model('Subscriber', subscriberSchema);
export default Subscriber;
