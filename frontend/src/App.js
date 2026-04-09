import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Students from './pages/Students';
import Transactions from './pages/Transactions';
import Dashboard from './pages/Dashboard';
import MyBooks from './pages/MyBooks';
import Profile from './pages/Profile';
import Requests from './pages/Requests';
import AddBook from './pages/AddBook';
import UpdateBook from './pages/UpdateBook';
import Categories from './pages/Categories';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="loading">Loading...</div>;
  return user?.role === 'admin' ? children : <Navigate to="/" />;
};

const AppLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className="app-layout">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {children}
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div className="loading">Loading...</div>;

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const showLayout = user && !isAuthPage;

  if (showLayout) {
    return (
      <AppLayout>
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/add-book" element={<AdminRoute><AddBook /></AdminRoute>} />
            <Route path="/update-book" element={<AdminRoute><UpdateBook /></AdminRoute>} />
            <Route path="/categories" element={<AdminRoute><Categories /></AdminRoute>} />
            <Route path="/my-books" element={<PrivateRoute><MyBooks /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/students" element={<AdminRoute><Students /></AdminRoute>} />
            <Route path="/requests" element={<AdminRoute><Requests /></AdminRoute>} />
            <Route path="/transactions" element={<AdminRoute><Transactions /></AdminRoute>} />
            <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          </Routes>
        </main>
      </AppLayout>
    );
  }

  return (
    <main className="container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/book/:id" element={<BookDetails />} />
      </Routes>
    </main>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar />
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
