import mongoose from 'mongoose';
const { Schema, models, model } = mongoose;
const ref = (n) => ({ type: Schema.Types.ObjectId, ref: n });
const T = { timestamps: true };

export const User = models.User || model('User', new Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: String,
  role: { type: String, enum: ['admin', 'manager', 'agent'], default: 'agent' },
  active: { type: Boolean, default: true },
}, T));

export const City = models.City || model('City', new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  active: { type: Boolean, default: true },
}, T));

export const Locality = models.Locality || model('Locality', new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  city: ref('City'),
  active: { type: Boolean, default: true },
}, T));

export const Developer = models.Developer || model('Developer', new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  logo: String,
  description: String,
  active: { type: Boolean, default: true },
}, T));

export const Project = models.Project || model('Project', new Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  type: { type: String, enum: ['residential', 'commercial'], default: 'residential' },
  status: { type: String, enum: ['New Launch', 'Under Construction', 'Ready to Move', 'Resale', 'Sold Out'], default: 'Under Construction' },
  price: { type: Number, default: 0 },
  configs: [String],
  areaMin: Number,
  areaMax: Number,
  address: String,
  city: ref('City'),
  locality: ref('Locality'),
  developer: ref('Developer'),
  rera: String,
  cover: String,
  images: [String],
  description: String,
  amenities: [String],
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
}, T));

export const Lead = models.Lead || model('Lead', new Schema({
  name: String,
  phone: String,
  email: String,
  message: String,
  project: ref('Project'),
  source: { type: String, default: 'Website' },
  status: { type: String, enum: ['New', 'Contacted', 'Site Visit', 'Negotiation', 'Won', 'Lost'], default: 'New' },
  assignedTo: ref('User'),
  notes: [{ text: String, by: String, at: Date }],
}, T));
