import React from 'react';
import { useParams } from 'react-router-dom';
import product from '../data/data'; 
import ItemCard from '../components/itemcard';
import '../styles/category.css';

const Category = ({ showToast , searchTerm }) => {
  const { name } = useParams();
  

  let categoryProducts = [];

  if (name === 'best-sellers') {
    categoryProducts = product.filter(p => p.id === 5);
  } else if (name === 'full-sets') {
    categoryProducts = product;
  } else if (name === 'accessories') {
    categoryProducts = []; // none yet
  }

  
  const filteredProducts = categoryProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="container mt-5">
      <h2 className="category-title text-capitalize">{name.replace('-', ' ')}</h2>
      {filteredProducts.length === 0 ? (
        <div className="empty-category">
          <div className="empty-category-icon">
            <i className="fas fa-box-open"></i>
          </div>
          <h3 className="empty-category-message">No products found</h3>
          <p className="empty-category-description">
            Try a different search or check back later for new items!
          </p>
        </div>
      ) : (
        <div className="category-grid">
          {filteredProducts.map(product => (
            <div key={product.id}>
              <ItemCard product={product} showToast={showToast} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
