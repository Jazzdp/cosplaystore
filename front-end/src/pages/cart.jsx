import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import '../styles/cart.css';
import api from '../Util/AxiosConfig';
// API service to fetch product details
const productAPI = {
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }
};

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const initialLoadRef = useRef(false);

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
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
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
      backdropFilter: 'blur(10px)',
      border: 'none',
      cursor: 'pointer'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      margin: 0
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px'
    },
    cartContainer: {
      background: 'white',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
      padding: '40px'
    },
    cartGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '40px'
    },
    cartItems: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    cartItem: {
      display: 'flex',
      gap: '20px',
      padding: '20px',
      background: '#fef7ff',
      borderRadius: '16px',
      border: '1px solid #fce7f3',
      transition: 'all 0.3s ease'
    },
    cartItemImage: {
      width: '120px',
      height: '120px',
      objectFit: 'cover',
      borderRadius: '12px',
      flexShrink: 0
    },
    cartItemInfo: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    cartItemName: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#1f2937',
      margin: 0
    },
    cartItemCategory: {
      fontSize: '0.9rem',
      color: '#ec4899',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    cartItemPrice: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#ec4899',
      margin: 0
    },
    cartItemActions: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 'auto'
    },
    quantityControl: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'white',
      borderRadius: '8px',
      padding: '5px',
      border: '1px solid #e5e7eb'
    },
    quantityButton: {
      width: '30px',
      height: '30px',
      border: 'none',
      background: '#ec4899',
      color: 'white',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    quantityValue: {
      minWidth: '30px',
      textAlign: 'center',
      fontWeight: '600',
      color: '#374151'
    },
    removeButton: {
      background: 'none',
      border: 'none',
      color: '#ef4444',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '6px',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    summary: {
      background: '#fef7ff',
      borderRadius: '16px',
      padding: '30px',
      border: '1px solid #fce7f3',
      height: 'fit-content',
      position: 'sticky',
      top: '20px'
    },
    summaryTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '20px',
      margin: 0
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '15px',
      fontSize: '1rem',
      color: '#4b5563'
    },
    summaryTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: '1px solid #e5e7eb',
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#1f2937'
    },
    checkoutButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '15px 25px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '20px',
      boxShadow: '0 8px 25px rgba(236, 72, 153, 0.3)'
    },
    continueButton: {
      width: '100%',
      background: 'white',
      color: '#ec4899',
      border: '2px solid #ec4899',
      borderRadius: '12px',
      padding: '15px 25px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '10px'
    },
    emptyContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center'
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '20px'
    },
    emptyTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '10px',
      margin: 0
    },
    emptyText: {
      fontSize: '1.1rem',
      color: '#6b7280',
      marginBottom: '30px',
      margin: 0
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
    }
  };

  const formatMoney = (value) => {
    if (isNaN(value) || value === null) return '0.00';
    // Use Intl.NumberFormat for better localization; default to 2 decimals
    try {
      return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    } catch (e) {
      return Number(value).toFixed(2);
    }
  };

  // Add CSS animations
  useEffect(() => {
    if (!document.querySelector('#cart-animations')) {
      const style = document.createElement('style');
      style.id = 'cart-animations';
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Fetch product details for cart items. Only show the full-page loading
  // spinner during the initial load. Subsequent changes (quantity updates)
  // will not trigger the global loader; we only fetch missing product data
  // and merge it into `productDetails` so the UI updates smoothly.
  useEffect(() => {
    let cancelled = false;
    let loadTimer = null;
    let loadingShown = false;

    const fetchAll = async () => {
      if (cartItems.length === 0) {
        if (!cancelled) {
          setProductDetails({});
          setLoading(false);
        }
        return;
      }

      // Determine which ids are missing from cache
      const missingIds = cartItems
        .map(i => i.id)
        .filter(id => !productDetails || !productDetails[id]);

      // Decide whether this is the initial load where we should show the
      // full-page loader. We only want the loader on the very first fetch
      // (when `initialLoadRef.current` is false). Subsequent quantity
      // updates should not show the global loader.
      const isInitialLoad = !initialLoadRef.current && (!productDetails || Object.keys(productDetails).length === 0);
      const needFullFetch = missingIds.length > 0;

      if (isInitialLoad && needFullFetch) {
        // Delay showing the full-page loader so very fast ops don't flicker UI
        loadTimer = setTimeout(() => {
          loadingShown = true;
          setLoading(true);
        }, 150);
      }

      try {
        if (missingIds.length === 0) {
          // Nothing to fetch; ensure loading is off
          if (!cancelled) setLoading(false);
          return;
        }

        // Fetch only missing products
        const productPromises = missingIds.map(async (id) => {
          const product = await productAPI.getProductById(id);
          return { id, product };
        });

        const results = await Promise.all(productPromises);

        if (cancelled) return;

        // Merge results into existing productDetails
        setProductDetails(prev => {
          const merged = { ...(prev || {}) };
          results.forEach(({ id, product }) => {
            if (product) merged[id] = product;
          });
          return merged;
        });

        // Mark that initial load has completed so we won't show the full
        // page loader for subsequent updates.
        initialLoadRef.current = true;
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load product details');
          console.error('Error fetching products:', err);
        }
      } finally {
        if (loadTimer) clearTimeout(loadTimer);
        // If loader was shown, hide it. If not shown, nothing was displayed so no flicker.
        if (!cancelled && loadingShown) setLoading(false);
        if (!cancelled && !loadingShown) setLoading(false); // ensure consistent state
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, [cartItems, refreshKey]);

  const handleQuantityChange = (cartItemId, change) => {
    const currentItem = cartItems.find(item => item.cartItemId === cartItemId);
    if (!currentItem) return;

    const newQuantity = currentItem.quantity + change;
    
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      updateQuantity(cartItemId, newQuantity);
    }
  };

  const calculateItemTotal = (item) => {
    const product = productDetails[item.id];
    return product ? product.price * item.quantity : 0;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={{fontSize: '3rem', marginBottom: '20px'}}>⚠️</div>
          <h2 style={{fontSize: '1.5rem', fontWeight: '600', color: '#ef4444', marginBottom: '10px', margin: 0}}>Something went wrong</h2>
          <p style={{marginBottom: '20px', margin: 0}}>{error}</p>
          <button 
            type="button"
            onClick={() => setRefreshKey(k => k + 1)}
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>🛒</div>
           <h1 style={styles.emptyTitle}>Your cart is empty</h1> 
           <p style={styles.emptyText}>
            Looks like you haven't added any items to your cart yet. Let's go shopping!
          </p> 
          <button 
            type="button"
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '15px 30px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(236, 72, 153, 0.3)'
            }}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <button 
            type="button"
            onClick={() => window.history.back()}
            style={styles.backButton}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
            }}
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 style={styles.title}>Shopping Cart</h1>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.cartContainer}>
          <style>{`
            @media (max-width: 768px) {
              .cart-grid {
                grid-template-columns: 1fr !important;
                gap: 20px !important;
              }
            }
          `}</style>
          <div style={{...styles.cartGrid, gridTemplateColumns: 'auto 1fr'}} className="cart-grid">
            {/* Cart Items */}
            <div style={{...styles.cartItems, gridColumn: '1 / -1'}}>
              {cartItems.length === 0 ? (
                <div style={{textAlign: 'center', color: '#6b7280', padding: '40px 20px'}}>
                  No products in cart
                </div>
              ) : (
                cartItems.map((item) => {
                  const product = productDetails[item.id];
                  
                  if (!product) {
                    return (
                      <div key={item.id} style={styles.cartItem}>
                        <div style={{textAlign: 'center', width: '100%', color: '#6b7280'}}>
                          Product not found
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={item.id} style={styles.cartItem}>
                      <img 
                        src={product.imageUrl || '/placeholder-image.jpg'} 
                        alt={product.name}
                        style={styles.cartItemImage}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRkNFN0YzIi8+CjxwYXRoIGQ9Ik02MCA0MEM0NC41MzYgNDAgMzIgNTIuNTM2IDMyIDY4VjkyQzMyIDEwNy40NjQgNDQuNTM2IDEyMCA2MCAxMjBDNzUuNDY0IDEyMCA4OCAxMDcuNDY0IDg4IDkyVjY4Qzg4IDUyLjUzNiA3NS40NjQgNDAgNjAgNDBaIiBmaWxsPSIjRUM0ODk5Ii8+CjxjaXJjbGUgY3g9IjU0IiBjeT0iNjUiIHI9IjMiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjY2IiBjeT0iNjUiIHI9IjMiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik01NCA4NUM1NCA4NS4yIDU0LjE5MSA4NSA1OCA4NUg2MkM2NS44MDkgODUgNjYgODUuMiA2NiA4NSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+Cg==';
                        }}
                      />
                      
                      <div style={styles.cartItemInfo}>
                        <h3 style={styles.cartItemName}>{product.name}</h3>
                        <div style={styles.cartItemCategory}>{product.category}</div>
                        {item.selectedSize && (
                          <div style={{ 
                            fontSize: '0.85rem', 
                            color: '#ec4899', 
                            fontWeight: '600',
                            marginBottom: '8px'
                          }}>
                            Size: <strong>{item.selectedSize.sizeValue}</strong>
                            {item.selectedSize.color && ` - ${item.selectedSize.color}`}
                          </div>
                        )}
                        <div style={styles.cartItemPrice}>${formatMoney(product.price)}</div>
                        
                          <div style={styles.cartItemActions}>
                          <div style={styles.quantityControl}>
                            <button 
                              type="button"
                              style={styles.quantityButton}
                              onClick={() => handleQuantityChange(item.cartItemId, -1)}
                              onMouseEnter={(e) => {
                                e.target.style.background = '#be185d';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = '#ec4899';
                              }}
                            >
                              <Minus size={16} />
                            </button>
                            <span style={styles.quantityValue}>{item.quantity}</span>
                            <button 
                              type="button"
                              style={styles.quantityButton}
                              onClick={() => handleQuantityChange(item.cartItemId, 1)}
                              onMouseEnter={(e) => {
                                e.target.style.background = '#be185d';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = '#ec4899';
                              }}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <div style={{marginTop: '8px', color: '#6b7280', fontWeight: '600'}}>
                            Item total: ${formatMoney(calculateItemTotal(item))}
                          </div>
                          
                          <button 
                            type="button"
                            style={styles.removeButton}
                            onClick={() => removeFromCart(item.cartItemId)}
                            onMouseEnter={(e) => {
                              e.target.style.background = '#fef2f2';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'none';
                            }}
                            title="Remove from cart"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Cart Summary */}
            <div style={{...styles.summary, gridColumn: '1 / -1'}}>
              <h2 style={styles.summaryTitle}>Order Summary</h2>
              
              <div style={styles.summaryRow}>
                <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
                <span>${formatMoney(getCartTotal())}</span>
              </div>
              
              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span style={{color: '#10b981', fontWeight: '600'}}>Free</span>
              </div>
              
              <div style={styles.summaryTotal}>
                <span>Total</span>
                <span>${formatMoney(getCartTotal())}</span>
              </div>
              
              <button 
                type="button"
                style={styles.checkoutButton}
                onClick={() => navigate('/checkout')}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(236, 72, 153, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.3)';
                }}
              >
                <ShoppingCart size={20} style={{marginRight: '8px'}} />
                Proceed to Checkout
              </button>
              
              <button 
                type="button"
                style={styles.continueButton}
                onClick={() => navigate('/')}
                onMouseEnter={(e) => {
                  e.target.style.background = '#fce7f3';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;