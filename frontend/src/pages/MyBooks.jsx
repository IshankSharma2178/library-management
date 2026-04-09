import React, { useState, useEffect, useContext } from 'react';
import { transactionService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { BookMarked } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const MyBooks = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  useEffect(() => {
    fetchMyTransactions();
  }, []);

  const fetchMyTransactions = async () => {
    try {
      const res = await transactionService.getByUser(user.id);
      setTransactions(res.data);
    } catch (err) {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (trans) => {
    if (trans.status === 'returned') return <Badge variant="success">Returned</Badge>;
    if (new Date(trans.dueDate) < new Date()) return <Badge variant="destructive">Overdue</Badge>;
    return <Badge variant="warning">Issued</Badge>;
  };

  const getDaysLeft = (dueDate) => {
    const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: `${Math.abs(days)} days overdue`, className: 'text-red-600' };
    if (days === 0) return { text: 'Due today', className: 'text-orange-600' };
    return { text: `${days} days left`, className: 'text-green-600' };
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );

  const currentBooks = transactions.filter(t => t.status === 'issued');
  const pastBooks = transactions.filter(t => t.status === 'returned');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">My Books</h1>
        <p className="text-muted-foreground">Track your borrowed books and history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookMarked className="h-5 w-5" />
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
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBooks.map(trans => {
                  const daysLeft = getDaysLeft(trans.dueDate);
                  return (
                    <TableRow key={trans._id}>
                      <TableCell className="font-medium">{trans.book?.title}</TableCell>
                      <TableCell>{trans.book?.author}</TableCell>
                      <TableCell>{new Date(trans.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div>{new Date(trans.dueDate).toLocaleDateString()}</div>
                        <div className={`text-xs ${daysLeft.className}`}>{daysLeft.text}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(trans)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Borrowing History ({pastBooks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pastBooks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No borrowing history</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Fine</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastBooks.map(trans => (
                  <TableRow key={trans._id}>
                    <TableCell className="font-medium">{trans.book?.title}</TableCell>
                    <TableCell>{trans.book?.author}</TableCell>
                    <TableCell>{new Date(trans.issueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(trans.returnDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {trans.fine > 0 ? (
                        <Badge variant="destructive">${trans.fine}</Badge>
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
  );
};

export default MyBooks;
