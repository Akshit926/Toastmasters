const express = require('express');
const router = express.Router();
const clubMemberController = require('../controllers/clubMemberController');
const multer = require('multer');

// Multer — store CSV in memory (no disk write needed)
const upload = multer({ storage: multer.memoryStorage() });

// ── Specific paths MUST be before wildcard /:customer_id ──────────────────────

// CSV bulk upload
router.post('/upload/csv', upload.single('csv'), clubMemberController.uploadCSV);

// Member login (by customer_id)
router.post('/auth/login', clubMemberController.login);

// ── CRUD ──────────────────────────────────────────────────────────────────────
router.get('/',             clubMemberController.getAll);
router.post('/',            clubMemberController.create);
router.get('/:customer_id', clubMemberController.getOne);   // wildcard — must be last GET
router.put('/:id',          clubMemberController.update);
router.delete('/:id',       clubMemberController.remove);

module.exports = router;

