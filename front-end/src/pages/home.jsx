import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
import '../styles/home.css';
import api from "../Util/AxiosConfig";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get("/api/categories")
      .then(res => res.data)
      .then(data => {
        console.log("Categories received:", data);
        setCategories(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching categories:", err);
        setCategories([]);
        setIsLoading(false);
      });
  }, []);

  const getCategoryGradient = (index) => {
    const gradients = [
      'linear-gradient(135deg, #ffeef8 0%, #f8d7da 100%)',
      'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 100%)',
      'linear-gradient(135deg, #fff0f3 0%, #ffe0e6 100%)',
      'linear-gradient(135deg, #f9f5ff 0%, #fff0f7 100%)',
      'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
      'linear-gradient(135deg, #fef7ff 0%, #e9d8fd 100%)',
      'linear-gradient(135deg, #fffbf0 0%, #fed7d7 100%)',
      'linear-gradient(135deg, #f0fff4 0%, #fed7e2 100%)'
    ];
    return gradients[index % gradients.length];
  };

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
      padding: '80px 20px',
      textAlign: 'center',
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
      maxWidth: '800px',
      margin: '0 auto'
    },
    heroTitle: {
      fontSize: '3.5rem',
      fontWeight: '700',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem'
    },
    heroSubtitle: {
      fontSize: '1.25rem',
      opacity: 0.9,
      marginBottom: 0
    },
    floatingElement1: {
      position: 'absolute',
      top: '20px',
      left: '10px',
      width: '60px',
      height: '60px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '50%',
      animation: 'bounce 2s infinite'
    },
    floatingElement2: {
      position: 'absolute',
      bottom: '20px',
      right: '16px',
      width: '40px',
      height: '40px',
      background: 'rgba(255,192,203,0.3)',
      borderRadius: '50%',
      animation: 'pulse 3s infinite'
    },
    floatingElement3: {
      position: 'absolute',
      top: '120px',
      right: '20px',
      width: '30px',
      height: '30px',
      background: 'rgba(255,182,193,0.4)',
      borderRadius: '50%',
      animation: 'bounce 2s infinite 1s'
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '60px 20px'
    },
    sectionHeader: {
      textAlign: 'center',
      marginBottom: '50px'
    },
    sectionTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#be185d',
      marginBottom: '1rem'
    },
    sectionDescription: {
      fontSize: '1.1rem',
      color: '#6b7280',
      maxWidth: '600px',
      margin: '0 auto'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '30px',
      marginBottom: '60px'
    },
    allProductsCard: {
      background: 'linear-gradient(135deg, #be185d 0%, #9d174d 100%)',
      borderRadius: '20px',
      padding: '40px 20px',
      textAlign: 'center',
      color: 'white',
      textDecoration: 'none',
      boxShadow: '0 10px 30px rgba(190, 24, 93, 0.3)',
      transition: 'all 0.3s ease',
      transform: 'translateY(0)',
      position: 'relative',
      overflow: 'hidden'
    },
    allProductsCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 40px rgba(190, 24, 93, 0.4)'
    },
    categoryCard: {
      background: 'white',
      borderRadius: '20px',
      overflow: 'hidden',
      textDecoration: 'none',
      color: 'inherit',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      transform: 'translateY(0)'
    },
    categoryCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
    },
    categoryImage: {
      height: '160px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    categoryLetter: {
      background: 'rgba(255,255,255,0.9)',
      borderRadius: '50%',
      width: '70px',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      fontWeight: '700',
      color: '#be185d',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease'
    },
    categoryInfo: {
      padding: '25px',
      background: 'linear-gradient(to bottom, white 0%, #fdf2f8 100%)'
    },
    categoryName: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '5px'
    },
    categoryDesc: {
      fontSize: '0.9rem',
      color: '#6b7280'
    },
    ctaSection: {
      background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      borderRadius: '20px',
      padding: '50px 30px',
      textAlign: 'center',
      color: 'white'
    },
    ctaTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      marginBottom: '1rem'
    },
    ctaDescription: {
      fontSize: '1.1rem',
      opacity: 0.9,
      marginBottom: '2rem'
    },
    ctaButton: {
      background: 'white',
      color: '#be185d',
      padding: '15px 30px',
      borderRadius: '12px',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '1rem',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
      boxShadow: '0 5px 15px rgba(255,255,255,0.3)'
    },
    loadingContainer: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)'
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '4px solid #fce7f3',
      borderTop: '4px solid #ec4899',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
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
      50% { transform: translateY(-20px); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `;

  useEffect(() => {
    // Add animations to head
    const style = document.createElement('style');
    style.textContent = cssAnimations;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.floatingElement1}></div>
        <div style={styles.floatingElement2}></div>
        <div style={styles.floatingElement3}></div>
        
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            <Sparkles size={40} style={{animation: 'pulse 2s infinite'}} />
            Cosplay Dreams
            <Sparkles size={40} style={{animation: 'pulse 2s infinite 1s'}} />
          </h1>
          <p style={styles.heroSubtitle}>
            Transform into your favorite characters with our premium cosplay collection
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Shop by Category</h2>
          <p style={styles.sectionDescription}>
            Discover our carefully curated collection of costumes, accessories, and props for every character
          </p>
        </div>
        
        <div style={styles.grid}>
          {/* All Products Card */}
          <Link 
            to="/products" 
            style={styles.allProductsCard}
            onMouseEnter={(e) => {
              Object.assign(e.target.style, styles.allProductsCardHover);
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 30px rgba(190, 24, 93, 0.3)';
            }}
          >
            <ShoppingBag size={48} style={{marginBottom: '15px'}} />
            <div style={{fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px'}}>
              All Products
            </div>
            <div style={{opacity: 0.9, fontSize: '0.95rem'}}>
              Browse Everything
            </div>
            <ArrowRight size={20} style={{marginTop: '15px'}} />
          </Link>

          {/* Dynamic Categories */}
          {categories.map((cat, idx) => (
            <Link 
              key={cat.id || idx} 
              to={`/category/${typeof cat === 'string' ? cat : cat.name}`} 
              style={styles.categoryCard}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, styles.categoryCardHover);
                const letter = e.currentTarget.querySelector('.category-letter');
                if (letter) letter.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                const letter = e.currentTarget.querySelector('.category-letter');
                if (letter) letter.style.transform = 'scale(1)';
              }}
            >
              <div 
                style={{
                  ...styles.categoryImage,
                  backgroundImage: typeof cat === 'string' ? 'none' : `url('${cat.picUrl}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: getCategoryGradient(idx),
                  backgroundBlendMode: 'overlay'
                }}
              >
                {(typeof cat !== 'string' && !cat.picUrl) || typeof cat === 'string' ? (
                  <div 
                    className="category-letter"
                    style={styles.categoryLetter}
                  >
                    {(typeof cat === 'string' ? cat : cat.name).charAt(0).toUpperCase()}
                  </div>
                ) : null}
              </div>

              <div style={styles.categoryInfo}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <h3 style={styles.categoryName}>{typeof cat === 'string' ? cat : cat.name}</h3>
                    <p style={styles.categoryDesc}>Explore collection</p>
                  </div>
                  <ArrowRight size={20} style={{color: '#9ca3af'}} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div style={styles.ctaSection}>
          <h3 style={styles.ctaTitle}>Can't find what you're looking for?</h3>
          <p style={styles.ctaDescription}>
            Browse our complete collection or contact us for custom requests
          </p>
          <Link 
            to="/products"
            style={styles.ctaButton}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(255,255,255,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 5px 15px rgba(255,255,255,0.3)';
            }}
          >
            View All Products
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
