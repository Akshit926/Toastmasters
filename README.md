# Wakad Toastmasters Platform

## Overview

Wakad Toastmasters Platform is a club management web application built for the Wakad Toastmasters community. The system provides a lightweight member registration flow, meeting role coordination, contact message tracking, and static informational pages for club visitors.

## Key Capabilities

- Register and store member interest details
- Collect contact form submissions
- Allocate Toastmasters meeting roles with status tracking
- Seed existing club membership data for dashboard use
- Provide informational pages for guests and members

## Architecture

The repository is split into frontend and backend components:

- `frontend/` — Static website pages and client-side logic
- `backend/` — Express API server with database integration
- `backend/database/` — SQL schema, migration, and seed scripts
- `SRS.md` — Requirements specification
- `Database_Design_Report.md` — Database model and normalization documentation

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MySQL via `mysql2`
- Supporting libraries: `cors`, `dotenv`, `nodemailer`, `multer`

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

- Node.js 18 or newer
- MySQL server running locally or remotely
- Optional: `nodemon` for development

## Setup and Run

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure the Environment

Create a configuration file in the project root for database connection and optional email delivery settings. This file should include only the necessary key names and values, and must not contain any credentials in source control.

The backend reads configuration from `process.env` using `dotenv` in `backend/config/db.js`.

### 3. Start the Backend

```bash
npm start
```

For development with automatic reload:

```bash
npm run dev
```

### 4. Initialize the Database

The backend runs a migration script when it starts. That script prepares the club member seed data and ensures the required tables exist.

If you want to run the SQL files manually, use:

- `backend/database/schema.sql` — core database schema
- `backend/database/members_setup.sql` — initial club members seed data
- `backend/database/clear_roles.sql` — reset role assignment test data

## Frontend Usage

The frontend is static and can be opened directly in a browser.

Recommended entry page:
- `frontend/index.html`

Other pages:
- `frontend/form.html` — member registration form
- `frontend/roles.html` — role allocation interface
- `frontend/member.html` — member details view
- `frontend/what-to-expect.html` — club meeting guidance

## Backend API Endpoints

- `GET /api/members` — List all registered members
- `POST /api/members` — Register a new member
- `GET /api/contacts` — Retrieve contact messages
- `POST /api/contacts` — Submit a contact message
- `GET /api/roles` — List meeting roles and status
- `POST /api/roles/allocate` — Allocate a role for a member
- `GET /api/club-members` — List seeded club members

## Database Behavior

- `members` stores registration data and member preferences
- `roles` stores available role names
- `member_roles` links members to roles by meeting date
- Foreign keys enforce referential integrity between tables
- Role statuses are managed with an ENUM workflow

## Notes

- Do not store real credentials in repository files.
- Use the database schema and migration scripts in `backend/database/` for manual adjustments.
- `backend/server.js` automatically starts the migration process and listens on the configured port.

## Useful Documentation

- `SRS.md` — Functional and non-functional requirements
- `Database_Design_Report.md` — ER model, relational schema, and normalization analysis
- `backend/database/schema.sql` — Database table definitions

## Contribution

Contributions can be made by extending frontend pages, improving backend APIs, or enhancing database design. Please keep documentation aligned with any structural changes.

## License

This project is intended for academic use and portfolio demonstration.
