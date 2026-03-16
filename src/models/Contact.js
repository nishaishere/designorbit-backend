import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true, maxlength: 100 },
    email:   { type: String, required: true, trim: true, lowercase: true },
    phone:   { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' },
    service: {
      type: String,
      required: true,
      enum: ['Web Development', 'Branding', 'Software / AI', '3D Animation', 'Other'],
    },
    budget: {
      type: String,
      enum: ['< $5K', '$5K–$15K', '$15K–$50K', '$50K+', ''],
      default: '',
    },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
    },
    ipAddress: { type: String, default: '' },
  },
  { timestamps: true }
);

// Index for faster queries
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
