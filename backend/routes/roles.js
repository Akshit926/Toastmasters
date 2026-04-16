const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

router.post('/allocate', roleController.allocateRole);
router.post('/cancel', roleController.cancelRole);

// Webhook-style Approval GET links for Admin Email Clicks
router.get('/approve-allocate', roleController.approveAllocate);
router.get('/approve-cancel', roleController.approveCancel);

module.exports = router;
