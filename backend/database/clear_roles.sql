-- ================================================
-- Run this ONCE in MySQL Workbench to clear test data
-- ================================================
USE toastmasters_db;

-- Clear all role assignment test data
DELETE FROM member_roles;

-- Also add cancel_reason column if it doesn't exist
ALTER TABLE member_roles 
    ADD COLUMN IF NOT EXISTS cancel_reason TEXT DEFAULT NULL AFTER status;

-- Verify
SELECT COUNT(*) AS remaining_rows FROM member_roles;
SELECT 'Done! member_roles cleared and schema updated.' AS status;
