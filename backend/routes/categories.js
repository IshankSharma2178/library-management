const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories, deleteCategory, updateCategory } = require('../controllers/categoryController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', getAllCategories);
router.post('/', auth, adminAuth, createCategory);
router.put('/:id', auth, adminAuth, updateCategory);
router.delete('/:id', auth, adminAuth, deleteCategory);

module.exports = router;
