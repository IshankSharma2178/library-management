const BookRequest = require('../models/BookRequest');
const Book = require('../models/Book');
const User = require('../models/User');

exports.createRequest = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const existingRequest = await BookRequest.findOne({
      user: userId,
      book: bookId,
      status: 'pending'
    });
    if (existingRequest) {
      return res.status(400).json({ msg: 'Request already pending for this book' });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    const request = new BookRequest({
      user: userId,
      book: bookId
    });

    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await BookRequest.find({ user: req.user.id })
      .populate('book', 'title author isbn availableCopies')
      .sort({ requestDate: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const requests = await BookRequest.find(query)
      .populate('book', 'title author isbn availableCopies totalCopies')
      .populate('user', 'name email studentId department')
      .sort({ requestDate: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { borrowingPeriod, adminNote } = req.body;

    const request = await BookRequest.findById(id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });
    if (request.status !== 'pending') {
      return res.status(400).json({ msg: 'Request already processed' });
    }

    const book = await Book.findById(request.book);
    if (!book || book.availableCopies < 1) {
      request.status = 'rejected';
      request.adminNote = 'Book not available';
      await request.save();
      return res.status(400).json({ msg: 'Book not available' });
    }

    request.status = 'approved';
    request.processedDate = new Date();
    request.adminNote = adminNote || '';
    request.processedBy = req.user.id;
    await request.save();

    book.availableCopies -= 1;
    await book.save();

    const user = await User.findById(request.user);
    user.borrowedBooks.push(book._id);
    await user.save();

    const Transaction = require('../models/Transaction');
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + borrowingPeriod);

    const transaction = new Transaction({
      book: book._id,
      user: request.user,
      dueDate,
      borrowingPeriod,
      issuedBy: req.user.id,
      status: 'issued'
    });

    await transaction.save();
    res.json({ request, transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNote } = req.body;

    const request = await BookRequest.findById(id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });
    if (request.status !== 'pending') {
      return res.status(400).json({ msg: 'Request already processed' });
    }

    request.status = 'rejected';
    request.processedDate = new Date();
    request.adminNote = adminNote || '';
    request.processedBy = req.user.id;
    await request.save();

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await BookRequest.findById(id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });
    if (request.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ msg: 'Cannot cancel processed request' });
    }

    await request.deleteOne();
    res.json({ msg: 'Request cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
