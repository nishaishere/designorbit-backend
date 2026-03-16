import jwt   from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = signToken(admin._id);

    res.json({
      success: true,
      token,
      data: admin,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me  (protected)
export const getMe = async (req, res) => {
  res.json({ success: true, data: req.admin });
};
