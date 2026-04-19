CREATE DATABASE wakad_toastmasters;
USE wakad_toastmasters;
CREATE DATABASE IF NOT EXISTS toastmasters_db;
USE toastmasters_db;

-- 1. Members Table
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Contacts Table (for Contact Form Submissions)
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Roles Table (Static roles available to be booked)
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE
);

-- 4. Member_Roles Mapping Table (Tracks who is doing what and when)
CREATE TABLE IF NOT EXISTS member_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    role_id INT NOT NULL,
    meeting_date DATE NOT NULL,
    status ENUM('Assigned', 'Cancelled') DEFAULT 'Assigned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Insert standard Toastmasters roles
INSERT IGNORE INTO roles (role_name) VALUES 
('Toastmaster of the Day'), 
('General Evaluator'), 
('Ah-Counter'), 
('Grammarian'), 
('Timer'), 
('Speaker'), 
('Evaluator');
ALTER TABLE members 
ADD COLUMN introduction TEXT, 
ADD COLUMN why_join TEXT, 
ADD COLUMN source VARCHAR(255), 
ADD COLUMN preferred_role VARCHAR(100), 
ADD COLUMN queries TEXT;

ALTER TABLE member_roles MODIFY COLUMN status VARCHAR(50) DEFAULT 'Assigned';


