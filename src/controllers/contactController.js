import { validationResult } from 'express-validator';
import Contact from '../models/Contact.js';
import { sendContactNotification, sendAutoReply } from '../config/email.js';


export const submitContact = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, company, service, budget, message } = req.body;

    // ✅ Save to DB
    const contact = await Contact.create({
      name,
      email,
      phone,
      company,
      service,
      budget,
      message,
      ipAddress: req.ip,
    });

    // ✅ तुरंत response भेजो (FAST)
    res.status(201).json({
      success: true,
      message: "Message received! We'll contact you soon.",
      data: { id: contact._id },
    });

    // ✅ Emails background में भेजो (NON-BLOCKING)
    Promise.all([
      sendContactNotification(contact),
      sendAutoReply(contact),
    ]).catch((err) => {
      console.warn("⚠️ Email failed:", err.message);
    });

  } catch (err) {
    next(err);
  }
};

// ── Admin: GET all contacts ──────────────────────────────
export const getContacts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Contact.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: contacts,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// ── Admin: GET single contact ────────────────────────────
export const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });

    // Auto-mark as read when viewed
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

// ── Admin: UPDATE contact status ─────────────────────────
export const updateContactStatus = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

// ── Admin: DELETE contact ────────────────────────────────
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, message: 'Contact deleted' });
  } catch (err) {
    next(err);
  }
};

// ── Admin: GET stats ─────────────────────────────────────
export const getContactStats = async (req, res, next) => {
  try {
    const [total, newCount, replied, byService] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Contact.countDocuments({ status: 'replied' }),
      Contact.aggregate([
        { $group: { _id: '$service', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.json({ success: true, data: { total, new: newCount, replied, byService } });
  } catch (err) {
    next(err);
  }
};
