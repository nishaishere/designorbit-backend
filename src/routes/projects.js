import { Router } from 'express';
import { body }   from 'express-validator';
import {
  getProjects, getProject,
  createProject, updateProject, deleteProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

const projectValidation = [
  body('tag')  .trim().notEmpty().withMessage('Tag is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('desc') .trim().notEmpty().withMessage('Description is required'),
  body('img')  .trim().notEmpty().withMessage('Image URL is required'),
  body('year') .trim().notEmpty().withMessage('Year is required'),
];

// Public
router.get('/',    getProjects);
router.get('/:id', getProject);

// Admin protected
router.post('/',    protect, projectValidation, createProject);
router.put('/:id',  protect, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;
