const express = require('express');
const router  = express.Router();
const roleController = require('../controllers/roleController');

// Member actions
router.post('/allocate', roleController.allocateRole);
router.post('/cancel',   roleController.cancelRole);

// Admin dashboard — get all role assignments
router.get('/all', roleController.getAllRoles);

// Admin dashboard — inline approve/reject (PATCH)
router.patch('/approve-allocate', roleController.approveAllocate);
router.patch('/approve-cancel',   roleController.approveCancel);

// Email link one-click approval (GET — backward compat)
router.get('/approve-allocate', roleController.approveAllocate);
router.get('/approve-cancel',   roleController.approveCancel);

module.exports = router;
