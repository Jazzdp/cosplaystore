import React, { useState } from "react";
import axios from "axios";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from refreshing page
    setError(""); // Clear previous errors
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store JWT token if present
        if (data.token) localStorage.setItem('jwt', data.token);

        // Build user object with available fields
        const userObj = {
          username: data.username || username,
        };
        if (data.id) userObj.id = data.id;

        localStorage.setItem('user', JSON.stringify(userObj));

        alert("Login success!");
        window.location.href = '/'; // Redirect to home
      } else {
        // Login failed
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button 
          className="register" 
          type="submit" 
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
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
