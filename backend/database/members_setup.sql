USE toastmasters_db;

-- Create clean table for dashboard
CREATE TABLE IF NOT EXISTS club_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL UNIQUE,
    member_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert members
INSERT IGNORE INTO club_members (customer_id, member_name) VALUES
('PN-67917471', 'Vishal N. Shroff'),
('PN-67640856', 'Sanjay Zende'),
('PN-67679304', 'Madhumita Mohanty'),
('PN-05112998', 'Varghese Vattathara'),
('PN-67798070', 'Sachin U. Shrimandale'),
('PN-67940588', 'Alok Priyadarshi'),
('PN-67795418', 'Rohit Srivastava'),
('PN-67903641', 'Anil Kumar Sisodiya'),
('PN-67981963', 'Aarrit K. Tak'),
('PN-67909513', 'Alka Gawhade'),
('PN-67632772', 'Rahul Nandurkar'),
('PN-67940870', 'Rahul Sreekumar'),
('PN-67846902', 'Krushna Dhakne'),
('PN-06910190', 'Dinesh P. Chaudhari'),
('PN-67514406', 'Punit Hadani'),
('PN-67795382', 'Ankana Saumya'),
('PN-67778166', 'Ravikant Gawhade'),
('PN-67602787', 'Sandeep Dharmapurkar'),
('PN-67801863', 'Sugeesh Sugathan'),
('PN-67807513', 'Shashank Agarwal'),
('PN-07498085', 'Vaibhav S. Chouhan'),
('PN-67656411', 'Sanjai Pathak'),
('PN-67578553', 'Sushil K. Sharma'),
('PN-67927180', 'Akshit Agarwal'),
('PN-67994103', 'Kundan Kumar'),
('PN-67882879', 'Prachi Lendghar'),
('PN-67887482', 'Ulhas Khirwadkar'),
('PN-67927181', 'Aditya Modi'),
('PN-07690915', 'Kailashnath D. Pawar'),
('PN-68029308', 'Ashish Gupta'),
('PN-67729974', 'Deepak Ratnaparkhi'),
('PN-68021690', 'Manish Jha'),
('PN-68040650', 'Sourabh Saware'),
('PN-68040648', 'Sumit Agrawal'),
('PN-68010897', 'Milap P. Tank'),
('PN-68046248', 'Umesh Kute');

-- Verify
SELECT COUNT(*) FROM club_members;
SELECT * FROM club_members ORDER BY member_name;