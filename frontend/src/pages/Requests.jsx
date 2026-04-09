import React, { useState, useEffect } from 'react';
import { requestService } from '../services/api';
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
import { Check, X, Clock, BookOpen, User, Calendar } from 'lucide-react';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [borrowingPeriod, setBorrowingPeriod] = useState(14);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      const res = await requestService.getAll(filter);
      setRequests(res.data || res);
    } catch (err) {
      console.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const submitApprove = async () => {
    try {
      await requestService.approve(selectedRequest._id, {
        borrowingPeriod: parseInt(borrowingPeriod),
        adminNote
      });
      alert('Request approved and book issued!');
      setShowModal(false);
      setBorrowingPeriod(14);
      setAdminNote('');
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    const note = prompt('Enter rejection reason (optional):');
    try {
      await requestService.reject(requestId, { adminNote: note || '' });
      alert('Request rejected');
      fetchRequests();
    } catch (err) {
      alert('Failed to reject request');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning"><Clock size={14} className="mr-1" /> Pending</Badge>;
      case 'approved':
        return <Badge variant="success"><Check size={14} className="mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><X size={14} className="mr-1" /> Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="requests-page">
      <div className="header">
        <h1>Book Requests</h1>
        <p>Manage student book borrowing requests</p>
      </div>

      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({requests.filter(r => r.status === 'pending').length})
        </button>
        <button 
          className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approved
        </button>
        <button 
          className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} />
            {filter === 'pending' ? 'Pending Requests' : filter === 'approved' ? 'Approved Requests' : 'Rejected Requests'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No {filter} requests</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Book</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  {filter === 'pending' && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map(req => (
                  <TableRow key={req._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <div>
                          <div className="font-medium">{req.user?.name}</div>
                          <div className="text-sm text-muted-foreground">{req.user?.studentId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{req.book?.title}</TableCell>
                    <TableCell>{req.book?.author}</TableCell>
                    <TableCell>{req.book?.availableCopies}/{req.book?.totalCopies}</TableCell>
                    <TableCell>{new Date(req.requestDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                    {filter === 'pending' && (
                      <TableCell>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleApprove(req)}
                            className="btn btn-success btn-sm"
                            disabled={req.book?.availableCopies < 1}
                          >
                            <Check size={16} /> Approve
                          </button>
                          <button 
                            onClick={() => handleReject(req._id)}
                            className="btn btn-danger btn-sm"
                          >
                            <X size={16} /> Reject
                          </button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Approve Request</h2>
              <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
            </div>
            <div className="modal-body">
              <div className="request-detail">
                <strong>Book:</strong> {selectedRequest?.book?.title}
              </div>
              <div className="request-detail">
                <strong>Student:</strong> {selectedRequest?.user?.name} ({selectedRequest?.user?.studentId})
              </div>
              <div className="request-detail">
                <strong>Available:</strong> {selectedRequest?.book?.availableCopies}/{selectedRequest?.book?.totalCopies}
              </div>
              
              <div className="form-group">
                <label>Borrowing Period *</label>
                <select 
                  value={borrowingPeriod} 
                  onChange={(e) => setBorrowingPeriod(e.target.value)}
                  className="form-control"
                >
                  <option value={7}>7 Days</option>
                  <option value={14}>14 Days</option>
                  <option value={30}>30 Days</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Admin Note (optional)</label>
                <textarea 
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="form-control"
                  rows="3"
                  placeholder="Add a note for the student..."
                />
              </div>

              <div className="fine-info">
                <strong>Fine Policy:</strong> ₹1 per day after due date
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
              <button onClick={submitApprove} className="btn btn-success">
                <Check size={16} /> Approve & Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
