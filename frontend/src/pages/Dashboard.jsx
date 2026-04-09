import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/api';
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
import { BookOpen, Users, ArrowLeftRight, AlertTriangle, LayoutDashboard } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await transactionService.getStats();
      setStats(res.data);
    } catch (err) {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );

  const statCards = [
    { title: 'Total Books', value: stats?.totalBooks || 0, icon: BookOpen, color: 'text-blue-600' },
    { title: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'text-green-600' },
    { title: 'Books Issued', value: stats?.totalIssued || 0, icon: ArrowLeftRight, color: 'text-purple-600' },
    { title: 'Overdue Books', value: stats?.totalOverdue || 0, icon: AlertTriangle, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Library overview and statistics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="flex items-center p-6">
              <div className={`p-3 rounded-full bg-muted mr-4`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentTransactions?.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No recent transactions</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.recentTransactions?.map(trans => (
                  <TableRow key={trans._id}>
                    <TableCell className="font-medium">{trans.book?.title}</TableCell>
                    <TableCell>{trans.user?.name}</TableCell>
                    <TableCell>{new Date(trans.issueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={trans.status === 'returned' ? 'success' : 'warning'}>
                        {trans.status}
                      </Badge>
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

export default Dashboard;
