import { validationResult } from 'express-validator';
import Project from '../models/Project.js';

// GET /api/projects  (public)
export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ published: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
};

// GET /api/projects/:id  (public)
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// POST /api/projects  (admin)
export const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// PUT /api/projects/:id  (admin)
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/projects/:id  (admin)
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};
