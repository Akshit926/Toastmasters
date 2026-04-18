# Mini Project Report

## Wakad Toastmasters Platform

### Submitted By

Group Members:

1. ______________________________
2. ______________________________
3. ______________________________
4. ______________________________

### Guided By

______________________________

### Academic Year

2025-2026

---

## Certificate

This is to certify that the mini project titled **"Wakad Toastmasters Platform"** has been successfully designed and developed by the above-mentioned students as a part of the database application mini project requirement.

The project includes database design, entity relationship modeling, relational schema design, normalization, frontend development, backend development, and database connectivity.

---

## Acknowledgement

We would like to express our sincere gratitude to our project guide and faculty members for their continuous support, guidance, and encouragement throughout the development of this mini project.

We also thank our classmates and users who helped us understand the requirements of a Toastmasters club management platform. Their feedback helped us improve the usability and functionality of the system.

---

## Abstract

The **Wakad Toastmasters Platform** is a database-driven web application designed to support the activities of a Toastmasters club. The system provides information about the club, enables new member registration, manages contact form submissions, maintains club member data, and supports meeting role allocation with admin approval.

The frontend is developed using HTML, CSS, and JavaScript. The backend is implemented using Node.js and Express.js. MySQL is used as the database, and database connectivity is handled using the `mysql2/promise` driver. The application stores structured data such as member details, club member records, meeting roles, role allocation requests, cancellation requests, and contact messages.

The project demonstrates the complete flow of a database application, including ER modeling, relational model design, normalization, CRUD operations, API development, and frontend-backend-database integration.

---

## 1. Introduction

Toastmasters clubs conduct regular meetings where members perform different roles such as Toastmaster of the Day, Timer, Grammarian, Ah-Counter, Speaker, Evaluator, and General Evaluator. Managing these roles manually can become repetitive and difficult, especially when role requests, cancellations, and member records need to be tracked.

The Wakad Toastmasters Platform solves this problem by providing a centralized web application for club information, member registration, contact handling, role allocation, and admin review.

## 2. Problem Statement

To design and develop a database application for a Toastmasters club that allows users to:

- View club information and meeting details.
- Register as a member.
- Submit contact queries.
- View and request meeting roles.
- Cancel requested or assigned roles.
- Allow admins to approve, reject, or delete role allocation records.
- Maintain a database of club members and meeting role assignments.

## 3. Objectives

- To design an Entity Relationship Model for the Toastmasters platform.
- To convert the ER model into a relational database schema.
- To normalize the database design and reduce redundancy.
- To develop a responsive frontend using HTML, CSS, and JavaScript.
- To develop backend APIs using Node.js and Express.js.
- To connect the backend with MySQL using `mysql2/promise`.
- To perform CRUD operations on member, contact, club member, and role data.
- To prepare a complete project report.

## 4. Scope of the Project

The scope of this project includes:

- Public website for Toastmasters club information.
- Member registration form.
- Contact form submission.
- Role allocation request system.
- Role cancellation request system.
- Admin dashboard for role approval and rejection.
- Club member login using customer ID.
- Club member data management.
- CSV upload support for club members.
- Email notification support through Nodemailer.

The current system is suitable for a club-level database application and can be extended in the future with authentication, authorization, dashboards, reports, and deployment.

---

## 5. Technology Used

| Layer | Technology |
| --- | --- |
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Database Connectivity | `mysql2/promise` Node.js driver |
| API Format | REST API with JSON |
| Email Service | Nodemailer |
| File Upload / CSV Handling | Multer, csv-parser |
| Environment Configuration | dotenv |
| Development Tool | Nodemon |

---

## 6. System Requirements

### 6.1 Hardware Requirements

- Processor: Intel i3 or above
- RAM: 4 GB or above
- Hard Disk: Minimum 500 MB free space
- Internet connection for package installation and email service configuration

### 6.2 Software Requirements

- Operating System: Windows / Linux / macOS
- Browser: Chrome, Edge, Firefox, or Safari
- Node.js
- MySQL Server
- Visual Studio Code
- npm package manager

---

## 7. System Architecture

The application follows a three-tier architecture:

1. **Presentation Layer**
   - Static HTML pages styled with CSS.
   - JavaScript handles form submissions, API calls, and UI behavior.

2. **Application Layer**
   - Node.js and Express.js backend.
   - REST APIs process frontend requests.
   - Controllers contain business logic for registration, contacts, roles, and club members.

3. **Database Layer**
   - MySQL stores persistent application data.
   - Tables are created and seeded through SQL scripts and migration code.
   - Database connectivity is handled using a MySQL connection pool.

### Architecture Flow

```text
User Browser
    |
    | HTML/CSS/JavaScript
    v
Frontend Pages
    |
    | REST API Requests
    v
Node.js + Express.js Backend
    |
    | mysql2/promise
    v
MySQL Database
```

---

## 8. Modules

### 8.1 Home / Public Information Module

This module displays club information, meeting details, club story, Toastmasters information, and navigation links to other pages.

### 8.2 Member Registration Module

This module allows users to submit registration details such as name, email, phone number, introduction, reason for joining, source, preferred role, and queries.

### 8.3 Contact Module

This module allows visitors to submit contact messages. The data is stored in the `contacts` table and can be retrieved by the backend.

### 8.4 Role Allocation Module

This module allows members to request a Toastmasters meeting role for a specific meeting date. The request is initially stored with the status `Pending_Allocation`.

### 8.5 Role Cancellation Module

This module allows members to request cancellation of a role. The status is changed to `Pending_Cancel` until admin approval.

### 8.6 Admin Role Management Module

The admin can view all role assignments, approve role allocations, approve cancellations, reject allocation requests, and delete role assignment records.

### 8.7 Club Member Management Module

This module stores official club member records with customer IDs. It supports adding, updating, deleting, viewing, CSV upload, and login using customer ID.

### 8.8 Email Notification Module

The system uses Nodemailer to send notifications for registration, contact submissions, role allocation, and role cancellation activities.

---

## 9. Entity Relationship Model

### 9.1 Entities

The main entities in the system are:

- **Member**
- **Contact**
- **Role**
- **MemberRole**
- **ClubMember**

### 9.2 Entity Description

#### Member

Stores details of users who register or request roles.

Attributes:

- `id`
- `first_name`
- `last_name`
- `email`
- `phone`
- `introduction`
- `why_join`
- `source`
- `preferred_role`
- `queries`
- `created_at`

#### Contact

Stores messages submitted through the contact form.

Attributes:

- `id`
- `name`
- `email`
- `message`
- `created_at`

#### Role

Stores standard Toastmasters meeting roles.

Attributes:

- `id`
- `role_name`

#### MemberRole

Acts as a mapping table between members and roles. It stores the role assigned/requested by a member for a particular meeting date.

Attributes:

- `id`
- `member_id`
- `role_id`
- `meeting_date`
- `status`
- `cancel_reason`
- `created_at`

#### ClubMember

Stores official Toastmasters club members and their customer IDs.

Attributes:

- `id`
- `customer_id`
- `member_name`
- `created_at`

### 9.3 Relationships

| Relationship | Type | Description |
| --- | --- | --- |
| Member to MemberRole | One-to-Many | One member can request or perform many meeting roles. |
| Role to MemberRole | One-to-Many | One role can appear in many meetings and assignment records. |
| Member and Role | Many-to-Many | Implemented through the `member_roles` mapping table. |
| ClubMember to MemberRole | Logical relationship | Club member data is matched with member records for login and dashboard information. |
| Contact | Independent | Contact messages are stored separately from member and role data. |

### 9.4 ER Diagram

```text
+----------------+          +---------------------+          +----------------+
|    members     |          |    member_roles     |          |     roles      |
+----------------+          +---------------------+          +----------------+
| PK id          |<-------- | FK member_id        | -------->| PK id          |
| first_name     |          | FK role_id          |          | role_name      |
| last_name      |          | meeting_date        |          +----------------+
| email          |          | status              |
| phone          |          | cancel_reason       |
| introduction   |          | created_at          |
| why_join       |          +---------------------+
| source         |
| preferred_role |
| queries        |
| created_at     |
+----------------+

+----------------+
|    contacts    |
+----------------+
| PK id          |
| name           |
| email          |
| message        |
| created_at     |
+----------------+

+----------------+
|  club_members  |
+----------------+
| PK id          |
| customer_id    |
| member_name    |
| created_at     |
+----------------+
```

---

## 10. Relational Model

### 10.1 Relations

#### MEMBERS

```text
MEMBERS(id, first_name, last_name, email, phone, introduction,
        why_join, source, preferred_role, queries, created_at)
```

Primary Key:

- `id`

Candidate Key:

- `email`

#### CONTACTS

```text
CONTACTS(id, name, email, message, created_at)
```

Primary Key:

- `id`

#### ROLES

```text
ROLES(id, role_name)
```

Primary Key:

- `id`

Candidate Key:

- `role_name`

#### MEMBER_ROLES

```text
MEMBER_ROLES(id, member_id, role_id, meeting_date, status,
             cancel_reason, created_at)
```

Primary Key:

- `id`

Foreign Keys:

- `member_id` references `MEMBERS(id)`
- `role_id` references `ROLES(id)`

#### CLUB_MEMBERS

```text
CLUB_MEMBERS(id, customer_id, member_name, created_at)
```

Primary Key:

- `id`

Candidate Key:

- `customer_id`

---

## 11. Database Schema

### 11.1 Members Table

```sql
CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    introduction TEXT,
    why_join TEXT,
    source VARCHAR(255),
    preferred_role VARCHAR(100),
    queries TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 11.2 Contacts Table

```sql
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 11.3 Roles Table

```sql
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE
);
```

### 11.4 Member Roles Table

```sql
CREATE TABLE member_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    role_id INT NOT NULL,
    meeting_date DATE NOT NULL,
    status ENUM(
        'Pending_Allocation',
        'Assigned',
        'Pending_Cancel',
        'Cancelled'
    ) DEFAULT 'Pending_Allocation',
    cancel_reason TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
```

### 11.5 Club Members Table

```sql
CREATE TABLE club_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL UNIQUE,
    member_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 12. Database Normalization

Normalization is used to organize data efficiently, reduce redundancy, and maintain data integrity.

### 12.1 First Normal Form

A relation is in First Normal Form when:

- Each table has a primary key.
- Each column stores atomic values.
- Repeating groups are removed.

The database satisfies 1NF because each table has a primary key and each field stores a single value. For example, `first_name`, `last_name`, `email`, and `phone` are stored as separate atomic attributes in the `members` table.

### 12.2 Second Normal Form

A relation is in Second Normal Form when:

- It is already in 1NF.
- All non-key attributes depend on the complete primary key.

The database satisfies 2NF because tables use single-column primary keys such as `id`. Non-key attributes depend fully on the primary key of their respective table. The mapping between members and roles is separated into `member_roles`, which prevents storing multiple role fields inside the `members` table.

### 12.3 Third Normal Form

A relation is in Third Normal Form when:

- It is already in 2NF.
- There are no transitive dependencies.

The database satisfies 3NF because role names are stored in the `roles` table and member details are stored in the `members` table. The `member_roles` table stores only foreign keys and assignment-specific data such as meeting date, status, and cancellation reason. This avoids duplication of member names and role names in every role allocation record.

### 12.4 Normalization Summary

| Table | Normal Form | Reason |
| --- | --- | --- |
| members | 3NF | Member details are stored independently with unique email. |
| contacts | 3NF | Contact messages are independent records. |
| roles | 3NF | Role names are stored once and referenced by ID. |
| member_roles | 3NF | Resolves many-to-many relation between members and roles. |
| club_members | 3NF | Club customer IDs are stored independently and uniquely. |

---

## 13. Backend Design

The backend is developed using Node.js and Express.js. The server is defined in `backend/server.js`.

### 13.1 Main Backend Features

- Express server setup.
- CORS enabled for frontend access.
- JSON request body parsing.
- MySQL connection pool.
- REST API routes.
- Database migration on server startup.
- Email notification service.

### 13.2 API Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/members/register` | Register a new member. |
| GET | `/api/members` | Fetch registered members. |
| POST | `/api/contacts` | Submit contact form. |
| GET | `/api/contacts` | Fetch contact messages. |
| POST | `/api/roles/allocate` | Request role allocation. |
| POST | `/api/roles/cancel` | Request role cancellation. |
| GET | `/api/roles/all` | Fetch all role assignments for admin dashboard. |
| PATCH | `/api/roles/approve-allocate` | Approve a role allocation. |
| PATCH | `/api/roles/approve-cancel` | Approve a cancellation request. |
| PATCH | `/api/roles/reject-allocate` | Reject a role allocation request. |
| DELETE | `/api/roles/:id` | Delete a role assignment. |
| GET | `/api/club-members` | Fetch club members. |
| POST | `/api/club-members` | Add a club member. |
| PUT | `/api/club-members/:id` | Update a club member. |
| DELETE | `/api/club-members/:id` | Delete a club member. |
| POST | `/api/club-members/upload/csv` | Upload club member CSV. |
| POST | `/api/club-members/auth/login` | Login using customer ID. |

---

## 14. Database Connectivity

The project uses the `mysql2/promise` package for database connectivity.

The connection pool is created using environment variables:

```javascript
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
```

This approach improves performance because multiple database requests can reuse connections from the pool instead of creating a new connection for every query.

---

## 15. Frontend Design

The frontend is created using HTML, CSS, and JavaScript.

### 15.1 Frontend Pages

| File | Purpose |
| --- | --- |
| `index.html` | Main landing page and club information. |
| `form.html` | Member registration form. |
| `roles.html` | Role allocation interface. |
| `admin.html` | Admin dashboard. |
| `member.html` | Member login/details page. |
| `what-to-expect.html` | Educational page about Toastmasters meetings. |

### 15.2 Frontend Features

- Responsive user interface.
- Registration form validation and submission.
- Contact and query handling.
- Role allocation and cancellation requests.
- Admin dashboard interaction.
- Member login using customer ID.
- Light and dark themed styling.

---

## 16. Data Flow

### 16.1 Member Registration Flow

```text
User fills registration form
    |
Frontend sends POST request to /api/members/register
    |
Backend validates and inserts data into members table
    |
Email notification is triggered
    |
Response is sent back to frontend
```

### 16.2 Role Allocation Flow

```text
Member selects role and meeting date
    |
Frontend sends POST request to /api/roles/allocate
    |
Backend checks member and role
    |
Backend checks if role is already taken or pending
    |
Record is inserted into member_roles with Pending_Allocation status
    |
Admin can approve or reject request
```

### 16.3 Cancellation Flow

```text
Member requests cancellation
    |
Backend updates assignment status to Pending_Cancel
    |
Admin approves cancellation
    |
Status becomes Cancelled
```

---

## 17. Sample SQL Queries

### 17.1 Insert a New Role

```sql
INSERT INTO roles (role_name)
VALUES ('Timer');
```

### 17.2 Register a Member

```sql
INSERT INTO members
(first_name, last_name, email, phone, preferred_role)
VALUES
('Akshit', 'Agarwal', 'akshit@example.com', '9876543210', 'Speaker');
```

### 17.3 Fetch All Role Assignments

```sql
SELECT
    mr.id,
    CONCAT(m.first_name, ' ', m.last_name) AS member_name,
    r.role_name,
    mr.meeting_date,
    mr.status
FROM member_roles mr
JOIN members m ON mr.member_id = m.id
JOIN roles r ON mr.role_id = r.id
ORDER BY mr.meeting_date DESC;
```

### 17.4 Fetch Club Members

```sql
SELECT * FROM club_members
ORDER BY member_name ASC;
```

---

## 18. Testing

### 18.1 Manual Testing

| Test Case | Expected Result |
| --- | --- |
| Submit valid registration form | Member is inserted into database. |
| Submit duplicate email | System shows duplicate email error. |
| Submit contact form | Contact message is stored. |
| Allocate available role | Request is stored as `Pending_Allocation`. |
| Allocate already pending role | System returns conflict error. |
| Cancel assigned role | Request is stored as `Pending_Cancel`. |
| Approve allocation from admin dashboard | Status changes to `Assigned`. |
| Approve cancellation | Status changes to `Cancelled`. |
| Login with valid customer ID | Member details are displayed. |
| Login with invalid customer ID | Error message is displayed. |

### 18.2 Validation

- Required fields are checked in backend controllers.
- Duplicate emails are handled using the unique constraint on `members.email`.
- Duplicate customer IDs are handled using the unique constraint on `club_members.customer_id`.
- Foreign key constraints maintain relationship integrity between `members`, `roles`, and `member_roles`.

---

## 19. Advantages

- Reduces manual work in managing meeting roles.
- Stores member and contact data in a structured database.
- Supports admin approval for role allocation and cancellation.
- Uses normalized tables to reduce duplication.
- Provides a responsive frontend.
- Can be expanded for production use.

---

## 20. Limitations

- Full authentication and authorization are not implemented for all users.
- Role allocation currently depends on entered member names.
- Deployment configuration is not included in the current project.
- Advanced reporting and analytics are not included.

---

## 21. Future Enhancements

- Add secure login for admins and members.
- Add JWT-based authentication.
- Add password-protected admin dashboard.
- Add meeting creation and scheduling module.
- Add reports for role history and member participation.
- Add production deployment using cloud hosting.
- Add automated frontend and backend tests.
- Add notification templates for different email types.

---

## 22. Conclusion

The Wakad Toastmasters Platform successfully demonstrates the design and development of a database application. The project includes frontend pages, backend APIs, MySQL database connectivity, normalized database tables, role allocation workflow, member registration, contact management, and club member management.

The system satisfies the mini project requirements by covering Entity Relationship Model design, relational model design, database normalization, frontend development, backend development, database connectivity, and project report preparation.

---

## 23. References

- Node.js Documentation
- Express.js Documentation
- MySQL Documentation
- mysql2 npm package documentation
- Toastmasters role and meeting workflow concepts
