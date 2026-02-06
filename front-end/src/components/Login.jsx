import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import api from "../Util/AxiosConfig";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { username, password });
      if (data) {
        if (data.token) localStorage.setItem('jwt', data.token);
        const userObj = { username: data.username || username };
        if (data.id) userObj.id = data.id;
        if (data.role) userObj.role = data.role;
        if (data.email) userObj.email = data.email;
        localStorage.setItem('user', JSON.stringify(userObj));

        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || "Login failed. Please try again.");
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
      maxWidth: '420px',
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
      color: '#374151',
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
      transition: 'color 0.2s',
      marginLeft: '4px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <LogIn size={24} style={{ color: '#ec4899' }} />
          <h1 style={styles.title}>Sign In</h1>
        </div>

        <form style={styles.form} onSubmit={handleLogin}>
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              required
              placeholder="Enter your username"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            style={styles.button}
            type="submit"
            disabled={loading}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
            onMouseLeave={(e) => { e.target.style.boxShadow = 'none'; e.target.style.transform = 'none'; }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account?
          <Link to="/register" style={styles.link}>Create one</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
 /*function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

 /* const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:8080/api/auth/login", {
      username,
      password,
    });

    localStorage.setItem("token", res.data.token); // save the JWT
    alert("Login success!");
  } catch (err) {
    alert("Invalid username or password");
  }
}; 
// In your Login.js, after successful login:


  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button className="register"   type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login; */
