# Wakad Toastmasters Platform

A full-stack club management web application for the Wakad Toastmasters community — handling member registration, meeting-role coordination with admin approval workflows, and guest engagement — deployable locally or on Google Cloud Run.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Frontend Pages](#frontend-pages)
- [Backend API Reference](#backend-api-reference)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

Wakad Toastmasters Platform is a lightweight yet production-ready management system designed for Toastmasters clubs. Members can register interest, claim or cancel meeting roles, and log in via their Customer ID. Every role request triggers an admin approval workflow with one-click email actions, and the admin dashboard provides full oversight of all pending and active assignments.

## Key Features

- **Member Registration** — Multi-field form capturing name, email, phone, introduction, motivation, preferred role, and referral source
- **Contact Management** — Track visitor inquiries submitted through the contact form
- **Role Allocation with Admin Approval** — Members claim roles which enter a `Pending_Allocation` state; admins approve or reject via email one-click links or the dashboard
- **Role Cancellation Workflow** — Members can request cancellation (enters `Pending_Cancel`); admins confirm or deny
- **Admin Dashboard** — View, approve, reject, and delete all role assignments in one place
- **Member Portal Login** — Club members authenticate with their Toastmasters Customer ID and view assigned roles
- **CSV Bulk Upload** — Admins can bulk-import club members via CSV file upload
- **Email Notifications** — Automated Gmail-based emails for role claims, cancellations, contact submissions, and new registrations — with one-click approve/reject links
- **Cloud-Ready** — Dockerized with multi-stage builds, Cloud SQL Unix socket support, and configurable CORS origins
- **Auto-Migration** — Database schema and seed data are created/updated on every server start (idempotent)

## Architecture

```
                    ┌─────────────────────────────┐
                    │      Static Frontend        │
                    │  HTML + CSS + Vanilla JS     │
                    └──────────┬──────────────────┘
                               │  REST API calls
                    ┌──────────▼──────────────────┐
                    │     Express.js Backend       │
                    │  Routes → Controllers →      │
                    │  Services (Email)            │
                    └──────────┬──────────────────┘
                               │  mysql2 (pool)
                    ┌──────────▼──────────────────┐
                    │     MySQL 8.0+ Database      │
                    │  TCP (local) or Unix socket  │
                    │  (Cloud SQL)                 │
                    └─────────────────────────────┘
```

| Directory | Purpose |
|-----------|---------|
| `frontend/` | Static HTML pages with vanilla CSS and JavaScript |
| `backend/server.js` | Express app entry point — middleware, routes, static serving, and auto-migration |
| `backend/config/` | Database connection pool with TCP / Unix socket auto-detection |
| `backend/controllers/` | Request handlers and business logic for each resource |
| `backend/routes/` | API endpoint definitions and routing |
| `backend/services/` | Email service (Gmail via Nodemailer) |
| `backend/database/` | Migration script, SQL schema, seed data, and utility queries |

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | HTML5, CSS3, Vanilla JS | Lightweight UI — no build step required |
| **Backend** | Node.js 20, Express.js 4 | RESTful API with middleware support |
| **Database** | MySQL 8.0+ | Relational storage with foreign keys and ENUM constraints |
| **DB Driver** | mysql2/promise | Async connection pooling with Unix socket support |
| **Email** | Nodemailer (Gmail) | Admin notifications with one-click action links |
| **File Upload** | Multer (memory storage) | CSV bulk import for club members |
| **CSV Parsing** | csv-parser | Stream-based CSV parsing |
| **Config** | dotenv | Environment variable management |
| **CORS** | cors | Cross-origin request handling |
| **Containerization** | Docker (multi-stage) | Production deployment on Cloud Run |
| **Development** | nodemon | Auto-reload during development |

## Project Structure

```
Toastmasters_Project/
├── .env.example              # Environment variable template
├── .gitignore
├── Dockerfile                # Multi-stage production build
├── package.json              # Root dependencies and scripts
├── README.md
│
├── backend/
│   ├── server.js             # Express app entry point
│   ├── config/
│   │   └── db.js             # MySQL pool (TCP + Unix socket)
│   ├── controllers/
│   │   ├── clubMemberController.js   # CRUD, CSV upload, login
│   │   ├── contactController.js      # Contact form submissions
│   │   ├── memberController.js       # Member registration
│   │   └── roleController.js         # Role allocation, approval workflow
│   ├── routes/
│   │   ├── clubMembers.js
│   │   ├── contacts.js
│   │   ├── members.js
│   │   └── roles.js
│   ├── services/
│   │   └── emailService.js   # Gmail notifications with HTML templates
│   └── database/
│       ├── migrate.js         # Auto-migration + seed (runs on startup)
│       ├── schema.sql         # Full schema DDL
│       ├── members_setup.sql  # Manual seed script
│       ├── clear_roles.sql    # Reset role assignments
│       └── query.sql          # Sample exploration queries
│
└── frontend/
    ├── index.html             # Landing page
    ├── form.html / form.js    # Member registration form
    ├── roles.html / roles.js  # Role claim & cancellation
    ├── admin.html / admin.js  # Admin dashboard
    ├── member.html / member.js # Member portal (login by Customer ID)
    ├── access.html            # Access control page
    ├── what-to-expect.html    # Meeting guidance for guests
    ├── script.js              # Shared utilities
    ├── style.css              # Main styles
    ├── dashboard.css          # Member portal styles
    ├── roles.css              # Role page styles
    ├── admin-dash.css         # Admin dashboard styles
    ├── form.css               # Registration form styles
    ├── what-to-expect.css     # What-to-expect page styles
    ├── tm-logo.png            # Toastmasters logo
    └── grp_img.jpeg           # Group photo
```

## Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd Toastmasters_Project

# 2. Install dependencies
cd backend
npm install

# 3. Create your environment file
cd ..
cp .env.example .env
# Edit .env with your database and email credentials (see below)

# 4. Start the server
npm start
# Server starts on the configured PORT (default: 5001)
# Database tables and seed data are created automatically

# 5. Open in browser
# Navigate to http://localhost:5001
```

The backend serves the frontend as static files, so everything runs from a single server.

## Environment Variables

Copy `.env.example` to `.env` and fill in your own values. See [`.env.example`](./.env.example) for the full template.

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: `5001`, Cloud Run injects `8080`) |
| `NODE_ENV` | No | `production` or `development` |
| `DB_HOST` | Yes | Database host, IP, or Cloud SQL Unix socket path |
| `DB_PORT` | No | Database port (default: `3306`; leave blank for Unix sockets) |
| `DB_USER` | Yes | Database username |
| `DB_PASSWORD` | Yes | Database password |
| `DB_NAME` | Yes | Database name |
| `ALLOWED_ORIGINS` | No | Comma-separated allowed CORS origins |
| `EMAIL_USER` | Yes | Gmail address for sending notifications |
| `EMAIL_PASS` | Yes | Gmail App Password (16-character) |
| `ADMIN_EMAIL` | Yes | Admin email — receives all notifications |
| `BASE_URL` | Yes | Public backend URL (used in email action links) |

> **Note:** Never commit `.env` to version control. The `.gitignore` already excludes it.

## Frontend Pages

| Page | URL Path | Purpose |
|------|----------|---------|
| **Home** | `/` or `/index.html` | Club overview and landing page |
| **Member Form** | `/form.html` | Registration form for new members |
| **Roles** | `/roles.html` | Claim or cancel meeting roles |
| **Admin Dashboard** | `/admin.html` | Approve/reject role requests, manage assignments |
| **Member Portal** | `/member.html` | Login with Customer ID, view assigned roles |
| **What to Expect** | `/what-to-expect.html` | Meeting guidance for first-time visitors |
| **Access** | `/access.html` | Access control page |

All pages are served as static files by the Express backend — no separate web server needed.

## Backend API Reference

Base URL: `http://localhost:5001/api`

### Members (`/api/members`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/members/register` | Register a new member (sends admin email) |
| `GET` | `/api/members` | List all registered members |

### Contacts (`/api/contacts`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/contacts` | Submit a contact message (sends admin email) |
| `GET` | `/api/contacts` | List all contact submissions |

### Roles (`/api/roles`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/roles/allocate` | Request a role (status: `Pending_Allocation`) |
| `POST` | `/api/roles/cancel` | Request role cancellation (status: `Pending_Cancel`) |
| `GET` | `/api/roles/all` | List all role assignments (admin) |
| `PATCH` | `/api/roles/approve-allocate` | Approve allocation → `Assigned` |
| `PATCH` | `/api/roles/approve-cancel` | Approve cancellation → `Cancelled` |
| `PATCH` | `/api/roles/reject-allocate` | Reject allocation → `Cancelled` |
| `DELETE` | `/api/roles/:id` | Hard-delete a role assignment |
| `GET` | `/api/roles/approve-allocate?...` | Email one-click: approve allocation |
| `GET` | `/api/roles/approve-cancel?...` | Email one-click: approve cancellation |
| `GET` | `/api/roles/reject-allocate?...` | Email one-click: reject allocation |

### Club Members (`/api/club-members`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/club-members` | List all club members |
| `GET` | `/api/club-members/:customer_id` | Get a member by Customer ID |
| `POST` | `/api/club-members` | Add a new club member |
| `PUT` | `/api/club-members/:id` | Update a club member |
| `DELETE` | `/api/club-members/:id` | Delete a club member |
| `POST` | `/api/club-members/upload/csv` | Bulk import members via CSV |
| `POST` | `/api/club-members/auth/login` | Member login by Customer ID |

### Response Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request (missing fields) |
| `401` | Unauthorized (invalid login) |
| `404` | Not Found |
| `409` | Conflict (duplicate entry) |
| `500` | Server Error |

## Database Schema

The migration script (`backend/database/migrate.js`) auto-creates all tables on startup using `CREATE TABLE IF NOT EXISTS` and seeds data with `INSERT IGNORE`.

### Tables

| Table | Purpose |
|-------|---------|
| `members` | Registered users with contact info, introduction, and preferences |
| `contacts` | Visitor contact form submissions |
| `roles` | Available Toastmasters meeting roles (7 seeded) |
| `member_roles` | Role assignments with status workflow and cancel reasons |
| `club_members` | Active club members with Customer IDs (36 seeded) |

### Role Status Workflow

```
  Member claims role          Admin action
  ────────────────►           ──────────────►
  Pending_Allocation  ──────► Assigned
                      ──────► Cancelled (rejected)

  Member cancels role         Admin action
  ────────────────►           ──────────────►
  Pending_Cancel      ──────► Cancelled (approved)
                      ──────► Assigned (denial — keeps role)
```

### Relationships

```
members ──┐
           ├──► member_roles ◄──── roles
           │
club_members (standalone — linked by name for display)
contacts     (standalone)
```

### Seeded Roles

Toastmaster of the Day, General Evaluator, Ah-Counter, Grammarian, Timer, Speaker, Evaluator

## Deployment

### Docker (Cloud Run)

The project includes a multi-stage `Dockerfile` optimized for Google Cloud Run:

```bash
# Build the image
docker build -t toastmasters-backend .

# Run locally
docker run -p 8080:8080 --env-file .env toastmasters-backend
```

**Cloud Run specifics:**
- The Dockerfile runs `node backend/server.js` as the entrypoint
- Set `DB_HOST` to the Cloud SQL Unix socket path (`/cloudsql/PROJECT:REGION:INSTANCE`)
- Leave `DB_PORT` empty when using Unix sockets
- Cloud Run injects `PORT=8080` automatically
- The frontend is bundled into the Docker image and served by Express

### Local Development

```bash
cd backend
npm install
npm run dev     # Uses nodemon for auto-reload
```

## Troubleshooting

### Database Connection Errors

**Error:** `MySQL connection failed`
- Verify MySQL is running and accessible
- Check `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in `.env`
- Ensure the database user has `CREATE`, `INSERT`, `SELECT`, `UPDATE`, `DELETE`, and `ALTER` permissions
- For Cloud SQL: verify the Unix socket path and that the Cloud SQL Auth Proxy is running

### Port Already in Use

```bash
# Windows:
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5001
kill -9 <PID>
```

### Module Not Found

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Emails Not Sending

- Ensure `EMAIL_USER` and `EMAIL_PASS` are set (use a Gmail App Password, not your regular password)
- Check that "Less secure app access" or an App Password is configured in your Google account
- Verify `ADMIN_EMAIL` is set — all notifications go to this address
- Check server logs for `Error sending role email` messages

### Seed Data Not Loading

- The migration runs automatically on server start — check logs for `DB migration done`
- Verify the MySQL user has `CREATE TABLE` and `INSERT` permissions
- If tables already exist, `CREATE TABLE IF NOT EXISTS` and `INSERT IGNORE` will skip gracefully

### Frontend Not Connecting to Backend

- The frontend auto-detects the API base URL (localhost in dev, deployed URL in production)
- Verify the backend is running on the expected port
- Check browser console for CORS errors — configure `ALLOWED_ORIGINS` in `.env`

## Contributing

Contributions are welcome. Areas for enhancement:

- **Frontend:** Improve UI/UX, add responsive breakpoints, enhance form validation
- **Backend:** Add authentication/authorization, rate limiting, input sanitization
- **Database:** Query optimization, pagination, audit logging
- **DevOps:** CI/CD pipeline, automated testing, staging environment

**Guidelines:**
1. Keep code well-commented and organized
2. Test locally before submitting changes
3. Update this README if you add new endpoints or environment variables
4. Follow existing code conventions

## License

This project is intended for academic use and portfolio demonstration.
