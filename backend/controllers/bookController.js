const Book = require('../models/Book');
const { upload } = require('../config/cloudinary');

exports.uploadImages = upload.array('images', 3);

exports.addBook = async (req, res) => {
  try {
    const bookData = { ...req.body, addedBy: req.user.id };
    
    if (req.files && req.files.length > 0) {
      bookData.images = req.files.map(file => file.path);
      bookData.imageUrl = req.files[0].path;
    }
    
    if (bookData.totalCopies) {
      bookData.availableCopies = bookData.totalCopies;
    }
    
    const book = new Book(bookData);
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;

    const books = await Book.find(query)
      .populate('addedBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name');
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const bookData = { ...req.body };
    
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      const existingImages = bookData.images || [];
      bookData.images = [...existingImages, ...newImages].slice(0, 3);
      if (!bookData.imageUrl) {
        bookData.imageUrl = bookData.images[0];
      }
    }
    
    const book = await Book.findByIdAndUpdate(req.params.id, bookData, { new: true });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Book.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.restockBook = async (req, res) => {
  try {
    const { additionalCopies } = req.body;
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    
    book.totalCopies += additionalCopies;
    book.availableCopies += additionalCopies;
    await book.save();
    
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
