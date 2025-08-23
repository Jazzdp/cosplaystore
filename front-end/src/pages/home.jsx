import React from 'react';
import { Link } from 'react-router-dom';
import product from '../data/data';
import '../styles/home.css';

const Home = () => {
  
  
  const getCategoryImage = (category) => {
    if (category === 'best-sellers') {
      const bestSeller = product.find(p => p.id === 5);
      return bestSeller?.image;
    } else if (category === 'full-sets') {
      return product[0]?.image;
    } else if (category === 'accessories') {
      return ''; // Empty for now
    }
    return '';
  };

  const categories = [
    {
      name: 'Best Sellers',
      route: '/category/best-sellers',
      image: getCategoryImage('best-sellers'),
    },
    {
      name: 'Full Sets',
      route: '/category/full-sets',
      image: getCategoryImage('full-sets'),
    },
    {
      name: 'Accessories',
      route: '/category/accessories',
      image: getCategoryImage('accessories'),
    },
  ];

  return (
    <div className="home-container">
      <h2 className="page-title">Shop by Category</h2>
      <div className="categories-grid">
        {categories.map((cat, idx) => (
          <Link key={idx} to={cat.route} className="text-decoration-none">
            <div className="category-card">
              {cat.image ? (
                <div className="category-image-container">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="category-image"
                  />
                </div>
              ) : (
                <div className="category-image-container no-image">
                  <div className="no-image-icon">
                    <i className="fas fa-box-open"></i>
                  </div>
                </div>
              )}
              <div className="category-body">
                <h5 className="category-title">{cat.name}</h5>
                <div className="category-button">Explore</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;