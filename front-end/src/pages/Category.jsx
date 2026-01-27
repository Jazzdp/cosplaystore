import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Search, Heart, ShoppingCart } from "lucide-react";
import '../styles/category.css';
import ItemCard from "../components/itemcard";

const Category = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) return;
    
    setIsLoading(true);
    setError(null);
    
    // Fetch all products and filter by category name
    fetch(`http://localhost:8080/products`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // Filter products by category name
        const filtered = Array.isArray(data) ? data.filter(p => 
          p.categoryName && p.categoryName.toLowerCase() === category.toLowerCase()
        ) : [];
        setProducts(filtered);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [category]);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)',
      fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    },
    heroSection: {
      background: 'linear-gradient(135deg, #ec4899 0%, #be185d 50%, #9d174d 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '60px 20px 40px 20px',
      color: 'white'
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.1)',
      zIndex: 1
    },
    heroContent: {
      position: 'relative',
      zIndex: 2,
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
      marginBottom: '20px',
      padding: '8px 16px',
      borderRadius: '8px',
      background: 'rgba(255,255,255,0.1)',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
    },
    categoryTitle: {
      fontSize: '3rem',
      fontWeight: '700',
      marginBottom: '10px',
      textTransform: 'capitalize'
    },
    categorySubtitle: {
      fontSize: '1.2rem',
      opacity: 0.9,
      marginBottom: 0
    },
    floatingElement1: {
      position: 'absolute',
      top: '20px',
      right: '10px',
      width: '50px',
      height: '50px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '50%',
      animation: 'bounce 3s infinite'
    },
    floatingElement2: {
      position: 'absolute',
      bottom: '20px',
      left: '16px',
      width: '30px',
      height: '30px',
      background: 'rgba(255,192,203,0.3)',
      borderRadius: '50%',
      animation: 'pulse 2s infinite'
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px'
    },
    statsSection: {
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '40px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px'
    },
    statsItem: {
      textAlign: 'center',
      flex: 1,
      minWidth: '120px'
    },
    statsNumber: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#be185d',
      display: 'block'
    },
    statsLabel: {
      fontSize: '0.9rem',
      color: '#6b7280',
      marginTop: '5px'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '30px',
      marginTop: '20px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 20px',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    },
    emptyIcon: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px auto'
    },
    emptyTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '10px'
    },
    emptyDescription: {
      color: '#6b7280',
      marginBottom: '30px'
    },
    emptyButton: {
      background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '10px',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 5px 15px rgba(236, 72, 153, 0.3)'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
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
    loadingText: {
      color: '#6b7280',
      fontSize: '1.1rem'
    },
    errorContainer: {
      textAlign: 'center',
      padding: '80px 20px',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      border: '2px solid #fecaca'
    },
    errorTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#dc2626',
      marginBottom: '10px'
    },
    errorDescription: {
      color: '#6b7280',
      marginBottom: '20px'
    }
  };

  // Add CSS animations
  const cssAnimations = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.05); }
    }
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `;

  useEffect(() => {
    // Add animations to head
    if (!document.querySelector('#category-animations')) {
      const style = document.createElement('style');
      style.id = 'category-animations';
      style.textContent = cssAnimations;
      document.head.appendChild(style);
    }
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading {category} products...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div style={styles.errorContainer}>
          <h3 style={styles.errorTitle}>Oops! Something went wrong</h3>
          <p style={styles.errorDescription}>{error}</p>
          <Link 
            to="/" 
            style={styles.emptyButton}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 5px 15px rgba(236, 72, 153, 0.3)';
            }}
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <Search size={40} style={{color: '#ec4899'}} />
          </div>
          <h3 style={styles.emptyTitle}>No products found</h3>
          <p style={styles.emptyDescription}>
            We couldn't find any products in the "{category}" category. 
            Check back later or explore other categories!
          </p>
          <Link 
            to="/" 
            style={styles.emptyButton}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 5px 15px rgba(236, 72, 153, 0.3)';
            }}
          >
            <ArrowLeft size={20} />
            Explore Categories
          </Link>
        </div>
      );
    }

    return (
      <>
        {/* Stats Section */}
        <div style={styles.statsSection}>
          <div style={styles.statsItem}>
            <span style={styles.statsNumber}>{products.length}</span>
            <div style={styles.statsLabel}>Products Found</div>
          </div>
          <div style={styles.statsItem}>
            <span style={styles.statsNumber}>{category}</span>
            <div style={styles.statsLabel}>Category</div>
          </div>
          <div style={styles.statsItem}>
            <span style={styles.statsNumber}>
              ${Math.min(...products.map(p => p.price)).toFixed(2)}
            </span>
            <div style={styles.statsLabel}>Starting From</div>
          </div>
        </div>

        {/* Products Grid */}
        <div style={styles.productsGrid}>
          {products.map((prod, index) => (
            <div 
              key={prod.id}
              style={{
                animation: `fadeInUp 0.6s ease ${index * 0.1}s both`
              }}
            >
              <ItemCard product={prod} />
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.floatingElement1}></div>
        <div style={styles.floatingElement2}></div>
        
        <div style={styles.heroContent}>
          <Link 
            to="/" 
            style={styles.backButton}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.transform = 'translateX(-5px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.transform = 'translateX(0)';
            }}
          >
            <ArrowLeft size={20} />
            Back to Categories
          </Link>
          
          <h1 style={styles.categoryTitle}>
            {decodeURIComponent(category || '')}
          </h1>
          <p style={styles.categorySubtitle}>
            Discover amazing {category} costumes and accessories
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Category;