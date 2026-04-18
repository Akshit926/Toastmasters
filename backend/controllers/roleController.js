const db = require('../config/db');
const { sendRoleNotificationEmail } = require('../services/emailService');

// ── POST /api/roles/allocate ──────────────────────────────────────────────────
exports.allocateRole = async (req, res) => {
    const { member_name, role_name, meeting_date } = req.body;
    if (!member_name || !role_name || !meeting_date) {
        return res.status(400).json({ error: 'member_name, role_name, and meeting_date are required' });
    }
    try {
        const spaceIndex = member_name.indexOf(' ');
        const first_name = spaceIndex !== -1 ? member_name.substring(0, spaceIndex) : member_name;
        const last_name  = spaceIndex !== -1 ? member_name.substring(spaceIndex + 1).trim() : 'Unknown';

        let [memberRows] = await db.execute(
            'SELECT id FROM members WHERE first_name = ? AND last_name = ?',
            [first_name, last_name]
        );
        let member_id;
        if (memberRows.length === 0) {
            const [result] = await db.execute(
                'INSERT INTO members (first_name, last_name, email) VALUES (?, ?, ?)',
                [first_name, last_name, `${first_name.toLowerCase().replace(/\s/g,'')}@toastmasters.local`]
            );
            member_id = result.insertId;
        } else {
            member_id = memberRows[0].id;
        }

        let [roleRows] = await db.execute('SELECT id FROM roles WHERE role_name = ?', [role_name]);
        let role_id;
        if (roleRows.length === 0) {
            const [result] = await db.execute('INSERT INTO roles (role_name) VALUES (?)', [role_name]);
            role_id = result.insertId;
        } else {
            role_id = roleRows[0].id;
        }

        // Check if already allocated for this meeting
        const [existing] = await db.execute(
            'SELECT id, status FROM member_roles WHERE role_id = ? AND meeting_date = ? AND status IN ("Pending_Allocation","Assigned")',
            [role_id, meeting_date]
        );
        if (existing.length > 0) {
            return res.status(409).json({ error: 'This role is already taken or pending for this meeting date.' });
        }

        const [ins] = await db.execute(
            'INSERT INTO member_roles (member_id, role_id, meeting_date, status) VALUES (?, ?, ?, ?)',
            [member_id, role_id, meeting_date, 'Pending_Allocation']
        );

        await sendRoleNotificationEmail(member_name, role_name, 'Allocated', meeting_date, member_id, role_id, ins.insertId);
        res.status(201).json({ message: 'Role request submitted! Admin approval pending.', id: ins.insertId });
    } catch (error) {
        console.error('allocateRole error:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

// ── POST /api/roles/cancel ────────────────────────────────────────────────────
exports.cancelRole = async (req, res) => {
    const { member_name, role_name, meeting_date, cancel_reason } = req.body;
    try {
        const spaceIndex = member_name.indexOf(' ');
        const first_name = spaceIndex !== -1 ? member_name.substring(0, spaceIndex) : member_name;
        const last_name  = spaceIndex !== -1 ? member_name.substring(spaceIndex + 1).trim() : 'Unknown';

        let [memberRows] = await db.execute(
            'SELECT id FROM members WHERE first_name = ? AND last_name = ?',
            [first_name, last_name]
        );
        let member_id = memberRows.length > 0 ? memberRows[0].id : null;

        let [roleRows] = await db.execute('SELECT id FROM roles WHERE role_name = ?', [role_name]);
        let role_id = roleRows.length > 0 ? roleRows[0].id : null;

        if (member_id && role_id) {
            await db.execute(
                'UPDATE member_roles SET status = "Pending_Cancel", cancel_reason = ? WHERE member_id = ? AND role_id = ? AND meeting_date = ?',
                [cancel_reason || null, member_id, role_id, meeting_date]
            );
        }

        await sendRoleNotificationEmail(member_name, role_name, 'Cancelled', meeting_date, member_id, role_id, null, cancel_reason);
        res.status(200).json({ message: 'Cancellation request submitted! Admin approval pending.' });
    } catch (error) {
        console.error('cancelRole error:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

// ── GET /api/roles/all — Admin dashboard ─────────────────────────────────────
exports.getAllRoles = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT
                mr.id,
                mr.member_id,
                mr.role_id,
                CONCAT(m.first_name, ' ', m.last_name) AS member_name,
                cm.customer_id,
                r.role_name,
                DATE_FORMAT(mr.meeting_date, '%Y-%m-%d') AS meeting_date,
                mr.status,
                mr.cancel_reason,
                mr.created_at
            FROM member_roles mr
            JOIN  members m  ON mr.member_id = m.id
            JOIN  roles   r  ON mr.role_id   = r.id
            LEFT JOIN club_members cm
                   ON cm.member_name LIKE CONCAT(m.first_name, ' %')
                   OR cm.member_name = CONCAT(m.first_name, ' ', m.last_name)
            ORDER BY mr.meeting_date DESC, mr.created_at DESC
        `);
        res.json(rows);
    } catch (e) {
        console.error('getAllRoles error:', e);
        res.status(500).json({ error: 'Database error' });
    }
};

// ── PATCH /api/roles/approve-allocate (dashboard) / GET (email link) ─────────
exports.approveAllocate = async (req, res) => {
    const params = req.method === 'PATCH' ? req.body : req.query;
    const { member_id, role_id, meeting_date } = params;
    try {
        await db.execute(
            'UPDATE member_roles SET status = "Assigned", cancel_reason = NULL WHERE member_id = ? AND role_id = ? AND meeting_date = ?',
            [member_id, role_id, meeting_date]
        );
        if (req.method === 'PATCH') {
            return res.json({ success: true, message: 'Role approved' });
        }
        res.status(200).send(emailPage('✅ Role Allocation Approved!', '#004165',
            'Status updated to <strong>Assigned</strong>. The member has been confirmed for this role.'));
    } catch (e) {
        console.error('approveAllocate error:', e);
        if (req.method === 'PATCH') return res.status(500).json({ error: 'Database error' });
        res.status(500).send('Database Update Failed');
    }
};

// ── PATCH /api/roles/approve-cancel (dashboard) / GET (email link) ───────────
exports.approveCancel = async (req, res) => {
    const params = req.method === 'PATCH' ? req.body : req.query;
    const { member_id, role_id, meeting_date } = params;
    try {
        await db.execute(
            'UPDATE member_roles SET status = "Cancelled" WHERE member_id = ? AND role_id = ? AND meeting_date = ?',
            [member_id, role_id, meeting_date]
        );
        if (req.method === 'PATCH') {
            return res.json({ success: true, message: 'Cancellation approved' });
        }
        res.status(200).send(emailPage('✅ Cancellation Confirmed!', '#772432',
            'Status updated to <strong>Cancelled</strong>. The role is now available again.'));
    } catch (e) {
        console.error('approveCancel error:', e);
        if (req.method === 'PATCH') return res.status(500).json({ error: 'Database error' });
        res.status(500).send('Database Update Failed');
    }
};

// ── PATCH /api/roles/reject-allocate — Reject with reason ─────────────────────
exports.rejectAllocate = async (req, res) => {
    const params = req.method === 'PATCH' ? req.body : req.query;
    const { member_id, role_id, meeting_date, reason } = params;
    try {
        await db.execute(
            'UPDATE member_roles SET status = "Cancelled", cancel_reason = ? WHERE member_id = ? AND role_id = ? AND meeting_date = ?',
            [reason || 'Rejected by admin', member_id, role_id, meeting_date]
        );
        if (req.method === 'PATCH') {
            return res.json({ success: true, message: 'Allocation rejected' });
        }
        res.status(200).send(emailPage('✗ Role Request Rejected', '#b94a48',
            `Status updated to <strong>Cancelled</strong>. Reason: ${reason || 'Rejected by admin'}`));
    } catch (e) {
        console.error('rejectAllocate error:', e);
        if (req.method === 'PATCH') return res.status(500).json({ error: 'Database error' });
        res.status(500).send('Database Update Failed');
    }
};

// ── DELETE /api/roles/:id — Hard delete a role assignment ────────────────────
exports.deleteRole = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute('DELETE FROM member_roles WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Role assignment not found' });
        res.json({ success: true, message: 'Role assignment deleted' });
    } catch (e) {
        console.error('deleteRole error:', e);
        res.status(500).json({ error: 'Database error' });
    }
};

// ── Helper: nice HTML page for email one-click links ─────────────────────────
function emailPage(title, color, body) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>body{font-family:sans-serif;background:#f5f5f5;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
    .card{background:#fff;border-radius:16px;padding:48px;text-align:center;max-width:500px;box-shadow:0 4px 20px rgba(0,0,0,.1)}
    h1{color:${color};font-size:1.8rem;margin-bottom:16px}p{color:#555;line-height:1.6}
    a{display:inline-block;margin-top:24px;padding:12px 24px;background:${color};color:#fff;border-radius:8px;text-decoration:none;font-weight:600}
    </style></head><body><div class="card">
      <h1>${title}</h1><p>${body}</p>
      <p style="color:#999;font-size:.85rem;margin-top:16px">You can close this window.</p>
    </div></body></html>`;
}
