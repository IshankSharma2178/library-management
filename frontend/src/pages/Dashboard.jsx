import React, { useState, useEffect, useRef } from 'react';
import { transactionService, chartService } from '../services/api';
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
import { BookOpen, Users, ArrowLeftRight, AlertTriangle, LayoutDashboard, RefreshCw, TrendingUp, Calendar, Filter } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    monthly: { labels: [], issued: [], returned: [] },
    categories: [],
    status: [],
    daily: []
  });
  const [chartLoading, setChartLoading] = useState(true);
  const [period, setPeriod] = useState('12');
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      const res = await transactionService.getStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    setChartLoading(true);
    try {
      const [monthlyRes, categoryRes, statusRes, dailyRes] = await Promise.allSettled([
        chartService.getMonthly({ months: period }),
        chartService.getCategories(),
        chartService.getStatus(),
        chartService.getDaily({ days: parseInt(period) })
      ]);

      setChartData({
        monthly: monthlyRes.status === 'fulfilled' ? monthlyRes.value.data : getDefaultMonthly(),
        categories: categoryRes.status === 'fulfilled' ? categoryRes.value.data : getDefaultCategories(),
        status: statusRes.status === 'fulfilled' ? statusRes.value.data?.data || [] : getDefaultStatus(),
        daily: dailyRes.status === 'fulfilled' ? dailyRes.value.data : []
      });
    } catch (err) {
      setChartData({
        monthly: getDefaultMonthly(),
        categories: getDefaultCategories(),
        status: getDefaultStatus(),
        daily: getDefaultDaily()
      });
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, [period]);

  const handleRefresh = () => {
    fetchStats();
    fetchChartData();
    toast.success('Dashboard refreshed');
  };

  const statCards = [
    { title: 'Total Books', value: stats?.totalBooks || 0, icon: BookOpen, color: '#2563eb', bg: '#eff6ff' },
    { title: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: '#059669', bg: '#ecfdf5' },
    { title: 'Books Issued', value: stats?.totalIssued || 0, icon: ArrowLeftRight, color: '#7c3aed', bg: '#f5f3ff' },
    { title: 'Overdue Books', value: stats?.totalOverdue || 0, icon: AlertTriangle, color: '#dc2626', bg: '#fef2f2' },
  ];

  const COLORS = ['#2563eb', '#7c3aed', '#059669', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316'];

  if (loading) return (
    <div className="loading">
      <RefreshCw className="animate-spin" size={32} />
      <p>Loading dashboard...</p>
    </div>
  );

  const lineChartData = chartData.monthly.labels?.map((label, i) => ({
    name: label,
    issued: chartData.monthly.issued?.[i] || 0,
    returned: chartData.monthly.returned?.[i] || 0
  })) || [];

  const categoryChartData = chartData.categories?.map((c, i) => ({
    name: c.name,
    value: c.value,
    color: c.color || COLORS[i % COLORS.length]
  })) || [];

  const statusChartData = chartData.status?.map((s, i) => ({
    name: s.name,
    value: s.value,
    color: s.color || COLORS[i % COLORS.length]
  })) || [];

  const barChartData = (chartData.daily || []).slice(-14).map(d => ({
    date: d.date,
    issued: d.issued,
    returned: d.returned
  }));

  return (
    <div>
      <style>{`
        .dashboard-container { max-width: 1400px; margin: 0 auto; }
        .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .dashboard-title { font-size: 1.75rem; font-weight: 700; color: var(--text); }
        .dashboard-subtitle { color: var(--text-light); font-size: 0.9rem; margin-top: 0.25rem; }
        .refresh-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--card); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; color: var(--text); transition: all 0.2s; }
        .refresh-btn:hover { background: var(--background); border-color: var(--primary); color: var(--primary); }
        .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { display: flex; align-items: center; padding: 1.25rem; background: var(--card); border-radius: 12px; border: 1px solid var(--border); transition: all 0.3s; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .stat-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 1rem; }
        .stat-value { font-size: 1.75rem; font-weight: 700; color: var(--text); }
        .stat-label { font-size: 0.85rem; color: var(--text-light); margin-top: 0.25rem; }
        .charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .chart-card { background: var(--card); border-radius: 12px; border: 1px solid var(--border); padding: 1.5rem; }
        .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem; }
        .chart-title { font-size: 1.1rem; font-weight: 600; color: var(--text); }
        .chart-subtitle { font-size: 0.85rem; color: var(--text-light); }
        .period-select { padding: 0.4rem 0.75rem; border: 1px solid var(--border); border-radius: 6px; background: var(--card); color: var(--text); font-size: 0.875rem; }
        .chart-container { height: 300px; }
        .chart-loading { display: flex; align-items: center; justify-content: center; height: 300px; color: var(--text-light); }
        .transactions-table { background: var(--card); border-radius: 12px; border: 1px solid var(--border); overflow: hidden; }
        .table-header { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 0.5rem; }
        .table-header h3 { font-size: 1.1rem; font-weight: 600; }
        @media (max-width: 768px) {
          .charts-grid { grid-template-columns: 1fr; }
          .dashboard-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">Library analytics and overview</p>
          </div>
          <button className="refresh-btn" onClick={handleRefresh}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        <div className="stat-grid">
          {statCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.bg }}>
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              <div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Monthly Transactions</h3>
                <p className="chart-subtitle">Books issued vs returned</p>
              </div>
              <select className="period-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
                <option value="12">12 Months</option>
              </select>
            </div>
            {chartLoading ? (
              <div className="chart-loading">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--text-light)" fontSize={12} />
                  <YAxis stroke="var(--text-light)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="issued" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} name="Issued" />
                  <Line type="monotone" dataKey="returned" stroke="#059669" strokeWidth={2} dot={{ r: 4 }} name="Returned" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Books by Category</h3>
                <p className="chart-subtitle">Distribution across categories</p>
              </div>
            </div>
            {chartLoading ? (
              <div className="chart-loading">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Daily Activity</h3>
                <p className="chart-subtitle">Recent transactions</p>
              </div>
            </div>
            {chartLoading ? (
              <div className="chart-loading">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--text-light)" fontSize={11} />
                  <YAxis stroke="var(--text-light)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="issued" fill="#2563eb" name="Issued" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="returned" fill="#059669" name="Returned" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Book Status</h3>
                <p className="chart-subtitle">Current availability</p>
              </div>
            </div>
            {chartLoading ? (
              <div className="chart-loading">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="transactions-table">
          <div className="table-header">
            <TrendingUp size={20} />
            <h3>Recent Transactions</h3>
          </div>
          {stats?.recentTransactions?.length === 0 ? (
            <p className="text-center py-8" style={{ color: 'var(--text-light)' }}>No recent transactions</p>
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
                {stats?.recentTransactions?.map((trans) => (
                  <TableRow key={trans._id}>
                    <TableCell className="font-medium">{trans.book?.title}</TableCell>
                    <TableCell>{trans.user?.name}</TableCell>
                    <TableCell>{trans.issueDate ? new Date(trans.issueDate).toLocaleDateString() : '-'}</TableCell>
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
        </div>
      </div>
    </div>
  );
};

function getDefaultMonthly() {
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    issued: [12, 19, 25, 22, 30, 28, 35, 32, 40, 38, 45, 42],
    returned: [10, 15, 22, 20, 28, 25, 32, 30, 38, 35, 42, 40]
  };
}

function getDefaultCategories() {
  return [
    { name: 'Science', value: 45, color: '#2563eb' },
    { name: 'Arts', value: 30, color: '#7c3aed' },
    { name: 'Commerce', value: 25, color: '#059669' },
    { name: 'Engineering', value: 35, color: '#f59e0b' },
    { name: 'Literature', value: 20, color: '#ef4444' }
  ];
}

function getDefaultStatus() {
  return [
    { name: 'Available', value: 156, color: '#22c55e' },
    { name: 'Issued', value: 89, color: '#2563eb' },
    { name: 'Overdue', value: 12, color: '#ef4444' },
    { name: 'Returned', value: 234, color: '#8b5cf6' }
  ];
}

function getDefaultDaily() {
  return [
    { date: '01', issued: 5, returned: 3 },
    { date: '02', issued: 8, returned: 5 },
    { date: '03', issued: 12, returned: 8 },
    { date: '04', issued: 6, returned: 4 },
    { date: '05', issued: 9, returned: 7 },
    { date: '06', issued: 15, returned: 10 },
    { date: '07', issued: 11, returned: 9 }
  ];
}

export default Dashboard;