#  Wakad Toastmasters Platform

A **full-stack club management system** built for the Wakad Toastmasters community — enabling seamless **member onboarding, role allocation workflows, admin approvals, and automated email communication**.

Designed to be **cloud-ready, scalable, and production deployable** using Google Cloud Run.

---

## 📌 Overview

The Wakad Toastmasters Platform streamlines club operations by digitizing:

* Member registration & engagement
* Meeting role assignment workflows
* Admin approval systems
* Automated communication via email

This system replaces manual coordination with a **structured, approval-driven workflow**, improving efficiency and transparency.

---

## ✨ Key Features

### 👥 Member Management

* Detailed registration with profile inputs
* Customer ID-based login system
* Member portal to track assigned roles

### 🎯 Role Allocation System

* Request roles with **Pending Approval workflow**
* Admin approval/rejection via:

  * Dashboard
  * One-click email links
* Role cancellation request system

### 🛠 Admin Dashboard

* Centralized control over all role assignments
* Approve / reject / delete actions
* Bulk CSV upload for club members

### 📧 Email Automation

* Gmail-based notifications using Nodemailer
* Triggered on:

  * Registration
  * Role requests
  * Cancellations
* Embedded **one-click action links**

### ☁️ Cloud-Ready Architecture

* Dockerized backend (Cloud Run compatible)
* Cloud SQL support (Unix sockets)
* Configurable CORS
* Auto database migration on startup

---

## 🏗 Architecture

```
Frontend (Static)  →  Backend (Express API)  →  MySQL Database
        │                     │                      │
        └──── REST Calls ─────┴──── mysql2 ──────────┘
```

* **Frontend**: Static UI served via Express
* **Backend**: REST API with business logic
* **Database**: MySQL with relational schema

---

## 🧰 Tech Stack

| Layer       | Technology                |
| ----------- | ------------------------- |
| Frontend    | HTML, CSS, JavaScript     |
| Backend     | Node.js, Express.js       |
| Database    | MySQL                     |
| ORM/Driver  | mysql2                    |
| Email       | Nodemailer (Gmail)        |
| File Upload | Multer                    |
| Deployment  | Docker + Google Cloud Run |
| Config      | dotenv                    |

---

## 📁 Project Structure

```
backend/
  ├── controllers/
  ├── routes/
  ├── services/
  ├── config/
  └── database/

frontend/
  ├── HTML pages
  ├── JS logic
  └── CSS styles
```

---

## ⚡ Quick Start

```bash
# Clone repository
git clone <repo-url>

# Install backend dependencies
cd backend
npm install

# Setup environment variables
cp .env.example .env

# Run server
npm start
```

👉 App runs on: `http://localhost:5001`

---

## 🔑 Environment Variables

| Variable        | Description                      |
| --------------- | -------------------------------- |
| PORT            | Server port                      |
| DB_HOST         | Database host / Cloud SQL socket |
| DB_USER         | DB username                      |
| DB_PASSWORD     | DB password                      |
| DB_NAME         | Database name                    |
| EMAIL_USER      | Gmail ID                         |
| EMAIL_PASS      | App password                     |
| ADMIN_EMAIL     | Admin email                      |
| BASE_URL        | Backend public URL               |
| ALLOWED_ORIGINS | CORS domains                     |

---

## 🔗 API Overview

Base URL:

```
/api
```

### Members

* `POST /members/register`
* `GET /members`

### Roles

* `POST /roles/allocate`
* `POST /roles/cancel`
* `PATCH /roles/approve-allocate`
* `PATCH /roles/reject-allocate`

### Contacts

* `POST /contacts`
* `GET /contacts`

### Club Members

* CRUD + CSV Upload + Login

---

## 🗄 Database Design

### Core Tables

* `members`
* `roles`
* `member_roles`
* `contacts`
* `club_members`

### Workflow

```
Pending → Approved → Assigned
        → Rejected → Cancelled
```

---

## ☁️ Deployment

### 🔹 Backend (Cloud Run)

```bash
docker build -t app .
docker run -p 8080:8080 app
```

* Uses `PORT=8080`
* Supports Cloud SQL via Unix sockets

---

### 🔹 Frontend (Vercel)

* Deploy static frontend
* Set API base URL:

```
REACT_APP_API_URL = https://your-cloud-run-url
```

---

## ⚠️ Troubleshooting

### ❌ Frontend not connecting

* Check API URL
* Verify CORS settings
* Inspect browser network tab

### ❌ Emails not working

* Use Gmail App Password
* Check env variables

### ❌ Cloud Run issues

* Ensure server uses `process.env.PORT`
* No localhost URLs in production

---

## 🔧 Future Improvements

* Authentication (JWT)
* Role-based access control
* Pagination & search
* CI/CD pipeline
* UI modernization (React)

---

## 🤝 Contributing

1. Fork repo
2. Create feature branch
3. Commit changes
4. Open PR

---

## 📜 License

Academic and portfolio use only.
