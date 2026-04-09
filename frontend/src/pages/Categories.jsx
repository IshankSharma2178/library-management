import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/api';
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
import { Plus, Trash2, FolderOpen, Tag, Edit2, X } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      alert('Please enter a category name');
      return;
    }
    setSaving(true);
    try {
      await categoryService.create(newCategory);
      alert('Category created successfully!');
      setNewCategory({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await categoryService.delete(id);
        alert('Category deleted successfully!');
        fetchCategories();
      } catch (err) {
        alert(err.response?.data?.msg || 'Failed to delete category');
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setEditForm({
      name: category.name,
      description: category.description || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editForm.name.trim()) {
      alert('Please enter a category name');
      return;
    }
    setSaving(true);
    try {
      await categoryService.update(editingCategory._id, editForm);
      alert('Category updated successfully!');
      setShowEditModal(false);
      setEditingCategory(null);
      setEditForm({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingCategory(null);
    setEditForm({ name: '', description: '' });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="categories-page">
      <div className="header">
        <h1>Categories</h1>
        <p>Manage book categories</p>
      </div>

      <div className="categories-grid">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus size={20} />
              Add New Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="e.g., Computer Science"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Brief description of this category..."
                  className="form-control"
                  rows="2"
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Creating...' : 'Create Category'}
              </button>
            </form>
          </CardContent>
        </Card>

        <Card className="categories-list-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen size={20} />
              All Categories ({categories.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No categories yet. Create your first category above.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Books</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat) => (
                    <TableRow key={cat._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Tag size={16} className="text-primary" />
                          <span className="font-medium">{cat.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {cat.description || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{cat.bookCount || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="btn btn-outline btn-sm"
                            title="Edit category"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id, cat.name)}
                            className="btn btn-danger btn-sm"
                            title="Delete category"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Category</h2>
              <button onClick={closeEditModal} className="close-btn">&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="form-control"
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={closeEditModal} className="btn btn-outline">
                Cancel
              </button>
              <button onClick={handleUpdate} className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
