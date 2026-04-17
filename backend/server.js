const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// .env lives one level up from backend/
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/members', require('./routes/members'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/club-members', require('./routes/clubMembers'));

const PORT = process.env.PORT || 5001;
const migrate = require('./database/migrate');

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await migrate();  // auto-create club_members table + seed 36 members
});

app.get('/', (req, res) => {
  res.send('Backend is working 🚀');
});

const { sendRoleNotificationEmail } = require('./services/emailService');

app.get('/test-email', async (req, res) => {
  await sendRoleNotificationEmail("Test User", "President", "Assigned", "Today");
  res.send("Test email triggered");
});