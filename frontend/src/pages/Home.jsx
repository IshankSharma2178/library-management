import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Library, Users, BookMarked, Clock, Award, ChevronRight } from 'lucide-react';
import { transactionService, userService } from '../services/api';

const Home = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalStudents: 0,
    booksIssued: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await transactionService.getStats();
      setStats({
        totalBooks: res.data.totalBooks || 0,
        totalStudents: res.data.totalStudents || 0,
        booksIssued: res.data.totalIssued || 0
      });
    } catch (err) {
      console.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Browse Books',
      description: 'Search and explore our vast collection of books across various categories',
      link: '/books',
      color: '#2563eb'
    },
    {
      icon: Search,
      title: 'Quick Search',
      description: 'Find books by title, author, or ISBN instantly',
      link: '/books',
      color: '#7c3aed'
    },
    {
      icon: BookMarked,
      title: 'My Library',
      description: 'Track your borrowed books and borrowing history',
      link: '/my-books',
      color: '#059669'
    }
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to College Library</h1>
          <p className="hero-subtitle">Your gateway to knowledge and learning</p>
          <div className="hero-buttons">
            <Link to="/books" className="btn btn-primary btn-lg">
              Explore Books <ChevronRight size={20} />
            </Link>
            {!localStorage.getItem('token') && (
              <Link to="/register" className="btn btn-outline btn-lg">
                Join Library
              </Link>
            )}
          </div>
        </div>
        <div className="hero-pattern"></div>
      </section>

      {!loading && (
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <Library className="stat-icon" size={32} />
              <div className="stat-number">{stats.totalBooks}</div>
              <div className="stat-label">Total Books</div>
            </div>
            <div className="stat-card">
              <Users className="stat-icon" size={32} />
              <div className="stat-number">{stats.totalStudents}</div>
              <div className="stat-label">Registered Students</div>
            </div>
            <div className="stat-card">
              <BookMarked className="stat-icon" size={32} />
              <div className="stat-number">{stats.booksIssued}</div>
              <div className="stat-label">Books Issued</div>
            </div>
          </div>
        </section>
      )}

      <section className="features-section">
        <h2 className="section-title">Quick Access</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link} className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                <feature.icon size={28} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <span className="feature-link">
                Get Started <ChevronRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="info-section">
        <div className="info-card">
          <Clock className="info-icon" size={24} />
          <div className="info-content">
            <h3> Borrowing Periods</h3>
            <p>Choose from 7, 14, or 30 day borrowing periods. Returns after due date incur ₹1/day fine.</p>
          </div>
        </div>
        <div className="info-card">
          <Award className="info-icon" size={24} />
          <div className="info-content">
            <h3>Request Books</h3>
            <p>Can't find what you're looking for? Submit a book request and our admins will process it.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
