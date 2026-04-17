const nodemailer = require('nodemailer');
const dotenv     = require('dotenv');
const path       = require('path');
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendRoleNotificationEmail = async (memberName, roleName, action, meetingDate, memberId = null, roleId = null) => {
    const adminEmail = process.env.ADMIN_EMAIL;

    let subject = action === 'Assigned'
        ? `Request: New Role Claim by ${memberName}`
        : `Request: Role Cancel by ${memberName}`;

    let actionString = action === 'Assigned' ? 'Allocation Requested' : 'Cancellation Requested';
    let approvalLink = '';

    // Wire up one-click backend links for Admins inside the email text
    if (memberId && roleId && action === 'Assigned') {
        approvalLink = `http://localhost:5000/api/roles/approve-allocate?member_id=${memberId}&role_id=${roleId}&meeting_date=${meetingDate}`;
    } else if (memberId && roleId && action === 'Cancelled') {
        approvalLink = `http://localhost:5000/api/roles/approve-cancel?member_id=${memberId}&role_id=${roleId}&meeting_date=${meetingDate}`;
    }

    let text = `Hello Admin,\n\nA role allocation update has occurred in the system.\n\nMember: ${memberName}\nRole: ${roleName}\nMeeting Date: ${meetingDate}\nAction: ${actionString}\nTimestamp: ${new Date().toLocaleString()}\n`;

    if (approvalLink) {
        text += `\n===============================================\n`;
        text += `>>> CLICK HERE TO INSTANTLY APPROVE THIS REQUEST:\n`;
        text += `${approvalLink}\n`;
        text += `===============================================\n\n`;
    }
    text += `Best regards,\nWakad Toastmasters System`;

    try {
        await transporter.sendMail({ from: process.env.EMAIL_USER, to: adminEmail, subject, text });
    } catch (error) {
        console.error("Error sending email: ", error);
    }
};

const sendContactNotificationEmail = async (name, email, message) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const subject = `New Contact Form Submission from ${name}`;
    const text = `Hello Admin,\n\nA new message was submitted via the Contact Form.\n\nName: ${name}\nEmail: ${email}\nMessage: \n${message}\n\nTimestamp: ${new Date().toLocaleString()}`;
    try {
        await transporter.sendMail({ from: process.env.EMAIL_USER, to: adminEmail, subject, text });
    } catch (e) {
        console.error("Email Error:", e);
    }
};

const sendMemberNotificationEmail = async (first_name, last_name, email, phone, introduction, why_join, source, preferred_role, queries) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const subject = `New Member Registration: ${first_name} ${last_name}`;
    const text = `Hello Admin,\n\nA new member form was submitted!\n\nName: ${first_name} ${last_name}\nEmail: ${email}\nPhone: ${phone}\n\nIntroduction:\n${introduction}\n\nWhy Join Toastmasters:\n${why_join}\n\nReferred From:\n${source}\n\nPreferred Role:\n${preferred_role}\n\nQueries:\n${queries}\n\nTimestamp: ${new Date().toLocaleString()}`;
    try {
        await transporter.sendMail({ from: process.env.EMAIL_USER, to: adminEmail, subject, text });
    } catch (e) {
        console.error("Email Error:", e);
    }
};

module.exports = { sendRoleNotificationEmail, sendContactNotificationEmail, sendMemberNotificationEmail };
