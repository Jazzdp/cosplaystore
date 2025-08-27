import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleRegister = () => {
    window.location.href = '/register';
  };

  const handleLogout = () => {
    setLoading(true);
    
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setUser(null);
    
    setTimeout(() => {
      setLoading(false);
      setIsSidebarOpen(false);
    }, 500);
  };

  const headerStyle = {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #fce7f3',
    position: 'relative',
    zIndex: 10
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px'
  };

  const flexStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px'
  };

  const logoStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #ec4899, #f43f5e)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const navStyle = {
    display: 'flex',
    gap: '32px'
  };

  const linkStyle = {
    color: '#374151',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s'
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(to right, #ec4899, #f43f5e)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '500',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s'
  };

  const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 40,
    display: isSidebarOpen ? 'block' : 'none'
  };

  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100vh',
    width: '320px',
    backgroundColor: 'white',
    boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.2)',
    zIndex: 50,
    transform: isSidebarOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease-in-out'
  };

  const sidebarHeaderStyle = {
    background: 'linear-gradient(to right, #fce7f3, #fdf2f8)',
    padding: '24px',
    borderBottom: '1px solid #fbcfe8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    // In your sidebarStyle, change width:
    width: window.innerWidth <= 768 ? '100vw' : '320px',
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#6b7280',
    cursor: 'pointer',
    lineHeight: 1
  };

  const contentStyle = {
    padding: '24px',
    height: 'calc(100vh - 88px)',
    overflowY: 'auto'
  };

  const avatarStyle = {
    width: '64px',
    height: '64px',
    background: user ? 'linear-gradient(to right, #f472b6, #fb7185)' : '#fce7f3',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    color: user ? 'white' : '#ec4899',
    fontSize: user ? '20px' : '32px',
    fontWeight: 'bold'
  };

  const primaryButtonStyle = {
    width: '100%',
    background: 'linear-gradient(to right, #ec4899, #f43f5e)',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '500',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
    transition: 'all 0.2s',
    marginBottom: '12px'
  };

  const secondaryButtonStyle = {
    width: '100%',
    border: '2px solid #f9a8d4',
    color: '#ec4899',
    background: 'transparent',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  const menuButtonStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginBottom: '8px'
  };

  const logoutButtonStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

// Add this style object at the top of your Header component
const mobileStyles = {
  '@media (max-width: 768px)': {
    nav: { display: 'none' },
    mobileButton: { display: 'block' },
    mobileMenu: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: isMobileMenuOpen ? 'block' : 'none',
      zIndex: 20
    }
  }
};
  return (
    <div>
      {/* Header */}
      <header style={headerStyle}>
        <div style={containerStyle}>
          <div style={flexStyle}>
            
            {/* Logo */}
            <div>
              <h1 style={logoStyle}>CosplayStore</h1>
            </div>

            {/* Navigation */}
            
{/* Navigation - Desktop */}
<nav style={{ display: window.innerWidth > 768 ? 'flex' : 'none', gap: '32px' }}>
  <a href="/" style={linkStyle}>Home</a>
  <a href="/products" style={linkStyle}>Products</a>
  <a href="category" style={linkStyle}>Categories</a>
  <a href="/cart" style={linkStyle}>Your Cart</a>
</nav>

{/* Mobile Menu Button */}
<button 
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  style={{
    display: window.innerWidth <= 768 ? 'block' : 'none',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer'
  }}
>
  ☰
</button>

{/* Mobile Menu */}
{isMobileMenuOpen && (
  <div style={{
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 20,
    padding: '16px'
  }}>
    <a href="/" style={{...linkStyle, display: 'block', padding: '12px 0'}}>Home</a>
    <a href="/prodcuts" style={{...linkStyle, display: 'block', padding: '12px 0'}}>Products</a>
    <a href="/category" style={{...linkStyle, display: 'block', padding: '12px 0'}}>Categories</a>
    <a href="cart" style={{...linkStyle, display: 'block', padding: '12px 0'}}>Your Cart</a>
  </div>
)}
            
            {/* Account Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={buttonStyle}
            >
              👤 {user ? user.username || 'Account' : 'Account'}
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div 
        style={backdropStyle}
        onClick={() => setIsSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      <div style={sidebarStyle}>
        
        {/* Sidebar Header */}
        <div style={sidebarHeaderStyle}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#374151' }}>My Account</h2>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            style={closeButtonStyle}
          >
            ×
          </button>
        </div>

        {/* Sidebar Content */}
        <div style={contentStyle}>
          {!user ? (
            // Not logged in state
            <div style={{ textAlign: 'center' }}>
              <div style={avatarStyle}>👤</div>
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Welcome!
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
                Sign in to access your account and enjoy personalized shopping.
              </p>
              
              <button onClick={handleLogin} style={primaryButtonStyle}>
                Sign In
              </button>
              
              <button onClick={handleRegister} style={secondaryButtonStyle}>
                Create Account
              </button>
              
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '24px' }}>
                By signing in, you agree to our Terms & Privacy Policy
              </div>
            </div>
          ) : (
            // Logged in state
            <div>
              {/* User Info */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={avatarStyle}>
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#374151' }}>
                  {user.fullName || user.username}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>{user.email}</p>
                {user.role && (
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    backgroundColor: '#fce7f3',
                    color: '#be185d',
                    fontSize: '12px',
                    borderRadius: '20px',
                    marginTop: '8px'
                  }}>
                    {user.role.replace('ROLE_', '')}
                  </span>
                )}
              </div>

              {/* Menu Options */}
              <div style={{ marginBottom: '24px' }}>
                <button 
                  style={menuButtonStyle}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#fef7f7'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  📦 My Orders
                </button>
                <button 
                  style={menuButtonStyle}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#fef7f7'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  ❤️ Wishlist
                </button>
                <button 
                  style={menuButtonStyle}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#fef7f7'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  ⚙️ Account Settings
                </button>
                
                {user.role === 'ROLE_ADMIN' && (
                  <button 
                    style={{
                      ...menuButtonStyle,
                      background: 'linear-gradient(to right, #f3e8ff, #fce7f3)',
                      color: '#7c3aed'
                    }}
                  >
                    🔧 Admin Dashboard
                  </button>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                disabled={loading}
                style={logoutButtonStyle}
                onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              >
                🚪 {loading ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;