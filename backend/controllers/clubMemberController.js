const db  = require('../config/db');
const csv = require('csv-parser');
const { Readable } = require('stream');

// ── GET /api/club-members ─────────────────────────────────────────────────────
exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM club_members ORDER BY member_name ASC'
        );
        res.json(rows);
    } catch (err) {
        console.error('getAll error:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

// ── GET /api/club-members/:customer_id ────────────────────────────────────────
exports.getOne = async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM club_members WHERE customer_id = ?',
            [req.params.customer_id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Member not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error('getOne error:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

// ── POST /api/club-members ────────────────────────────────────────────────────
exports.create = async (req, res) => {
    const { customer_id, member_name } = req.body;
    if (!customer_id || !member_name) {
        return res.status(400).json({ error: 'customer_id and member_name are required' });
    }
    try {
        const [result] = await db.execute(
            'INSERT INTO club_members (customer_id, member_name) VALUES (?, ?)',
            [customer_id.trim(), member_name.trim()]
        );
        res.status(201).json({ message: 'Member added', id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Customer ID already exists' });
        }
        console.error('create error:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

// ── PUT /api/club-members/:id ─────────────────────────────────────────────────
exports.update = async (req, res) => {
    const { customer_id, member_name } = req.body;
    if (!customer_id || !member_name) {
        return res.status(400).json({ error: 'customer_id and member_name are required' });
    }
    try {
        const [result] = await db.execute(
            'UPDATE club_members SET customer_id = ?, member_name = ? WHERE id = ?',
            [customer_id.trim(), member_name.trim(), req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Member not found' });
        res.json({ message: 'Member updated' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Customer ID already exists' });
        }
        console.error('update error:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

// ── DELETE /api/club-members/:id ──────────────────────────────────────────────
exports.remove = async (req, res) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM club_members WHERE id = ?',
            [req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Member not found' });
        res.json({ message: 'Member deleted' });
    } catch (err) {
        console.error('remove error:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

// ── POST /api/club-members/upload/csv ─────────────────────────────────────────
exports.uploadCSV = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No CSV file uploaded' });

    const results   = [];
    const errors    = [];
    let inserted    = 0;
    let duplicates  = 0;

    // Parse CSV from memory buffer
    await new Promise((resolve, reject) => {
        const stream = Readable.from(req.file.buffer.toString());
        stream
            .pipe(csv())
            .on('data', (row) => {
                const cid  = (row.customer_id || '').trim();
                const name = (row.member_name  || '').trim();
                if (cid && name) results.push({ customer_id: cid, member_name: name });
            })
            .on('end', resolve)
            .on('error', reject);
    });

    // Insert each row — skip duplicates
    for (const row of results) {
        try {
            await db.execute(
                'INSERT INTO club_members (customer_id, member_name) VALUES (?, ?)',
                [row.customer_id, row.member_name]
            );
            inserted++;
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                duplicates++;
            } else {
                errors.push({ row, error: err.message });
            }
        }
    }

    res.json({
        message:    `CSV processed. Inserted: ${inserted}, Duplicates skipped: ${duplicates}`,
        inserted,
        duplicates,
        errors
    });
};

// ── POST /api/club-members/auth/login ─────────────────────────────────────────
exports.login = async (req, res) => {
    const { customer_id } = req.body;
    if (!customer_id) return res.status(400).json({ error: 'customer_id is required' });

    try {
        const [rows] = await db.execute(
            'SELECT cm.id, cm.customer_id, cm.member_name, cm.created_at, ' +
            '       r.role_name, mr.meeting_date, mr.status ' +
            'FROM club_members cm ' +
            'LEFT JOIN members m ON (CONCAT(SUBSTRING_INDEX(cm.member_name," ",1),"") = m.first_name ' +
            '   AND SUBSTRING_INDEX(cm.member_name," ",-1) = m.last_name) ' +
            'LEFT JOIN member_roles mr ON mr.member_id = m.id AND mr.status = "Assigned" ' +
            'LEFT JOIN roles r ON r.id = mr.role_id ' +
            'WHERE cm.customer_id = ?',
            [customer_id.trim()]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid Customer ID. Please check and try again.' });
        }

        // Aggregate roles into one member object
        const member = {
            id:          rows[0].id,
            customer_id: rows[0].customer_id,
            member_name: rows[0].member_name,
            created_at:  rows[0].created_at,
            roles:       rows
                            .filter(r => r.role_name)
                            .map(r => ({ role: r.role_name, date: r.meeting_date, status: r.status }))
        };

        res.json({ success: true, member });
    } catch (err) {
        console.error('login error:', err);
        res.status(500).json({ error: 'Database error' });
    }
};
