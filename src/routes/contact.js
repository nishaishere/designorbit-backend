import { Router } from 'express';
import { body }   from 'express-validator';
import {
  submitContact, getContacts, getContact,
  updateContactStatus, deleteContact, getContactStats,
} from '../controllers/contactController.js';
import { protect }        from '../middleware/auth.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Validation rules
const contactValidation = [
  body('name')   .trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email')  .isEmail().withMessage('Valid email required').normalizeEmail(),
  body('service').notEmpty().withMessage('Please select a service')
                 .isIn(['Web Development','Branding','Software / AI','3D Animation','Other']),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10, max: 2000 }),
  body('phone')  .optional().trim(),
  body('company').optional().trim(),
  body('budget') .optional().isIn(['< $5K','$5K–$15K','$15K–$50K','$50K+','']),
];

// Public
router.post('/', contactLimiter, contactValidation, submitContact);

// Admin protected
router.get('/',           protect, getContacts);
router.get('/stats',      protect, getContactStats);
router.get('/:id',        protect, getContact);
router.patch('/:id',      protect, updateContactStatus);
router.delete('/:id',     protect, deleteContact);

export default router;
