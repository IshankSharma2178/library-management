import React, { useState, useEffect } from 'react';
import { bookService, categoryService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Edit2, Plus, Trash2, Package, X, Upload, Image } from 'lucide-react';

const UpdateBook = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockBook, setRestockBook] = useState(null);
  const [additionalCopies, setAdditionalCopies] = useState(1);
  const [search, setSearch] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: '', author: '', isbn: '', category: '',
    description: '', publisher: '', publishedYear: '',
    totalCopies: 1, location: '', price: 0, images: []
  });

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await bookService.getAll({ search, limit: 100 });
      setBooks(res.data.books || res.data);
    } catch (err) {
      console.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchBooks();
  };

  const openEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      category: book.category || '',
      description: book.description || '',
      publisher: book.publisher || '',
      publishedYear: book.publishedYear || '',
      totalCopies: book.totalCopies || 1,
      location: book.location || '',
      price: book.price || 0,
      images: book.images || []
    });
    setImagePreviews(book.images || []);
    setShowModal(true);
  };

  const openRestock = (book) => {
    setRestockBook(book);
    setAdditionalCopies(1);
    setShowRestockModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = imagePreviews.length + newImages.length + files.length;
    if (totalImages > 3) {
      alert('Maximum 3 images allowed');
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setNewImages(prev => [...prev, ...files]);
  };

  const removeExistingImage = (index) => {
    const newImagesList = [...formData.images];
    newImagesList.splice(index, 1);
    setFormData({ ...formData, images: newImagesList });
    setImagePreviews(newImagesList);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      const existingCount = formData.images?.length || 0;
      const newPreviewIndex = index - existingCount;
      if (newPreviewIndex >= 0 && newPreviewIndex < prev.length - existingCount) {
        return prev.filter((_, i) => i !== index);
      }
      return prev;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === 'images') return;
        data.append(key, formData[key]);
      });

      newImages.forEach(file => {
        data.append('images', file);
      });

      await bookService.update(editingBook._id, data);
      alert('Book updated successfully!');
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.msg || err.response?.data?.error || 'Failed to update book');
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async () => {
    try {
      await bookService.restock(restockBook._id, additionalCopies);
      alert(`Added ${additionalCopies} copies!`);
      setShowRestockModal(false);
      fetchBooks();
    } catch (err) {
      alert('Failed to restock book');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.delete(id);
        alert('Book deleted');
        fetchBooks();
      } catch (err) {
        alert('Failed to delete book');
      }
    }
  };

  if (loading && books.length === 0) return <div className="loading">Loading...</div>;

  return (
    <div className="update-book-page">
      <div className="header">
        <h1>Update Books</h1>
        <p>Manage book details, images, and copies</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="form-control"
        />
        <button onClick={handleSearch} className="btn btn-secondary">Search</button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package size={20} />
            All Books ({books.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>ISBN</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map(book => (
                <TableRow key={book._id}>
                  <TableCell>
                    {book.images && book.images.length > 0 ? (
                      <img
                        src={book.images[0]}
                        alt={book.title}
                        className="book-thumbnail"
                      />
                    ) : (
                      <div className="book-thumbnail-placeholder">
                        <Image size={20} />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>
                    <Badge variant="success">{book.category}</Badge>
                  </TableCell>
                  <TableCell>₹{book.price || 0}</TableCell>
                  <TableCell>
                    <span className={book.availableCopies > 0 ? 'text-success' : 'text-danger'}>
                      {book.availableCopies}/{book.totalCopies}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="action-buttons">
                      <button
                        onClick={() => openRestock(book)}
                        className="btn btn-success btn-sm"
                        title="Add copies"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => openEdit(book)}
                        className="btn btn-outline btn-sm"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="btn btn-danger btn-sm"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal modal-lg">
            <div className="modal-header">
              <h2>Edit Book</h2>
              <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="book-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Author *</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>ISBN *</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                    className="form-control"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    min="0"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Total Copies</label>
                  <input
                    type="number"
                    value={formData.totalCopies}
                    onChange={(e) => setFormData({...formData, totalCopies: e.target.value})}
                    min="1"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Publisher</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({...formData, publisher: e.target.value})}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Published Year</label>
                  <input
                    type="number"
                    value={formData.publishedYear}
                    onChange={(e) => setFormData({...formData, publishedYear: e.target.value})}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Current Images</label>
                <div className="image-previews">
                  {formData.images && formData.images.map((img, index) => (
                    <div key={`existing-${index}`} className="image-preview">
                      <img src={img} alt={`Book ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="remove-image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {newImages.map((file, index) => (
                    <div key={`new-${index}`} className="image-preview">
                      <img src={URL.createObjectURL(file)} alt={`New ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="remove-image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="image-upload-area mt-2">
                  <input
                    type="file"
                    id="edit-images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="image-input"
                  />
                  <div className="image-upload-label-sm">
                    <Upload size={20} />
                    <span>Add more images</span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRestockModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Restock Book</h2>
              <button onClick={() => setShowRestockModal(false)} className="close-btn">&times;</button>
            </div>
            <div className="modal-body">
              <div className="restock-info">
                <h3>{restockBook?.title}</h3>
                <p>Current: {restockBook?.availableCopies}/{restockBook?.totalCopies} available</p>
              </div>
              <div className="form-group">
                <label>Add Copies</label>
                <input
                  type="number"
                  value={additionalCopies}
                  onChange={(e) => setAdditionalCopies(parseInt(e.target.value) || 0)}
                  min="1"
                  className="form-control"
                />
              </div>
              <p className="text-muted">
                After adding: {restockBook?.availableCopies + additionalCopies}/{restockBook?.totalCopies + additionalCopies} available
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowRestockModal(false)} className="btn btn-outline">Cancel</button>
              <button onClick={handleRestock} className="btn btn-success">
                <Plus size={16} /> Add Copies
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateBook;
