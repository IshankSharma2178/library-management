import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Library,
  Users,
  BookMarked,
  Clock,
  Award,
  ChevronRight,
  Star,
  Mail,
  MapPin,
  Phone,
  Globe,
  BookHeart,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { transactionService } from '../services/api';

const Home = () => {
const [stats, setStats] = useState({
    totalBooks: 156,
    totalStudents: 89,
    booksIssued: 42
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await transactionService.getStats();
      setStats({
        totalBooks: res.data.totalBooks || 0,
        totalStudents: res.data.totalStudents || 0,
        booksIssued: res.data.totalIssued || 0,
      });
    } catch (err) {
      console.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: "Browse Books",
      description:
        "Search and explore our vast collection of books across various categories",
      link: "/books",
      color: "#2563eb",
      shadow: "rgba(37, 99, 235, 0.3)",
    },
    {
      icon: Search,
      title: "Quick Search",
      description: "Find books by title, author, or ISBN instantly",
      link: "/books",
      color: "#7c3aed",
      shadow: "rgba(124, 58, 237, 0.3)",
    },
    {
      icon: BookMarked,
      title: "My Library",
      description: "Track your borrowed books and borrowing history",
      link: "/my-books",
      color: "#059669",
      shadow: "rgba(5, 150, 105, 0.3)",
    },
    {
      icon: BookHeart,
      title: "Book Requests",
      description: "Request books that are not in our collection",
      link: "/my-books",
      color: "#dc2626",
      shadow: "rgba(220, 38, 38, 0.3)",
    },
  ];

  const statsData = [
    { label: "Books Available", value: stats.totalBooks, suffix: "+" },
    { label: "Active Readers", value: stats.totalStudents, suffix: "" },
    { label: "Books Issued", value: stats.booksIssued, suffix: "" },
    { label: "Categories", value: 15, suffix: "+" },
  ];

  const aboutItems = [
    {
      icon: Clock,
      title: "Library Hours",
      content: "Mon-Sat: 8:00 AM - 8:00 PM",
    },
    {
      icon: MapPin,
      title: "Location",
      content: "GLA University Campus, Mathura",
    },
    { icon: Mail, title: "Email", content: "library@gla.ac.in" },
    { icon: Phone, title: "Contact", content: "+91 1234567890" },
  ];

return (
    <div className="home-page">
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .stat-card-show { animation: slideUp 0.6s ease-out both; }
        .stat-card-show:nth-child(1) { animation-delay: 0.1s; }
        .stat-card-show:nth-child(2) { animation-delay: 0.2s; }
        .stat-card-show:nth-child(3) { animation-delay: 0.3s; }
        .stat-card-show:nth-child(4) { animation-delay: 0.4s; }
        .feature-card-show { animation: slideUp 0.5s ease-out both; }
        .feature-card-show:nth-child(1) { animation-delay: 0.1s; }
        .feature-card-show:nth-child(2) { animation-delay: 0.2s; }
        .feature-card-show:nth-child(3) { animation-delay: 0.3s; }
        .feature-card-show:nth-child(4) { animation-delay: 0.4s; }
        .hero-btn-primary {
          padding: 0.875rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          background: white;
          color: #2563eb !important;
          border-radius: 10px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        }
        .hero-btn-outline {
          padding: 0.875rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          background: transparent;
          color: white !important;
          border: 2px solid white;
          border-radius: 10px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
        }
        .hero-btn-outline:hover {
          background: rgba(255,255,255,0.15);
        }
      `}</style>
      
      {/* Hero Section */}
      <section style={{ 
        padding: '7rem 2rem',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 60%, #7c3aed 100%)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        color: 'white',
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)',
        }}></div>
        <div style={{
          position: 'absolute',
          top: '10%', right: '5%',
          width: '250px', height: '250px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '15%', left: '8%',
          width: '180px', height: '180px',
          border: '2px solid rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite',
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            fontSize: '0.85rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '1.5rem',
            background: 'rgba(255,255,255,0.15)',
            padding: '0.6rem 1.5rem',
            borderRadius: '30px',
            backdropFilter: 'blur(10px)',
          }}>Welcome to</div>
          
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', lineHeight: 1.2 }}>
            <div>GLA University Library</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '500', letterSpacing: '5px', marginTop: '0.75rem', opacity: 0.75, textTransform: 'uppercase' }}>Mathura</div>
          </h1>
          
          <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            Your gateway to knowledge, research & academic excellence. Access thousands of books, journals, and digital resources.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/books" className="hero-btn-primary">
              Explore Books <ChevronRight size={20} />
            </Link>
            {!localStorage.getItem('token') && (
              <Link to="/register" className="hero-btn-outline">
                Join Library
              </Link>
            )}
          </div>
        </div>
      </section>

{/* Stats Section */}
      {!loading && (
        <section style={{ padding: '3rem 2rem', background: 'var(--card)', marginTop: '-1px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            {statsData.map((stat, index) => (
              <div key={index} className="stat-card-show" style={{ 
                background: 'var(--card)', 
                borderRadius: '16px', 
                padding: '2rem', 
                textAlign: 'center',
                border: '1px solid var(--border)',
                transition: 'all 0.3s',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#2563eb' }}>{stat.value}{stat.suffix}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '0.5rem', fontWeight: '500' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section style={{ padding: '4rem 2rem', background: 'var(--background)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', textAlign: 'center', marginBottom: '1rem', color: 'var(--text)' }}>Quick Access</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>Navigate through our library services with ease</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          {features.map((feature, index) => (
            <Link key={index} to={feature.link} className="feature-card-show" style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '2rem', 
              border: '1px solid var(--border)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.3s',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{ 
                width: '56px', height: '56px', borderRadius: '14px', 
                background: `linear-gradient(135deg, ${feature.color}15, ${feature.color}08)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.25rem', color: feature.color 
              }}>
                <feature.icon size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '0.5rem' }}>{feature.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1rem', lineHeight: 1.5 }}>{feature.description}</p>
              <span style={{ color: feature.color, fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Get Started <ChevronRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section style={{ padding: '4rem 2rem', background: 'var(--card)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', textAlign: 'center', marginBottom: '1rem', color: 'var(--text)' }}>About Our Library</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>Discover what makes GLA University Library special</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { icon: '📚', title: 'Extensive Collection', desc: 'Over 50,000 books covering Engineering, Management, Arts, Science and more.' },
            { icon: '💻', title: 'Digital Resources', desc: 'Access e-books, journals, and online databases from anywhere.' },
            { icon: '🎓', title: 'Academic Support', desc: 'Research assistance, citation help, and library workshops.' },
            { icon: '☕', title: 'Reading Spaces', desc: 'Quiet study areas, group rooms, and comfortable lounge.' },
          ].map((item, index) => (
            <div key={index} style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '2rem', 
              border: '1px solid var(--border)',
              textAlign: 'center',
              transition: 'all 0.3s',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text)' }}>{item.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section style={{ padding: '4rem 2rem', background: 'var(--background)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { icon: Clock, title: 'Borrowing Periods', desc: '7, 14, or 30 day periods. ₹1/day fine after due date.' },
            { icon: Award, title: 'Request Books', desc: "Can't find a book? Submit a request and we will process it." },
            { icon: TrendingUp, title: 'New Arrivals', desc: 'Check our new arrivals section for the latest books.' },
          ].map((item, index) => (
            <div key={index} style={{ 
              background: 'var(--card)', 
              borderRadius: '12px', 
              padding: '1.5rem', 
              border: '1px solid var(--border)',
              display: 'flex', gap: '1rem',
              alignItems: 'flex-start',
            }}>
              <item.icon size={24} style={{ color: '#2563eb', flexShrink: 0, marginTop: '0.25rem' }} />
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: '4rem 2rem', background: 'var(--card)', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', textAlign: 'center', marginBottom: '2.5rem', color: 'var(--text)' }}>Contact Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          {aboutItems.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', alignItems: 'center', gap: '1rem',
              background: 'var(--background)', 
              borderRadius: '12px', 
              padding: '1.5rem', 
              border: '1px solid var(--border)',
            }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '12px', 
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', flexShrink: 0 
              }}>
                {item.icon && <item.icon size={22} />}
              </div>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text)', marginBottom: '0.25rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        background: 'var(--background)', 
        borderTop: '1px solid var(--border)',
        color: 'var(--text-light)',
      }}>
        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>&copy; 2024 GLA University Library, Mathura. All rights reserved.</p>
        <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Developed with ❤️ for GLA University</p>
      </footer>
    </div>
  );
};

export default Home;
