import { validationResult } from 'express-validator';
import Subscriber from '../models/Subscriber.js';

// POST /api/subscribe
export const subscribe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;

    // Check if already exists
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (existing.status === 'unsubscribed') {
        existing.status = 'active';
        await existing.save();
        return res.json({ success: true, message: 'Welcome back! You\'ve been re-subscribed.' });
      }
      return res.status(409).json({ success: false, message: 'Already subscribed!' });
    }

    await Subscriber.create({ email, ipAddress: req.ip });

    res.status(201).json({
      success: true,
      message: 'Subscribed successfully! Stay tuned for updates.',
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/subscribe/unsubscribe?email=xxx
export const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const sub = await Subscriber.findOneAndUpdate(
      { email },
      { status: 'unsubscribed' },
      { new: true }
    );
    if (!sub) return res.status(404).json({ success: false, message: 'Subscriber not found' });

    res.json({ success: true, message: 'Unsubscribed successfully.' });
  } catch (err) {
    next(err);
  }
};

// ── Admin: GET all subscribers ───────────────────────────
export const getSubscribers = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const filter = status ? { status } : {};

    const [subscribers, total] = await Promise.all([
      Subscriber.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Subscriber.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: subscribers,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};
