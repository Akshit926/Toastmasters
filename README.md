# Wakad Toastmasters Platform

A comprehensive club management web application built for the Wakad Toastmasters community to streamline member management, meeting coordination, and guest engagement.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup and Run](#setup-and-run)
- [Frontend Usage](#frontend-usage)
- [Backend API Endpoints](#backend-api-endpoints)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

Wakad Toastmasters Platform is a lightweight yet powerful management system designed specifically for Toastmasters clubs. The application provides essential features for member coordination, role management, and visitor engagement with an intuitive user interface and robust backend infrastructure.

## Key Features

- 📝 **Member Registration** — Capture and store member interest details with preferences
- 💬 **Contact Management** — Track visitor inquiries and contact form submissions
- 🎯 **Role Allocation** — Coordinate Toastmasters meeting roles with real-time status tracking
- 📊 **Member Dashboard** — View and manage club members with seeded data
- 📚 **Informational Pages** — Static pages for guests and members with meeting guidance
- 🔐 **Data Integrity** — Foreign key constraints and referential integrity enforcement

## Architecture

The application follows a client-server architecture with clear separation of concerns:

| Component | Purpose |
|-----------|---------|
| **frontend/** | Static HTML pages with vanilla JavaScript for client-side interactivity |
| **backend/** | Express.js REST API server handling business logic and data validation |
| **backend/config/** | Database connection configuration and environment setup |
| **backend/controllers/** | Route handlers and business logic for each resource |
| **backend/routes/** | API endpoint definitions and routing |
| **backend/services/** | Utility services (email delivery, notifications) |
| **backend/database/** | SQL schema, migrations, and seed data scripts |

The architecture emphasizes simplicity and lightweight deployment suitable for community organizations while maintaining data integrity and security best practices.

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | Lightweight UI with no build process required |
| **Backend** | Node.js, Express.js | RESTful API server with middleware support |
| **Database** | MySQL 8.0+ | Relational data storage with ACID guarantees |
| **Database Driver** | mysql2 | Efficient MySQL connection pooling |
| **Middleware** | cors, dotenv | CORS handling and environment configuration |
| **Email Service** | nodemailer | Email notifications and communication |
| **File Handling** | multer | Multipart form data and file uploads |
| **Development** | nodemon (optional) | Automatic server reload during development |

**Why These Technologies:**
- Lightweight and suitable for community organizations
- No complex build tools or deployment infrastructure required
- MySQL provides data integrity with foreign keys and constraints
- Express provides flexible routing and middleware ecosystem

## Project Structure

```
backend/
  package.json
  server.js
  config/db.js
  controllers/
  database/
  routes/
  services/
frontend/
  index.html
  admin.html
  form.html
  member.html
  roles.html
  what-to-expect.html
  *.js
  *.css

README.md
```

## Prerequisites

- **Node.js** 18 or newer — [Download](https://nodejs.org/)
- **MySQL** — Server running locally (port 3306) or remotely with connection details
- **npm** — Comes with Node.js
- Optional: `nodemon` for development auto-reload

## Quick Start

Get the platform running in 5 minutes:

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment (see Setup section for details)
# Create .env file with DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME

# 4. Start the server
npm start

# 5. Open frontend in browser
# Open frontend/index.html in your browser
```

The backend will automatically initialize your database schema and seed data on first run.

## Setup and Run

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

All required packages including Express, MySQL, email service, and utilities will be installed.

### 2. Configure the Environment

Create a `.env` file in the `backend/` directory with your database configuration:

```env
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=toastmasters
PORT=3000

# Optional: Email service configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@toastmasters.com
```

**Important:** Never commit `.env` files to version control. Add `.env` to your `.gitignore`.

### 3. Start the Backend

```bash
npm start
```

The server will start on the configured port (default: 3000).

For development with automatic reload:

```bash
npm install -g nodemon
npm run dev
```

### 4. Initialize the Database

The backend automatically runs migrations when it starts. This will:
- Create all necessary tables
- Load seed data for club members
- Set up relationships and constraints

**To manually run SQL scripts:**

```bash
# Access MySQL CLI
mysql -u root -p

# In MySQL prompt:
source backend/database/schema.sql;
source backend/database/members_setup.sql;
```

**Available database scripts:**
- `schema.sql` — Core database tables and relationships
- `members_setup.sql` — Initial club members seed data
- `clear_roles.sql` — Reset role assignments (useful for testing)
- `query.sql` — Sample queries for database exploration

## Frontend Usage

The frontend is a static HTML/CSS/JavaScript application. Open any HTML file directly in your browser or serve via a local server.

**Entry Points:**

| Page | Purpose |
|------|---------|
| **index.html** | Home page with club overview |
| **form.html** | Member registration form |
| **roles.html** | Role allocation interface |
| **member.html** | Member details and view |
| **admin.html** | Admin dashboard |
| **what-to-expect.html** | Meeting guidance for members |
| **access.html** | Access control page |

**To open the application:**

```bash
# Option 1: Open directly in browser
open frontend/index.html

# Option 2: Use a local server (recommended for development)
cd frontend
python -m http.server 8000
# Then visit http://localhost:8000
```

**Frontend Features:**
- Responsive design with CSS styling
- Form validation on client-side
- Real-time API integration
- Dashboard with member management
- Role allocation with status tracking

## Backend API Endpoints

### Members API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/members` | List all registered members |
| `POST` | `/api/members` | Register a new member |
| `GET` | `/api/members/:id` | Get member details by ID |
| `PUT` | `/api/members/:id` | Update member information |

### Contacts API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/contacts` | Retrieve all contact form submissions |
| `POST` | `/api/contacts` | Submit a new contact message |

### Roles API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/roles` | List all available meeting roles |
| `POST` | `/api/roles/allocate` | Assign a role to a member for a meeting |
| `GET` | `/api/roles/member/:id` | Get roles assigned to a specific member |

### Club Members API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/club-members` | List seeded club members (readonly) |

**Response Format:**
All responses follow standard HTTP status codes:
- `200` — Success
- `201` — Created
- `400` — Bad Request
- `404` — Not Found
- `500` — Server Error

## Database Schema

The application uses MySQL with the following core entities:

| Table | Purpose |
|-------|---------|
| **members** | User registrations with preferences and contact info |
| **roles** | Available Toastmasters meeting roles (Speaker, Timer, etc.) |
| **member_roles** | Junction table linking members to roles by date |
| **club_members** | Seeded club membership data |
| **contacts** | Visitor inquiries and contact form submissions |

**Key Features:**
- Foreign keys enforce referential integrity between tables
- ENUM types for role statuses and member preferences
- Automatic timestamps for tracking creation/updates
- Indexes on frequently queried columns for performance

**Relationships:**
```
members ──→ member_roles ←─ roles
members ──→ contacts (one-to-many)
```

For detailed schema information, see `backend/database/schema.sql` and the [Database Design Report](./Database_Design_Report.md).

## Troubleshooting

### Database Connection Errors

**Error:** `Error connecting to the database`
- Verify MySQL is running locally or remote connection details are correct
- Check `.env` file has correct `DATABASE_HOST`, `DATABASE_USER`, `DATABASE_PASSWORD`
- Ensure the database user has appropriate permissions
- Check MySQL is listening on port 3306 (or your configured port)

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`
```bash
# Find and kill the process using port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### Module Not Found Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Seed Data Not Loading

- Check that `backend/database/members_setup.sql` exists
- Verify MySQL user has CREATE/INSERT permissions
- Check backend logs for migration errors
- Manually run: `source backend/database/schema.sql;` in MySQL CLI

### Frontend Not Communicating with Backend

- Verify backend is running on correct port
- Check browser console for CORS errors
- Ensure API URLs in frontend JavaScript match backend server
- Check `.env` PORT setting matches frontend configuration

## Notes

- **Security:** Never commit `.env` files or credentials to version control
- **Development:** Use `nodemon` for automatic server reload during development
- **Database:** Automated migrations run on server startup; manual SQL files available for custom adjustments
- **Port:** Default port is 3000; change via `PORT` in `.env` file

## Documentation

The following documentation files provide detailed information:

- **[SRS.md](./SRS.md)** — Software Requirements Specification with functional and non-functional requirements
- **[Database_Design_Report.md](./Database_Design_Report.md)** — Entity-Relationship model, relational schema, and normalization analysis
- **[backend/database/schema.sql](./backend/database/schema.sql)** — Complete database table definitions and constraints
- **[backend/database/query.sql](./backend/database/query.sql)** — Sample queries for database exploration

## Contributing

Contributions are welcome! Areas for enhancement:

- **Frontend:** Add new pages, improve UI/UX, enhance form validation
- **Backend:** Extend APIs, add business logic, implement new features
- **Database:** Optimize queries, refactor schema, add indexes for performance
- **Documentation:** Improve guides, add API examples, clarify processes

**Guidelines:**
1. Keep code well-commented and organized
2. Update documentation to reflect structural changes
3. Test functionality locally before submitting
4. Follow existing code style and conventions

## License

This project is intended for academic use and portfolio demonstration.
