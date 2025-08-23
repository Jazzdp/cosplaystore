import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import product from '../data/data.js'; 
import '../styles/productdetail.css';
import { useCart } from '../context/CartContext';
import { Toast } from 'react-bootstrap';


const ProductDetail = ({ showToast }) => {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  



  useEffect(() => {
    if (product) {
      const productId = parseInt(id);
      const foundProduct = product.find(p => p.id === productId);
      
      if (foundProduct) {
          const viewsData = JSON.parse(localStorage.getItem('productViews')) || {};
        
          // Increment the view count
          const currentViews = viewsData[productId] || foundProduct.views || 0;
          const newViews = currentViews + 1;
          
          // Update localStorage
          viewsData[productId] = newViews;
          localStorage.setItem('productViews', JSON.stringify(viewsData));
          
          // Create a copy with updated views
          const productWithIncrementedViews = {
            ...foundProduct,
            views: newViews
        };
        
        setProductData(productWithIncrementedViews);
      
     
        

      }
    }
    
    setLoading(false);
  }, [id, product]); 

  // Render loading
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // case when product is not found
  if (!productData) {
    return (
      <div className="not-found">
        <p>Product not found</p>
        <Link to="/" className="back-link">Back to Home</Link>
      </div>
    );
  }

  // Calculate average rating
  const averageRating = productData.reviews 
    ? productData.reviews.reduce((sum, review) => sum + review.rating, 0) / productData.reviews.length 
    : 0;

  

  return (
    <div className="product-detail-container">
      <div className="product-detail-grid">
        <div className="product-image-container">
          <img src={productData.image} alt={productData.name} className="product-detail-image" />
        </div>
        
        <div className="product-info">
          <h1 className="product-name">{productData.name}</h1>
          
          <div className="product-meta">
            <span className="views-count">Views:{JSON.parse(localStorage.getItem('productViews'))?.[productData.id] || productData.views}</span>
            <span className="sold-count">Sold: {productData.sold || 0}</span>
          </div>
          
          <div className="product-rating">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={`star ${star <= Math.round(averageRating) ? 'filled' : 'empty'}`}
                >
                  ⭐
                </span>
              ))}
            </div>
            <span className="rating-number">
              {averageRating.toFixed(1)} ({productData.reviews ? productData.reviews.length : 0} reviews)
            </span>
          </div>
          
          <div className="product-price">
            <span className="price-icon"></span>
            <span className="price-amount">{productData.price.toLocaleString()}</span>
            ₫
          </div>
          
          <button className="add-to-cart-btn" onClick={() => { addToCart(productData);showToast && showToast(); }}>
            Add to Cart
          </button>
        </div>
      </div>
      
      <div className="reviews-section">
        <h2 className="reviews-title">Customer Reviews</h2>
        
        {productData.reviews && productData.reviews.length > 0 ? (
          <div className="reviews-list">
            {productData.reviews.map((review, index) => (
              <div className="review-item" key={index}>
                <div className="review-header">
                  <span className="reviewer-name">{review.user}</span>
                  <div className="review-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className={`star ${star <= review.rating ? 'filled' : 'empty'}`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                <p className="review-text">{review.comment}</p>
                <div className="review-date">{review.date}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-reviews">No reviews yet</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;