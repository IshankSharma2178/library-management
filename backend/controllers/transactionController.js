const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/User');

exports.issueBook = async (req, res) => {
  try {
    const { bookId, userId, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book || book.availableCopies < 1) {
      return res.status(400).json({ msg: 'Book not available' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const transaction = new Transaction({
      book: bookId,
      user: userId,
      dueDate,
      issuedBy: req.user.id
    });

    await transaction.save();

    book.availableCopies -= 1;
    await book.save();

    user.borrowedBooks.push(bookId);
    await user.save();

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { transactionId, fine = 0 } = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(400).json({ msg: 'Transaction not found' });

    transaction.returnDate = new Date();
    transaction.status = 'returned';
    transaction.fine = fine;
    await transaction.save();

    const book = await Book.findById(transaction.book);
    book.availableCopies += 1;
    await book.save();

    const user = await User.findById(transaction.user);
    user.borrowedBooks = user.borrowedBooks.filter(b => b.toString() !== transaction.book.toString());
    await user.save();

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { status, userId } = req.query;
    let query = {};

    if (status) query.status = status;
    if (userId) query.user = userId;

    const transactions = await Transaction.find(query)
      .populate('book', 'title author isbn')
      .populate('user', 'name email studentId')
      .populate('issuedBy', 'name')
      .sort({ issueDate: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.params.userId })
      .populate('book', 'title author isbn')
      .sort({ issueDate: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalIssued = await Transaction.countDocuments({ status: 'issued' });
    const totalOverdue = await Transaction.countDocuments({
      status: 'issued',
      dueDate: { $lt: new Date() }
    });

    const recentTransactions = await Transaction.find()
      .populate('book', 'title')
      .populate('user', 'name')
      .sort({ issueDate: -1 })
      .limit(5);

    res.json({
      totalBooks,
      totalStudents,
      totalIssued,
      totalOverdue,
      recentTransactions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
