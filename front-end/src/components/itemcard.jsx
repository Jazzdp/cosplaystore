import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import '../styles/itemcard.css';
import { useCart } from '../context/CartContext';


export default function ItemCard({ product, showToast }) {
  const styles = {
    card: {
      background: 'white',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transition: 'all 0.4s ease',
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    cardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
    },
    imageContainer: {
      position: 'relative',
      overflow: 'hidden',
      height: '240px',
      background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.4s ease'
    },
    imageHover: {
      transform: 'scale(1.05)'
    },
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.8) 0%, rgba(190, 24, 93, 0.8) 100%)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px'
    },
    overlayVisible: {
      opacity: 1
    },
    actionButton: {
      background: 'rgba(255,255,255,0.9)',
      border: 'none',
      borderRadius: '50%',
      width: '45px',
      height: '45px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
    },
    actionButtonHover: {
      background: 'white',
      transform: 'scale(1.1)'
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
    heartButton: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'rgba(255,255,255,0.9)',
      border: 'none',
      borderRadius: '50%',
      width: '35px',
      height: '35px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
    },
    heartButtonActive: {
      background: '#ec4899',
      color: 'white'
    },
    content: {
      padding: '25px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    title: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '8px',
      lineHeight: '1.4',
      textDecoration: 'none'
    },
    titleHover: {
      color: '#ec4899'
    },
    price: {
      fontSize: '1.4rem',
      fontWeight: '700',
      color: '#ec4899',
      marginBottom: '12px'
    },
    description: {
      color: '#6b7280',
      fontSize: '0.9rem',
      lineHeight: '1.5',
      marginBottom: '20px',
      flex: 1,
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 'auto'
    },
    stockInfo: {
      fontSize: '0.8rem',
      color: '#6b7280',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    stockDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#10b981'
    },
    stockDotLow: {
      background: '#f59e0b'
    },
    stockDotOut: {
      background: '#ef4444'
    },
    addToCartButton: {
      background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      padding: '8px 16px',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      boxShadow: '0 5px 15px rgba(236, 72, 153, 0.3)'
    },
    addToCartButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(236, 72, 153, 0.4)'
    }
  };

  const [isHovered, setIsHovered] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(false);
  const [imageOverlayHovered, setImageOverlayHovered] = React.useState(false);
  const [loadingWishlist, setLoadingWishlist] = React.useState(false);

  React.useEffect(() => {
    // Check if product is in wishlist on mount
    const checkWishlist = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) return;
      try {
        const res = await fetch(`http://localhost:8080/api/wishlist/check/${product.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const text = await res.text();
          const isInWishlist = text === 'true';
          setIsLiked(isInWishlist);
        }
      } catch (err) {
        console.error('Error checking wishlist:', err);
      }
    };
    checkWishlist();
  }, [product.id]);

  const getStockStatus = (stockQuantity) => {
    if (stockQuantity === 0) return { text: 'Out of Stock', color: styles.stockDotOut };
    if (stockQuantity  < 5) return { text: 'Low Stock', color: styles.stockDotLow };
    return { text: 'In Stock', color: styles.stockDot };
  };

  const stockStatus = getStockStatus(product.stockQuantity);

  const { addToCart } = useCart();

  const cartProduct = { ...product, image: product.imageUrl };

  const handleAddToCart = (e, qty = 1) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!product || product.stockQuantity === 0) {
      // cannot add out of stock
      try {
        window.dispatchEvent(new CustomEvent('out-of-stock', { detail: { product: cartProduct } }));
      } catch (err) { /* ignore */ }
      return;
    }

    addToCart(cartProduct, qty);
    if (typeof showToast === 'function') {
      showToast();
    } else {
      // fallback: dispatch event so App can show toast
      try {
        window.dispatchEvent(new CustomEvent('added-to-cart', { detail: { product: cartProduct, quantity: qty } }));
      } catch (err) {
        /* ignore */
      }
    }
  };

  return (
    <div 
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
        <div 
          style={styles.imageContainer}
          onMouseEnter={() => setImageOverlayHovered(true)}
          onMouseLeave={() => setImageOverlayHovered(false)}
        >
          <img 
            src={product.imageUrl || '/placeholder-image.jpg'} 
            alt={product.name}
            style={{
              ...styles.image,
              ...(isHovered ? styles.imageHover : {})
            }}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkNFN0YzIi8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzEyNy45IDEwMCAxMTAgMTE3LjkgMTEwIDE0MFYxNjBDMTEwIDE4Mi4xIDEyNy45IDIwMCAxNTAgMjAwQzE3Mi4xIDIwMCAxOTAgMTgyLjEgMTkwIDE2MFYxNDBDMTkwIDExNy45IDE3Mi4xIDEwMCAxNTAgMTAwWiIgZmlsbD0iI0VDNDg5OSIvPgo8Y2lyY2xlIGN4PSIxMzUiIGN5PSIxMjUiIHI9IjUiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjE2NSIgY3k9IjEyNSIgcj0iNSIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEzNSAxNTVDMTM1IDE1NS4yIDEzNS4xOTEgMTU1IDEzOSAxNTVIMTYxQzE2NC44MDkgMTU1IDE2NSAxNTUuMiAxNjUgMTU1IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K';
            }}
          />
          
          {/* Image Overlay */}
          <div 
            style={{
              ...styles.imageOverlay,
              ...(imageOverlayHovered ? styles.overlayVisible : {})
            }}
          >
            <button 
              style={styles.actionButton}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.actionButtonHover)}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.9)';
                e.target.style.transform = 'scale(1)';
              }}
              onClick={(e) => handleAddToCart(e, 1)}
            >
              <ShoppingCart size={20} style={{color: '#ec4899'}} />
            </button>
            
            
             
          
          </div>

          {/* Price Badge */}
          <div style={styles.badge}>
            ${product.price}
          </div>

          {/* Heart Button */}
          <button 
            style={{
              ...styles.heartButton,
              ...(isLiked ? styles.heartButtonActive : {})
            }}
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              const token = localStorage.getItem('jwt');
              console.debug('itemcard wishlist toggle, jwt present:', !!token, 'productId:', product.id);
              if (!token) {
                window.location.href = '/login';
                return;
              }
              setLoadingWishlist(true);
              try {
                // Use toggle endpoint to avoid DELETE/CORS issues
                const res = await fetch(`http://localhost:8080/api/wishlist/toggle/${product.id}`, {
                  method: 'POST',
                  headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                  const body = await res.json().catch(() => ({}));
                  if (body.status === 'removed') setIsLiked(false);
                  else if (body.status === 'added') setIsLiked(true);
                  else setIsLiked(!isLiked);
                } else {
                  console.warn('Wishlist toggle failed', res.status);
                }
              } catch (err) {
                console.error('Error updating wishlist:', err);
              } finally {
                setLoadingWishlist(false);
              }
            }}
            disabled={loadingWishlist}
          >
            <Heart 
              size={18} 
              style={{
                color: isLiked ? 'white' : '#ec4899',
                fill: isLiked ? 'white' : 'none'
              }} 
            />
          </button>
        </div>
      </Link>

      <div style={styles.content}>
        <Link to={`/products/${product.id}`} style={{textDecoration: 'none'}}>
          <h3 
            style={{
              ...styles.title,
              ...(isHovered ? styles.titleHover : {})
            }}
          >
            {product.name}
          </h3>
        </Link>
        
        {product.description && (
          <p style={styles.description}>
            {product.description}
          </p>
        )}

        <div style={styles.footer}>
          <div style={styles.stockInfo}>
            <div style={{...styles.stockDot, ...stockStatus.color}}></div>
            {stockStatus.text} ({product.stockQuantity})
          </div>
          
          <button 
            style={{
              ...styles.addToCartButton,
              opacity: product.stockQuantity === 0 ? 0.6 : 1,
              cursor: product.stockQuantity === 0 ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => product.stockQuantity > 0 && Object.assign(e.target.style, styles.addToCartButtonHover)}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 5px 15px rgba(236, 72, 153, 0.3)';
            }}
            onClick={(e) => handleAddToCart(e, 1)}
            disabled={product.stockQuantity === 0}
            aria-disabled={product.stockQuantity === 0}
          >
            <ShoppingCart size={16} />
            {product.stockQuantity === 0 ? 'Out of Stock' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}