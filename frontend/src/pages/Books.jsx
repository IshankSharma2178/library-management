import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { bookService, requestService, transactionService, categoryService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Badge } from '../components/ui/badge';
import { CheckCircle } from 'lucide-react';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  const [formData, setFormData] = useState({
    title: '', author: '', isbn: '', category: '',
    description: '', publisher: '', publishedYear: '', totalCopies: 1, location: ''
  });

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    if (isStudent) {
      fetchMyData();
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  const fetchBooks = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      const res = await bookService.getAll(params);
      setBooks(res.data.books || res.data);
    } catch (err) {
      console.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setLoading(true);
    fetchBooks();
  };

  const clearFilter = () => {
    setSearch('');
    setSelectedCategory('');
    setLoading(true);
    fetchBooks();
  };

  const fetchMyData = async () => {
    try {
      const [reqRes, transRes] = await Promise.all([
        requestService.getMyRequests(),
        transactionService.getByUser(user.id)
      ]);
      setMyRequests(reqRes.data || reqRes);
      const transactions = transRes.data || [];
      const borrowed = transactions
        .filter(t => t.status === 'issued')
        .map(t => t.book?._id);
      setBorrowedBooks(borrowed);
    } catch (err) {
      console.error('Failed to load data');
    }
  };

  const getRequestStatus = (bookId) => {
    const req = myRequests.find(r => r.book?._id === bookId && r.status === 'pending');
    return req ? req.status : null;
  };

  const isBookBorrowed = (bookId) => {
    return borrowedBooks.includes(bookId);
  };

  const handleRequestBook = async (bookId) => {
    try {
      await requestService.create(bookId);
      alert('Book request submitted successfully!');
      fetchMyRequests();
    } catch (err) {
      alert(err.response?.data?.msg || 'Request failed');
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await bookService.getAll({ search });
      setBooks(res.data.books || res.data);
    } catch (err) {
      console.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await bookService.update(editingBook._id, formData);
        alert('Book updated successfully');
      } else {
        await bookService.create(formData);
        alert('Book added successfully');
      }
      setShowModal(false);
      setEditingBook(null);
      resetForm();
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.msg || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this book?')) {
      try {
        await bookService.delete(id);
        alert('Book deleted');
        fetchBooks();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const openEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title, author: book.author, isbn: book.isbn,
      category: book.category, description: book.description || '',
      publisher: book.publisher || '', publishedYear: book.publishedYear || '',
      totalCopies: book.totalCopies, location: book.location || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '', author: '', isbn: '', category: '',
      description: '', publisher: '', publishedYear: '', totalCopies: 1, location: ''
    });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Books</h1>
        <p>Browse and manage our library collection</p>
      </div>

      <div className="search-bar filters-bar">
        <input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
          className="form-control"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="form-control category-filter"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <button onClick={handleFilter} className="btn btn-secondary">Search</button>
        {(search || selectedCategory) && (
          <button onClick={clearFilter} className="btn btn-outline">Clear</button>
        )}
      </div>

      <div className="grid grid-3">
        {books.map(book => {
          const requestStatus = getRequestStatus(book._id);
          const borrowed = isBookBorrowed(book._id);
          return (
            <Link key={book._id} to={`/book/${book._id}`} className="book-card-link">
              <div className="card book-card">
                {book.images && book.images.length > 0 ? (
                  <img src={book.images[0]} alt={book.title} className="book-card-image" />
                ) : (
                  <div className="book-card-placeholder">📚</div>
                )}
                <div className="title">{book.title}</div>
                <div className="author">by {book.author}</div>
                <p className="text-sm text-muted">ISBN: {book.isbn}</p>
                <span className="badge badge-success">{book.category}</span>
                <div className="book-card-footer">
                  <span className="text-muted">
                    {book.availableCopies}/{book.totalCopies} available
                  </span>
                  {isStudent && (
                    <div className="book-actions" onClick={(e) => e.preventDefault()}>
                      {borrowed ? (
                        <Badge variant="success" className="flex items-center gap-1">
                          <CheckCircle size={14} /> Borrowed
                        </Badge>
                      ) : requestStatus === 'pending' ? (
                        <Badge variant="warning">Pending</Badge>
                      ) : book.availableCopies > 0 ? (
                        <button 
                          onClick={() => handleRequestBook(book._id)} 
                          className="btn btn-primary btn-sm"
                        >
                          Request
                        </button>
                      ) : (
                        <Badge variant="destructive">Unavailable</Badge>
                      )}
                    </div>
                  )}
                  {isAdmin && (
                    <div className="book-actions" onClick={(e) => e.preventDefault()}>
                      <button onClick={() => openEdit(book)} className="btn btn-outline btn-sm">Edit</button>
                      <button onClick={() => handleDelete(book._id)} className="btn btn-danger btn-sm">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
              <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Author *</label>
                <input type="text" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>ISBN *</label>
                <input type="text" value={formData.isbn} onChange={(e) => setFormData({...formData, isbn: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Total Copies</label>
                <input type="number" value={formData.totalCopies} onChange={(e) => setFormData({...formData, totalCopies: e.target.value})} min="1" />
              </div>
              <div className="form-group">
                <label>Publisher</label>
                <input type="text" value={formData.publisher} onChange={(e) => setFormData({...formData, publisher: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Published Year</label>
                <input type="number" value={formData.publishedYear} onChange={(e) => setFormData({...formData, publishedYear: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" />
              </div>
              <button type="submit" className="btn btn-primary">{editingBook ? 'Update' : 'Add'} Book</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
