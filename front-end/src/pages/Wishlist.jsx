import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import '../styles/itemcard.css';
import api from '../Util/AxiosConfig';
import authenticatedApi from '../Util/AxiosConfig';
// Wishlist Card Component
function WishlistCard({ product, onRemove, navigate, styles }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.imageContainer}>
        <img
          src={product.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkNFN0YzIi8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzEyNy45IDEwMCAxMTAgMTE3LjkgMTEwIDE0MFYxNjBDMTEwIDE4Mi4xIDEyNy45IDIwMCAxNTAgMjAwQzE3Mi4xIDIwMCAxOTAgMTgyLjEgMTkwIDE2MFYxNDBDMTkwIDExNy45IDE3Mi4xIDEwMCAxNTAgMTAwWiIgZmlsbD0iI0VDNDg5OSIvPgo8Y2lyY2xlIGN4PSIxMzUiIGN5PSIxMjUiIHI9IjUiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjE2NSIgY3k9IjEyNSIgcj0iNSIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEzNSAxNTVDMTM1IDE1NS4yIDEzNS4xOTEgMTU1IDEzOSAxNTVIMTYxQzE2NC44MDkgMTU1IDE2NSAxNTUuMiAxNjUgMTU1IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K'}
          alt={product.name}
          style={{
            ...styles.image,
            ...(isHovered ? { transform: 'scale(1.05)' } : {})
          }}
        />
        <div style={styles.badge}>
          ${product.price}
        </div>
      </div>

      <div style={styles.content}>
        <h3 style={styles.title2}>{product.name}</h3>
        <p style={styles.description}>{product.description}</p>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '12px' }}>
          Stock: {product.stockQuantity} available
        </p>
        <div style={styles.footer}>
          <button
            onClick={() => navigate(`/products/${product.id}`)}
            style={styles.viewButton}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 5px 15px rgba(236, 72, 153, 0.3)';
            }}
          >
            View Details
          </button>
          <button
            onClick={() => onRemove(product.id)}
            style={styles.removeButton}
            onMouseEnter={(e) => e.target.style.background = '#fce7f3'}
            onMouseLeave={(e) => e.target.style.background = '#fff'}
          >
            <Heart size={18} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWithAuth = (url) => {
    const jwt = localStorage.getItem('jwt');
    return fetch(url, { headers: jwt ? { Authorization: `Bearer ${jwt}` } : {} });
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    const load = async () => {
      try {
        const res = await authenticatedApi.get('/api/wishlist/me');
        if (!res.ok) throw new Error(`Failed to load wishlist (${res.status})`);
        const data = await res.json();
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Wishlist load error', err);
        setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      const jwt = localStorage.getItem('jwt');
      console.debug('Wishlist remove, jwt present:', !!jwt, 'productId:', productId);
      const res = await authenticatedApi.post(`/api/wishlist/toggle/${productId}`);
      console.debug('Wishlist toggle response status:', res.status);
      if (res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.status === 'removed') setItems(items.filter(item => item.id !== productId));
        else if (body.status === 'added') setItems([...items, body.product].filter(Boolean));
        else setItems(items.filter(item => item.id !== productId));
      } else {
        alert('Failed to remove from wishlist');
      }
    } catch (err) {
      console.error('Remove error', err);
      alert('Failed to remove from wishlist');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)',
      padding: '40px 20px'
    },
    header: {
      maxWidth: '1400px',
      margin: '0 auto 40px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      background: 'linear-gradient(to right, #ec4899, #f43f5e)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      boxShadow: '0 4px 6px rgba(236, 72, 153, 0.3)',
      transition: 'all 0.2s'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1f2937',
      flex: 1,
      textAlign: 'center'
    },
    gridContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '24px'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transition: 'all 0.4s ease',
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer'
    },
    cardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
    },
    imageContainer: {
      position: 'relative',
      overflow: 'hidden',
      height: '220px',
      background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.4s ease'
    },
    badge: {
      position: 'absolute',
      top: '15px',
      left: '15px',
      background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      color: 'white',
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      boxShadow: '0 5px 15px rgba(236, 72, 153, 0.3)'
    },
    content: {
      padding: '20px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    title2: {
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '8px',
      lineHeight: '1.4'
    },
    description: {
      color: '#6b7280',
      fontSize: '0.9rem',
      lineHeight: '1.5',
      marginBottom: '12px',
      flex: 1,
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    },
    footer: {
      display: 'flex',
      gap: '10px',
      marginTop: 'auto'
    },
    viewButton: {
      flex: 1,
      padding: '10px 16px',
      background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 5px 15px rgba(236, 72, 153, 0.3)'
    },
    removeButton: {
      padding: '10px 16px',
      background: '#fff',
      border: '2px solid #ec4899',
      color: '#ec4899',
      borderRadius: '10px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#6b7280'
    },
    emptyIcon: {
      width: '64px',
      height: '64px',
      margin: '0 auto 20px',
      opacity: 0.3
    }
  };

  const backButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'linear-gradient(to right, #ec4899, #f43f5e)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    boxShadow: '0 4px 6px rgba(236, 72, 153, 0.3)',
    transition: 'all 0.2s'
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          style={backButtonStyle}
          onClick={() => navigate(-1)}
          onMouseEnter={(e) => e.target.style.boxShadow = '0 6px 12px rgba(236, 72, 153, 0.4)'}
          onMouseLeave={(e) => e.target.style.boxShadow = '0 4px 6px rgba(236, 72, 153, 0.3)'}
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 style={styles.title}>❤️ My Wishlist</h1>
        <div style={{ width: '80px' }}></div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          Loading wishlist…
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div style={styles.emptyState}>
          <Heart style={styles.emptyIcon} />
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>Your wishlist is empty</p>
          <button
            onClick={() => navigate('/products')}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(to right, #ec4899, #f43f5e)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Continue Shopping
          </button>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div style={styles.gridContainer}>
          {items.map(product => (
            <WishlistCard 
              key={product.id} 
              product={product} 
              onRemove={removeFromWishlist}
              navigate={navigate}
              styles={styles}
            />
          ))}
        </div>
      )}
    </div>
  );
}
