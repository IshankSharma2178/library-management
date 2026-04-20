import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, User, Mail, Lock, Phone, GraduationCap, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    studentId: '',
    department: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const showStudentFields = formData.role === 'student';

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.role === 'student') {
      if (!formData.studentId.trim()) {
        newErrors.studentId = 'Student ID is required';
      }
      if (!formData.department.trim()) {
        newErrors.department = 'Department is required';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="auth-bg-shapes">
        <div className="auth-shape auth-shape-1"></div>
        <div className="auth-shape auth-shape-2"></div>
        <div className="auth-shape auth-shape-3"></div>
        <div className="auth-shape auth-shape-4"></div>
      </div>

      <div className="auth-brand">
        <div className="auth-brand-logo">
          <BookOpen />
        </div>
        <h1>GLA University Library</h1>
        <p>Join our community of learners. Access thousands of books, journals, and resources to enhance your academic journey.</p>
      </div>

      <div className="auth-card">
        <div className="auth-card-header">
          <div className="auth-card-icon">
            <BookOpen />
          </div>
          <h1>Create Account</h1>
          <p className="auth-subtitle">Join the GLA University Library</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User />
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter your full name"
                className={errors.name ? 'input-error' : ''}
              />
            </div>
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail />
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Enter your email"
                className={errors.email ? 'input-error' : ''}
              />
            </div>
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Create a password"
                className={errors.password ? 'input-error' : ''}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label>Role</label>
            <div className="input-wrapper">
              <GraduationCap />
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {showStudentFields && (
            <div className="form-row">
              <div className="form-group">
                <label>Student ID</label>
                <div className="input-wrapper">
                  <GraduationCap />
                  <input 
                    type="text" 
                    name="studentId" 
                    value={formData.studentId || ''} 
                    onChange={handleChange} 
                    placeholder="Enter student ID"
                    className={errors.studentId ? 'input-error' : ''}
                  />
                </div>
                {errors.studentId && <p className="field-error">{errors.studentId}</p>}
              </div>

              <div className="form-group">
                <label>Department</label>
                <div className="input-wrapper">
                  <GraduationCap />
                  <input 
                    type="text" 
                    name="department" 
                    value={formData.department || ''} 
                    onChange={handleChange} 
                    placeholder="Enter department"
                    className={errors.department ? 'input-error' : ''}
                  />
                </div>
                {errors.department && <p className="field-error">{errors.department}</p>}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Phone</label>
            <div className="input-wrapper">
              <Phone />
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="Enter 10-digit phone number"
                className={errors.phone ? 'input-error' : ''}
              />
            </div>
            {errors.phone && <p className="field-error">{errors.phone}</p>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;