import React, { useEffect, useState } from "react";
import { useCart } from '../context/CartContext';
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Share2, Star, Truck, Shield, RotateCcw } from "lucide-react";
import '../styles/productdetail.css';
import api, { authenticatedApi } from "../Util/AxiosConfig";
// Helper function to calculate total stock from sizes
const getTotalStock = (sizes) => {
  if (!sizes || !Array.isArray(sizes)) return 0;
  return sizes.reduce((total, size) => total + (size.stock || 0), 0);
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    api.get(`/products/${id}`)
      .then((res) => {
        const data = res.data;
        setProduct(data);
        // Auto-select first size if available
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [id]);

  // Check if product is in wishlist on mount
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token || !id) return;
    try {
      authenticatedApi.get(`/wishlist/check/${id}`)
        .then(res => {
          setIsLiked(String(res.data) === 'true');
        })
        .catch(err => console.error('Error checking wishlist:', err));
    } catch (err) {
      console.error('Error checking wishlist:', err);
    }
  }, [id]);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)',
      fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    },
    heroSection: {
      background: 'linear-gradient(135deg, #ec4899 0%, #be185d 50%, #9d174d 100%)',
      padding: '40px 20px',
      color: 'white'
    },
    heroContent: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: 'white',
      textDecoration: 'none',
      fontSize: '1rem',
      padding: '8px 16px',
      borderRadius: '8px',
      background: 'rgba(255,255,255,0.1)',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px'
    },
    productContainer: {
      background: 'white',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
    },
    productGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0'
    },
    imageSection: {
      padding: '40px',
      background: 'linear-gradient(135deg, #fef7ff 0%, #fce7f3 100%)',
      display: 'flex',
      flexDirection: 'column'
    },
    mainImage: {
      width: '100%',
      height: '400px',
      objectFit: 'cover',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    },
    thumbnailContainer: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center'
    },
    thumbnail: {
      width: '60px',
      height: '60px',
      objectFit: 'cover',
      borderRadius: '8px',
      cursor: 'pointer',
      opacity: 0.6,
      transition: 'all 0.3s ease',
      border: '2px solid transparent'
    },
    thumbnailActive: {
      opacity: 1,
      border: '2px solid #ec4899'
    },
    infoSection: {
      padding: '40px',
      display: 'flex',
      flexDirection: 'column'
    },
    category: {
      color: '#ec4899',
      fontSize: '0.9rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '10px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#1f2937',
      lineHeight: '1.2',
      marginBottom: '15px'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '20px'
    },
    stars: {
      display: 'flex',
      gap: '2px'
    },
    ratingText: {
      color: '#6b7280',
      fontSize: '0.9rem'
    },
    price: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#ec4899',
      marginBottom: '20px'
    },
    description: {
      color: '#4b5563',
      lineHeight: '1.6',
      marginBottom: '30px',
      fontSize: '1rem'
    },
    stockSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '30px',
      padding: '15px',
      background: '#f0fdf4',
      borderRadius: '12px',
      border: '1px solid #bbf7d0'
    },
    stockDot: {
      width: '8px',
      height: '8px',
      background: '#10b981',
      borderRadius: '50%'
    },
    stockText: {
      color: '#065f46',
      fontWeight: '600'
    },
    quantitySection: {
      marginBottom: '30px'
    },
    quantityLabel: {
      display: 'block',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '10px'
    },
    quantityControl: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    quantityButton: {
      width: '40px',
      height: '40px',
      border: '2px solid #e5e7eb',
      background: 'white',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1.2rem',
      fontWeight: '600'
    },
    quantityInput: {
      width: '60px',
      height: '40px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      textAlign: 'center',
      fontSize: '1rem',
      fontWeight: '600'
    },
    buttonGroup: {
      display: 'flex',
      gap: '15px',
      marginBottom: '30px'
    },
    addToCartButton: {
      flex: 1,
      background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '15px 25px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      boxShadow: '0 8px 25px rgba(236, 72, 153, 0.3)'
    },
    wishlistButton: {
      width: '50px',
      height: '50px',
      border: '2px solid #e5e7eb',
      background: 'white',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    wishlistButtonActive: {
      border: '2px solid #ec4899',
      background: '#ec4899',
      color: 'white'
    },
    shareButton: {
      width: '50px',
      height: '50px',
      border: '2px solid #e5e7eb',
      background: 'white',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    features: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '20px'
    },
    feature: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '15px',
      background: '#f8fafc',
      borderRadius: '12px'
    },
    featureIcon: {
      color: '#ec4899'
    },
    featureText: {
      fontSize: '0.9rem',
      color: '#4b5563',
      fontWeight: '500'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      color: '#6b7280'
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '4px solid #fce7f3',
      borderTop: '4px solid #ec4899',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px'
    },
    errorContainer: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#dc2626'
    },
    responsiveGrid: {
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr'
      }
    }
  };

  // Add CSS animations
  const cssAnimations = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @media (max-width: 768px) {
      .product-grid {
        grid-template-columns: 1fr !important;
      }
      .features-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `;

  useEffect(() => {
    if (!document.querySelector('#product-animations')) {
      const style = document.createElement('style');
      style.id = 'product-animations';
      style.textContent = cssAnimations;
      document.head.appendChild(style);
    }
  }, []);

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2>Product Not Found</h2>
          <p>{error || "The product you're looking for doesn't exist."}</p>
          <Link 
            to="/" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '20px',
              padding: '10px 20px',
              background: '#ec4899',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px'
            }}
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <Link 
            to="/" 
            style={styles.backButton}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
            }}
          >
            <ArrowLeft size={20} />
            Back to Shop
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.productContainer}>
          <div style={{...styles.productGrid}} className="product-grid">
            {/* Image Section */}
            <div style={styles.imageSection}>
              <img 
                src={product.imageUrl || '/placeholder-image.jpg'} 
                alt={product.name}
                style={styles.mainImage}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRkNFN0YzIi8+CjxwYXRoIGQ9Ik0yMDAgMTQwQzE3Mi4zOCAxNDAgMTUwIDE2Mi4zOCAxNTAgMTkwVjIxMEMxNTAgMjM3LjYyIDE3Mi4zOCAyNjAgMjAwIDI2MEMyMjcuNjIgMjYwIDI1MCAyMzcuNjIgMjUwIDIxMFYxOTBDMjUwIDE2Mi4zOCAyMjcuNjIgMTQwIDIwMCAxNDBaIiBmaWxsPSIjRUM0ODk5Ii8+CjxjaXJjbGUgY3g9IjE4MCIgY3k9IjE3NSIgcj0iOCIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iMjIwIiBjeT0iMTc1IiByPSI4IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTgwIDIxNUMxODAgMjE1LjMgMTgwLjI4NiAyMTUgMTg1IDIxNUgyMTVDMjE5LjcxNCAyMTUgMjIwIDIxNS4zIDIyMCAyMTUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=';
                }}
              />
            </div>

            {/* Product Info Section */}
            <div style={styles.infoSection}>
              <div style={styles.category}>{product.category}</div>
              <h1 style={styles.title}>{product.name}</h1>
              
             

              <div style={styles.price}>${product.price}</div>

              <p style={styles.description}>
                {product.description || "High-quality cosplay costume perfect for conventions, parties, and photo shoots. Made with premium materials for comfort and durability."}
              </p>

              {/* Stock Information */}
              <div style={styles.stockSection}>
                <div style={styles.stockDot}></div>
                <span style={styles.stockText}>
                  {getTotalStock(product.sizes) > 0 
                    ? `${getTotalStock(product.sizes)} items in stock` 
                    : 'Out of stock'
                  }
                </span>
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div style={styles.quantitySection}>
                  <label style={styles.quantityLabel}>Select Size</label>
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap'
                  }}>
                    {product.sizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          padding: '10px 16px',
                          border: selectedSize?.id === size.id ? '2px solid #ec4899' : '2px solid #e5e7eb',
                          background: selectedSize?.id === size.id ? '#fce7f3' : 'white',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          color: selectedSize?.id === size.id ? '#ec4899' : '#374151',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = '#ec4899';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          if (selectedSize?.id !== size.id) {
                            e.target.style.borderColor = '#e5e7eb';
                          }
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        {size.sizeValue} ({size.stock} in stock)
                      </button>
                    ))}
                  </div>
                  {selectedSize && (
                    <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#6b7280' }}>
                      {selectedSize.color && `Color: ${selectedSize.color} | `}
                      Available: {selectedSize.stock} units
                    </p>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              <div style={styles.quantitySection}>
                <label style={styles.quantityLabel}>Quantity</label>
                <div style={styles.quantityControl}>
                  <button 
                    style={styles.quantityButton}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={getTotalStock(product.sizes) === 0}
                    onMouseEnter={(e) => {
                      if (getTotalStock(product.sizes) > 0) {
                        e.target.style.borderColor = '#ec4899';
                        e.target.style.color = '#ec4899';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.color = '#374151';
                    }}
                  >
                    -
                  </button>
                  <input 
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={selectedSize ? selectedSize.stock : getTotalStock(product.sizes)}
                    style={styles.quantityInput}
                  />
                  <button 
                    style={styles.quantityButton}
                    onClick={() => {
                      const maxStock = selectedSize ? selectedSize.stock : getTotalStock(product.sizes);
                      setQuantity(Math.min(maxStock, quantity + 1));
                    }}
                    disabled={getTotalStock(product.sizes) === 0}
                    onMouseEnter={(e) => {
                      if (getTotalStock(product.sizes) > 0) {
                        e.target.style.borderColor = '#ec4899';
                        e.target.style.color = '#ec4899';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.color = '#374151';
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={styles.buttonGroup}>
                <button 
                  style={styles.addToCartButton}
                  disabled={getTotalStock(product.sizes) === 0}
                  onMouseEnter={(e) => {
                    if (getTotalStock(product.sizes) > 0) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 12px 35px rgba(236, 72, 153, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.3)';
                  }}
                  onClick={() => {
                    if (getTotalStock(product.sizes) === 0) {
                      window.dispatchEvent(new CustomEvent('out-of-stock', { detail: { product, quantity } }));
                      return;
                    }
                    // Add to cart with selected size
                    const cartItem = {
                      ...product,
                      image: product.imageUrl,
                      selectedSize: selectedSize
                    };
                    addToCart(cartItem, quantity);
                    window.dispatchEvent(new CustomEvent('added-to-cart', { detail: { product, quantity, size: selectedSize } }));
                  }}
                >
                  <ShoppingCart size={20} />
                  {getTotalStock(product.sizes) === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>

                <button 
                  style={{
                    ...styles.wishlistButton,
                    ...(isLiked ? styles.wishlistButtonActive : {})
                  }}
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const token = localStorage.getItem('jwt');
                    if (!token) {
                      window.location.href = '/login';
                      return;
                    }
                    setLoadingWishlist(true);
                    try {
                      if (isLiked) {
                        // Remove from wishlist
                        await authenticatedApi.delete(`/wishlist/remove/${id}`);
                      } else {
                        // Add to wishlist
                        await authenticatedApi.post(`/wishlist/add/${id}`);
                      }
                      setIsLiked(!isLiked);
                    } catch (err) {
                      console.error('Error updating wishlist:', err);
                    } finally {
                      setLoadingWishlist(false);
                    }
                  }}
                  disabled={loadingWishlist}
                  onMouseEnter={(e) => {
                    if (!isLiked) {
                      e.target.style.borderColor = '#ec4899';
                      e.target.style.color = '#ec4899';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLiked) {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.color = '#374151';
                    }
                  }}
                >
                  <Heart 
                    size={20} 
                    style={{
                      fill: isLiked ? 'currentColor' : 'none'
                    }} 
                  />
                </button>

                <button 
                  style={styles.shareButton}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        text: `Check out this amazing cosplay: ${product.name}`,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#ec4899';
                    e.target.style.color = '#ec4899';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.color = '#374151';
                  }}
                >
                  <Share2 size={20} />
                </button>
              </div>

              {/* Features */}
              <div style={{...styles.features}} className="features-grid">
                <div style={styles.feature}>
                  <Truck size={20} style={styles.featureIcon} />
                  <span style={styles.featureText}>Free Shipping</span>
                </div>
                <div style={styles.feature}>
                  <Shield size={20} style={styles.featureIcon} />
                  <span style={styles.featureText}>Quality Guarantee</span>
                </div>
                <div style={styles.feature}>
                  <RotateCcw size={20} style={styles.featureIcon} />
                  <span style={styles.featureText}>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
