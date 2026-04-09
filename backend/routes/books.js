const express = require('express');
const router = express.Router();
const { addBook, getAllBooks, getBook, updateBook, deleteBook, getCategories, uploadImages, restockBook } = require('../controllers/bookController');
const { auth, adminAuth } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/categories', getCategories);
router.get('/', getAllBooks);
router.get('/:id', getBook);
router.post('/', auth, adminAuth, upload.array('images', 3), addBook);
router.put('/:id', auth, adminAuth, upload.array('images', 3), updateBook);
router.delete('/:id', auth, adminAuth, deleteBook);
router.put('/:id/restock', auth, adminAuth, restockBook);

module.exports = router;
