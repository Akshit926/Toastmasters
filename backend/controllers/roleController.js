const db = require('../config/db');
const { sendRoleNotificationEmail } = require('../services/emailService');

exports.allocateRole = async (req, res) => {
    const { member_name, role_name, meeting_date } = req.body;
    try {
        const spaceIndex = member_name.indexOf(' ');
        const first_name = spaceIndex !== -1 ? member_name.substring(0, spaceIndex) : member_name;
        const last_name = spaceIndex !== -1 ? member_name.substring(spaceIndex + 1).trim() : 'Unknown';
        
        let [memberRows] = await db.execute('SELECT id FROM members WHERE first_name = ? AND last_name = ?', [first_name, last_name]);
        let member_id;
        if(memberRows.length === 0) {
            const [result] = await db.execute('INSERT INTO members (first_name, last_name, email) VALUES (?, ?, ?)', [first_name, last_name, `${first_name.replace(' ','')}@example.com`]);
            member_id = result.insertId;
        } else {
            member_id = memberRows[0].id;
        }

        let [roleRows] = await db.execute('SELECT id FROM roles WHERE role_name = ?', [role_name]);
        let role_id;
        if(roleRows.length === 0) {
           const [result] = await db.execute('INSERT INTO roles (role_name) VALUES (?)', [role_name]);
           role_id = result.insertId;
        } else {
            role_id = roleRows[0].id;
        }

        await db.execute(
            'INSERT INTO member_roles (member_id, role_id, meeting_date, status) VALUES (?, ?, ?, ?)',
            [member_id, role_id, meeting_date, 'Pending_Allocation']
        );

        await sendRoleNotificationEmail(member_name, role_name, 'Assigned', meeting_date, member_id, role_id);
        res.status(201).json({ message: 'Role allocation pending admin approval' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.cancelRole = async (req, res) => {
    const { member_name, role_name, meeting_date } = req.body;
    try {
        const spaceIndex = member_name.indexOf(' ');
        const first_name = spaceIndex !== -1 ? member_name.substring(0, spaceIndex) : member_name;
        const last_name = spaceIndex !== -1 ? member_name.substring(spaceIndex + 1).trim() : 'Unknown';
        
        let [memberRows] = await db.execute('SELECT id FROM members WHERE first_name = ? AND last_name = ?', [first_name, last_name]);
        let member_id = memberRows.length > 0 ? memberRows[0].id : null;
        
        let [roleRows] = await db.execute('SELECT id FROM roles WHERE role_name = ?', [role_name]);
        let role_id = roleRows.length > 0 ? roleRows[0].id : null;
        
        if (member_id && role_id) {
            await db.execute('UPDATE member_roles SET status = "Pending_Cancel" WHERE member_id=? AND role_id=? AND meeting_date=?', [member_id, role_id, meeting_date]);
        }

        await sendRoleNotificationEmail(member_name, role_name, 'Cancelled', meeting_date, member_id, role_id);
        res.status(200).json({ message: 'Role cancellation pending admin approval' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.approveAllocate = async (req, res) => {
    const { member_id, role_id, meeting_date } = req.query;
    try {
        await db.execute('UPDATE member_roles SET status = "Assigned" WHERE member_id=? AND role_id=? AND meeting_date=?', [member_id, role_id, meeting_date]);
        res.status(200).send('<div style="text-align:center; margin-top:100px; font-family:sans-serif;"><h1 style="color:#004165;">✅ Role Allocation Approved!</h1><p style="color:#666;">The database status has been updated to Assigned. You can close this window securely.</p></div>');
    } catch(e) {
        console.error(e);
        res.status(500).send("Database Update Failed");
    }
};

exports.approveCancel = async (req, res) => {
    const { member_id, role_id, meeting_date } = req.query;
    try {
        await db.execute('UPDATE member_roles SET status = "Cancelled" WHERE member_id=? AND role_id=? AND meeting_date=?', [member_id, role_id, meeting_date]);
        res.status(200).send('<div style="text-align:center; margin-top:100px; font-family:sans-serif;"><h1 style="color:#772432;">✅ Role Cancellation Approved!</h1><p style="color:#666;">The database status has been updated to Cancelled. You can close this window securely.</p></div>');
    } catch(e) {
        console.error(e);
        res.status(500).send("Database Update Failed");
    }
};
