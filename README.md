# DesignOrbit — Backend API

Node.js + Express + MongoDB REST API for the DesignOrbit frontend.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or [Atlas](https://cloud.mongodb.com))

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and email credentials

# 3. Seed the database (creates admin + sample projects)
node src/seed.js

# 4. Start development server
npm run dev
```

Server runs at **http://localhost:5000**

---

## 📁 Project Structure

```
src/
├── server.js                    ← Express app entry point
├── seed.js                      ← DB seed script
├── config/
│   ├── db.js                    ← MongoDB connection
│   └── email.js                 ← Nodemailer setup
├── models/
│   ├── Contact.js               ← Contact form submissions
│   ├── Subscriber.js            ← Newsletter subscribers
│   ├── Project.js               ← Portfolio projects
│   └── Admin.js                 ← Admin users (bcrypt hashed)
├── controllers/
│   ├── contactController.js
│   ├── subscriberController.js
│   ├── projectController.js
│   └── authController.js
├── routes/
│   ├── contact.js
│   ├── subscribe.js
│   ├── projects.js
│   └── auth.js
└── middleware/
    ├── auth.js                  ← JWT protect middleware
    ├── errorHandler.js          ← Central error handler
    └── rateLimiter.js           ← express-rate-limit configs
```

---

## 📡 API Reference

### Health
| Method | Endpoint       | Description       |
|--------|---------------|-------------------|
| GET    | /api/health   | Server health check |

### Contact
| Method | Endpoint              | Auth    | Description              |
|--------|-----------------------|---------|--------------------------|
| POST   | /api/contact          | Public  | Submit contact form      |
| GET    | /api/contact          | Admin   | Get all contacts         |
| GET    | /api/contact/stats    | Admin   | Contact statistics       |
| GET    | /api/contact/:id      | Admin   | Get single contact       |
| PATCH  | /api/contact/:id      | Admin   | Update contact status    |
| DELETE | /api/contact/:id      | Admin   | Delete contact           |

### Newsletter
| Method | Endpoint                        | Auth    | Description          |
|--------|---------------------------------|---------|----------------------|
| POST   | /api/subscribe                  | Public  | Subscribe email      |
| GET    | /api/subscribe/unsubscribe      | Public  | Unsubscribe by email |
| GET    | /api/subscribe                  | Admin   | Get all subscribers  |

### Projects
| Method | Endpoint          | Auth    | Description        |
|--------|-------------------|---------|--------------------|
| GET    | /api/projects     | Public  | Get all projects   |
| GET    | /api/projects/:id | Public  | Get single project |
| POST   | /api/projects     | Admin   | Create project     |
| PUT    | /api/projects/:id | Admin   | Update project     |
| DELETE | /api/projects/:id | Admin   | Delete project     |

### Auth (Admin)
| Method | Endpoint      | Auth    | Description   |
|--------|---------------|---------|---------------|
| POST   | /api/auth/login | Public | Admin login  |
| GET    | /api/auth/me  | Admin   | Get current admin |

---

## 🔐 Admin Login

After running `node src/seed.js`:

```
Email:    admin@designorbit.co   (or ADMIN_EMAIL in .env)
Password: Admin@123456           (or ADMIN_PASSWORD in .env)
```

To authenticate, POST to `/api/auth/login` and use the returned `token` as:
```
Authorization: Bearer <token>
```

---

## 🌿 Environment Variables

See `.env.example` for all required variables.

Key variables:
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Random secret for signing JWTs (keep private!)
- `CLIENT_URL` — Your frontend URL (for CORS)
- `EMAIL_*` — SMTP credentials for sending emails

---

## 🗄️ MongoDB Atlas (Free Cloud DB)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create free cluster
2. Database Access → Add user with password
3. Network Access → Allow `0.0.0.0/0` (or your IP)
4. Connect → Driver → Copy connection string
5. Paste into `.env` as `MONGO_URI=mongodb+srv://...`

---

## 📦 Dependencies

| Package              | Purpose                        |
|----------------------|--------------------------------|
| express              | Web framework                  |
| mongoose             | MongoDB ODM                    |
| bcryptjs             | Password hashing               |
| jsonwebtoken         | JWT authentication             |
| cors                 | Cross-origin resource sharing  |
| helmet               | Security headers               |
| morgan               | HTTP request logging           |
| express-rate-limit   | Rate limiting                  |
| express-validator    | Input validation               |
| nodemailer           | Email sending                  |
| dotenv               | Environment variables          |

---

© 2026 DesignOrbit
