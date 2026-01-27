import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    fullName: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '"Inter", "Segoe UI", sans-serif'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(236, 72, 153, 0.15)',
      padding: '40px',
      maxWidth: '480px',
      width: '100%',
      border: '1px solid rgba(236, 72, 153, 0.1)'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '32px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      background: 'linear-gradient(to right, #ec4899, #be185d)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 0
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151'
    },
    input: {
      padding: '10px 14px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'inherit',
      transition: 'all 0.2s',
      outline: 'none'
    },
    inputFocus: {
      borderColor: '#ec4899',
      boxShadow: '0 0 0 3px rgba(236, 72, 153, 0.1)'
    },
    error: {
      padding: '12px',
      background: '#fee2e2',
      color: '#991b1b',
      borderRadius: '8px',
      fontSize: '14px',
      border: '1px solid #fecaca'
    },
    button: {
      padding: '12px 16px',
      background: 'linear-gradient(to right, #ec4899, #f43f5e)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginTop: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    buttonHover: {
      boxShadow: '0 6px 20px rgba(236, 72, 153, 0.4)',
      transform: 'translateY(-2px)'
    },
    footer: {
      textAlign: 'center',
      marginTop: '20px',
      fontSize: '14px',
      color: '#6b7280'
    },
    link: {
      color: '#ec4899',
      textDecoration: 'none',
      fontWeight: '600',
      marginLeft: '4px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <UserPlus size={24} style={{ color: '#ec4899' }} />
          <h1 style={styles.title}>Create Account</h1>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              required
              placeholder="Your full name"
            />
          </div>
           <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              style={styles.input}
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              required
              placeholder="Your phone number"
            />
          </div>
             

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              required
              placeholder="your@email.com"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              required
              placeholder="Choose a username"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              required
              minLength="4"
              placeholder="At least 4 characters"
            />
          </div>

          <button
            style={styles.button}
            type="submit"
            disabled={loading}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
            onMouseLeave={(e) => { e.target.style.boxShadow = 'none'; e.target.style.transform = 'none'; }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account?
          <Link to="/login" style={styles.link}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;