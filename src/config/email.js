import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Send contact form notification to admin ──
export const sendContactNotification = async (contact) => {
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      process.env.ADMIN_EMAIL,
    subject: `New Contact: ${contact.name} — ${contact.service}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#e8ff47;background:#060608;padding:24px;margin:0">DesignOrbit — New Enquiry</h2>
        <table style="width:100%;border-collapse:collapse;margin-top:0">
          <tr><td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold;width:130px">Name</td><td style="padding:12px;border-bottom:1px solid #eee">${contact.name}</td></tr>
          <tr><td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold">Email</td><td style="padding:12px;border-bottom:1px solid #eee">${contact.email}</td></tr>
          <tr><td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold">Phone</td><td style="padding:12px;border-bottom:1px solid #eee">${contact.phone || '—'}</td></tr>
          <tr><td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold">Company</td><td style="padding:12px;border-bottom:1px solid #eee">${contact.company || '—'}</td></tr>
          <tr><td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold">Service</td><td style="padding:12px;border-bottom:1px solid #eee">${contact.service}</td></tr>
          <tr><td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold">Budget</td><td style="padding:12px;border-bottom:1px solid #eee">${contact.budget || '—'}</td></tr>
          <tr><td style="padding:12px;font-weight:bold;vertical-align:top">Message</td><td style="padding:12px">${contact.message}</td></tr>
        </table>
      </div>
    `,
  });
};

// ── Send auto-reply to user ──
export const sendAutoReply = async (contact) => {
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      contact.email,
    subject: `We received your message — DesignOrbit`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#e8ff47;background:#060608;padding:24px;margin:0">DesignOrbit</h2>
        <div style="padding:32px 24px">
          <p style="font-size:16px">Hi ${contact.name},</p>
          <p style="font-size:15px;color:#444;line-height:1.7;margin-top:16px">
            Thanks for reaching out! We've received your enquiry and will get back to you within <strong>24–48 hours</strong>.
          </p>
          <p style="font-size:15px;color:#444;line-height:1.7;margin-top:16px">
            In the meantime, feel free to explore our work at <a href="http://localhost:5173" style="color:#e8ff47">designorbit.co</a>.
          </p>
          <p style="margin-top:32px;font-size:14px;color:#888">— The DesignOrbit Team</p>
        </div>
      </div>
    `,
  });
};

export default transporter;
