/**
 * DesignOrbit — Database Seed Script
 * Run: node src/seed.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import Admin    from './models/Admin.js';
import Project  from './models/Project.js';
import connectDB from './config/db.js';

const seedAdmin = {
  name:     'DesignOrbit Admin',
  email:    process.env.ADMIN_EMAIL    || 'admin@designorbit.co',
  password: process.env.ADMIN_PASSWORD || 'Admin@123456',
  role:     'superadmin',
};

const seedProjects = [
  {
    tag:       'Visual Engineering',
    title:     'PROJECT AETHER',
    desc:      'Zero-latency WebGL rendering for immersive luxury commerce.',
    img:       'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80',
    year:      '2025',
    category:  'Web Development',
    order:     1,
    published: true,
  },
  {
    tag:       'System Architecture',
    title:     'PROJECT SENTINEL',
    desc:      'Trustless biometric authentication protocols with fluid UX.',
    img:       'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900&q=80',
    year:      '2024',
    category:  'Software / AI',
    order:     2,
    published: true,
  },
  {
    tag:       'Intelligent Interfaces',
    title:     'PROJECT CORTEX',
    desc:      'Adaptive dashboard logic designed to visualize complex AI outputs.',
    img:       'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80',
    year:      '2024',
    category:  'Software / AI',
    order:     3,
    published: true,
  },
  {
    tag:       'Identity Systems',
    title:     'PROJECT FLUX',
    desc:      'A molecular design system engineered for infinite digital scale.',
    img:       'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
    year:      '2025',
    category:  'Branding',
    order:     4,
    published: true,
  },
];

const seed = async () => {
  await connectDB();

  console.log('\n🌱 Seeding database...\n');

  // Clear existing
  await Promise.all([Admin.deleteMany(), Project.deleteMany()]);
  console.log('🗑  Cleared existing admins and projects');

  // Create admin
  const admin = await Admin.create(seedAdmin);
  console.log(`👤 Admin created: ${admin.email}`);

  // Create projects
  const projects = await Project.insertMany(seedProjects);
  console.log(`📁 ${projects.length} projects created`);

  console.log('\n✅ Seed complete!\n');
  console.log('──────────────────────────────');
  console.log(`Admin Email   : ${seedAdmin.email}`);
  console.log(`Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
  console.log('──────────────────────────────\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
