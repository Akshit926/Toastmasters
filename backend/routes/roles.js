const express = require('express');
const router  = express.Router();
const roleController = require('../controllers/roleController');

// Member actions
router.post('/allocate', roleController.allocateRole);
router.post('/cancel',   roleController.cancelRole);

// Admin dashboard — get all role assignments
router.get('/all', roleController.getAllRoles);

// Admin dashboard — approve/reject/delete (PATCH + DELETE)
router.patch('/approve-allocate', roleController.approveAllocate);
router.patch('/approve-cancel',   roleController.approveCancel);
router.patch('/reject-allocate',  roleController.rejectAllocate);
router.delete('/:id',             roleController.deleteRole);

// Email one-click links (GET — opens in browser from email)
router.get('/approve-allocate', roleController.approveAllocate);
router.get('/approve-cancel',   roleController.approveCancel);
router.get('/reject-allocate',  roleController.rejectAllocate);

module.exports = router;
