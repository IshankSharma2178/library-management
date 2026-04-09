import React, { useState, useEffect } from 'react';
import { transactionService, bookService, userService } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { ArrowLeftRight, Plus } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    bookId: '', userId: '', dueDate: ''
  });

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [transRes, booksRes, usersRes] = await Promise.all([
        transactionService.getAll(filter !== 'all' ? { status: filter } : {}),
        bookService.getAll(),
        userService.getAll()
      ]);
      setTransactions(transRes.data);
      setBooks(booksRes.data.books || booksRes.data);
      setStudents(usersRes.data.filter(u => u.role === 'student'));
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await transactionService.issue(formData);
      toast.success('Book issued successfully');
      setShowDialog(false);
      setFormData({ bookId: '', userId: '', dueDate: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Issue failed');
    }
  };

  const handleReturn = async (transactionId) => {
    const fine = window.prompt('Enter fine amount (0 if none):', '0');
    if (fine !== null) {
      try {
        await transactionService.return({ transactionId, fine: parseFloat(fine) || 0 });
        toast.success('Book returned successfully');
        fetchData();
      } catch (err) {
        toast.error('Return failed');
      }
    }
  };

  const getStatusBadge = (transaction) => {
    if (transaction.status === 'returned') return <Badge variant="success">Returned</Badge>;
    if (new Date(transaction.dueDate) < new Date()) return <Badge variant="destructive">Overdue</Badge>;
    return <Badge variant="warning">Issued</Badge>;
  };

  const getDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">Manage book issues and returns</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="issued">Issued</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => { setFormData({ ...formData, dueDate: getDueDate() }); setShowDialog(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Issue Book
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No transactions found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fine</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(trans => (
                  <TableRow key={trans._id}>
                    <TableCell className="font-medium">{trans.book?.title}</TableCell>
                    <TableCell>
                      <div>{trans.user?.name}</div>
                      <div className="text-xs text-muted-foreground">{trans.user?.email}</div>
                    </TableCell>
                    <TableCell>{new Date(trans.issueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(trans.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {trans.returnDate ? new Date(trans.returnDate).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>{getStatusBadge(trans)}</TableCell>
                    <TableCell>{trans.fine > 0 ? `$${trans.fine}` : '-'}</TableCell>
                    <TableCell>
                      {trans.status === 'issued' && (
                        <Button size="sm" onClick={() => handleReturn(trans._id)}>
                          Return
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Book</DialogTitle>
            <DialogDescription>
              Select a book and student to issue
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleIssue} className="space-y-4">
            <div className="space-y-2">
              <Label>Book *</Label>
              <Select value={formData.bookId} onValueChange={(v) => setFormData({...formData, bookId: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Book" />
                </SelectTrigger>
                <SelectContent>
                  {books.filter(b => b.availableCopies > 0).map(book => (
                    <SelectItem key={book._id} value={book._id}>
                      {book.title} - {book.author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Student *</Label>
              <Select value={formData.userId} onValueChange={(v) => setFormData({...formData, userId: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student._id} value={student._id}>
                      {student.name} ({student.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} required />
            </div>
            <Button type="submit" className="w-full">Issue Book</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;
