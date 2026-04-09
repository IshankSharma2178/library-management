const express = require('express');
const router = express.Router();
const { issueBook, returnBook, getTransactions, getUserTransactions, getStats } = require('../controllers/transactionController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/stats', auth, adminAuth, getStats);
router.get('/', auth, adminAuth, getTransactions);
router.get('/user/:userId', auth, getUserTransactions);
router.post('/issue', auth, adminAuth, issueBook);
router.post('/return', auth, adminAuth, returnBook);

module.exports = router;
