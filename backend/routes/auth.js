const express = require('express');
const router = express.Router();
const { register, login, getUser, getAllUsers, updateUser } = require('../controllers/authController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/user', auth, getUser);
router.put('/user', auth, updateUser);
router.get('/users', auth, adminAuth, getAllUsers);

module.exports = router;
