import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    tag:       { type: String, required: true, trim: true },
    title:     { type: String, required: true, trim: true },
    desc:      { type: String, required: true, trim: true },
    img:       { type: String, required: true },
    year:      { type: String, required: true },
    category:  { type: String, trim: true, default: '' },
    liveUrl:   { type: String, trim: true, default: '' },
    order:     { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

projectSchema.index({ published: 1, order: 1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;
