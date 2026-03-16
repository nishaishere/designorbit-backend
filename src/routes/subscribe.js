import { Router } from 'express';
import { body }   from 'express-validator';
import { subscribe, unsubscribe, getSubscribers } from '../controllers/subscriberController.js';
import { protect }     from '../middleware/auth.js';
import { apiLimiter }  from '../middleware/rateLimiter.js';

const router = Router();

router.post('/',           apiLimiter, [body('email').isEmail().normalizeEmail()], subscribe);
router.get('/unsubscribe', unsubscribe);
router.get('/',            protect, getSubscribers);

export default router;
