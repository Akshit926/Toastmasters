const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/members', require('./routes/members'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/roles', require('./routes/roles'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Backend is working 🚀');
});

const { sendRoleNotificationEmail } = require('./services/emailService');

app.get('/test-email', async (req, res) => {
    await sendRoleNotificationEmail("Test User", "President", "Assigned", "Today");
    res.send("Test email triggered");
});