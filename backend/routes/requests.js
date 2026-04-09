const express = require('express');
const router = express.Router();
const { createRequest, getMyRequests, getAllRequests, approveRequest, rejectRequest, cancelRequest } = require('../controllers/requestController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, createRequest);
router.get('/my', auth, getMyRequests);
router.get('/', auth, adminAuth, getAllRequests);
router.put('/:id/approve', auth, adminAuth, approveRequest);
router.put('/:id/reject', auth, adminAuth, rejectRequest);
router.delete('/:id', auth, cancelRequest);

module.exports = router;
