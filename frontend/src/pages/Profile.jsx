import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { transactionService, userService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { User, Mail, Phone, Book, Clock, AlertCircle, FileText, Calendar, Edit2, Save, X } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    department: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transRes, reqRes, userRes] = await Promise.all([
        transactionService.getByUser(user.id),
        fetch('http://localhost:5000/api/requests/my', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        }).then(r => r.json()),
        userService.getCurrentUser()
      ]);
      setTransactions(transRes.data || []);
      setRequests(reqRes || []);
      setUserDetails(userRes.data);
      setEditForm({
        name: userRes.data?.name || '',
        phone: userRes.data?.phone || '',
        department: userRes.data?.department || ''
      });
    } catch (err) {
      console.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditForm({
      name: userDetails?.name || '',
      phone: userDetails?.phone || '',
      department: userDetails?.department || ''
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await userService.updateUser(editForm);
      setUserDetails(res.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDaysLeft = (dueDate) => {
    const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: `${Math.abs(days)} days overdue`, className: 'text-red-600' };
    if (days === 0) return { text: 'Due today', className: 'text-orange-600' };
    return { text: `${days} days left`, className: 'text-green-600' };
  };

  const calculateFine = (dueDate) => {
    const daysOverdue = Math.ceil((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24));
    return daysOverdue > 0 ? daysOverdue * 1 : 0;
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );

  const currentBooks = transactions.filter(t => t.status === 'issued');
  const pastBooks = transactions.filter(t => t.status === 'returned');
  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="profile-page">
      <div className="profile-header" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div className="profile-avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '700', flexShrink: 0 }}>
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1 className="profile-name" style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>{userDetails?.name || user.name}</h1>
          <p className="profile-role" style={{ color: 'var(--text-light)', fontSize: '1rem' }}>{user.role === 'admin' ? 'Administrator' : 'Student'}</p>
        </div>
      </div>

      <div className="profile-grid">
        <Card className="profile-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User size={20} />
                Personal Information
              </CardTitle>
              {!isEditing && user?.role === 'student' && (
                <button onClick={handleEdit} className="btn btn-outline btn-sm">
                  <Edit2 size={16} /> Edit
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {isEditing ? (
              <>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="text-sm text-muted-foreground">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="form-control"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="text-sm text-muted-foreground">Department</label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                    className="form-control"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="text-sm text-muted-foreground">Phone</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="form-control"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="btn btn-primary btn-sm" disabled={saving}>
                    <Save size={16} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={handleCancel} className="btn btn-outline btn-sm">
                    <X size={16} /> Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="info-row" style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '8px' }}>
                  <Mail size={18} className="text-muted-foreground" style={{ flexShrink: 0 }} />
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div>{userDetails?.email || user.email}</div>
                  </div>
                </div>
                {userDetails?.studentId && (
                  <div className="info-row" style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '8px' }}>
                    <Book size={18} className="text-muted-foreground" style={{ flexShrink: 0 }} />
                    <div>
                      <div className="text-sm text-muted-foreground">Student ID</div>
                      <div>{userDetails.studentId}</div>
                    </div>
                  </div>
                )}
                {userDetails?.department && (
                  <div className="info-row" style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '8px' }}>
                    <Calendar size={18} className="text-muted-foreground" style={{ flexShrink: 0 }} />
                    <div>
                      <div className="text-sm text-muted-foreground">Department</div>
                      <div>{userDetails.department}</div>
                    </div>
                  </div>
                )}
                {userDetails?.phone && (
                  <div className="info-row" style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '8px' }}>
                    <Phone size={18} className="text-muted-foreground" style={{ flexShrink: 0 }} />
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div>{userDetails.phone}</div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="profile-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle size={20} />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="stat-row" style={{ padding: '1rem', background: 'var(--background)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '500' }}>Currently Borrowed</span>
              <span className="stat-value" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2563eb' }}>{currentBooks.length}</span>
            </div>
            <div className="stat-row" style={{ padding: '1rem', background: 'var(--background)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '500' }}>Books Returned</span>
              <span className="stat-value" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#22c55e' }}>{pastBooks.length}</span>
            </div>
            <div className="stat-row" style={{ padding: '1rem', background: 'var(--background)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '500' }}>Pending Requests</span>
              <span className="stat-value" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f59e0b' }}>{pendingRequests.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={20} />
            Currently Borrowed ({currentBooks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentBooks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No books currently borrowed</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fine</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBooks.map(trans => {
                  const daysLeft = getDaysLeft(trans.dueDate);
                  const fine = calculateFine(trans.dueDate);
                  return (
                    <TableRow key={trans._id}>
                      <TableCell className="font-medium">{trans.book?.title}</TableCell>
                      <TableCell>{trans.book?.author}</TableCell>
                      <TableCell>{new Date(trans.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div>{new Date(trans.dueDate).toLocaleDateString()}</div>
                        <div className={`text-xs ${daysLeft.className}`}>{daysLeft.text}</div>
                      </TableCell>
                      <TableCell>{trans.borrowingPeriod} days</TableCell>
                      <TableCell>
                        {new Date(trans.dueDate) < new Date() ? (
                          <Badge variant="destructive">Overdue</Badge>
                        ) : (
                          <Badge variant="warning">Issued</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {fine > 0 ? (
                          <Badge variant="destructive">₹{fine}</Badge>
                        ) : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Pending Requests ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending requests</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map(req => (
                    <TableRow key={req._id}>
                      <TableCell className="font-medium">{req.book?.title}</TableCell>
                      <TableCell>{new Date(req.requestDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(req.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book size={20} />
              Borrowing History ({pastBooks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pastBooks.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No borrowing history</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Fine</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastBooks.slice(0, 5).map(trans => (
                    <TableRow key={trans._id}>
                      <TableCell className="font-medium">{trans.book?.title}</TableCell>
                      <TableCell>{new Date(trans.returnDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {trans.fine > 0 ? (
                          <Badge variant="destructive">₹{trans.fine}</Badge>
                        ) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
