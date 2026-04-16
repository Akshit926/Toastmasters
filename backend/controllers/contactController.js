const db = require('../config/db');
const { sendContactNotificationEmail } = require('../services/emailService');

exports.submitContact = async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await db.execute(
            'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
            [name, email, message]
        );
        // Fire email
        await sendContactNotificationEmail(name, email, message);
        
        res.status(201).json({ message: 'Contact message submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.getAllContacts = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM contacts ORDER BY created_at DESC');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
};
