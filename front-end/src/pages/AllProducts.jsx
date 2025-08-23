import React from 'react';
import { useParams } from 'react-router-dom';
import product from '../data/data';
import ItemCard from '../components/itemcard';
import '../styles/all.css';


const AllProducts = ({ searchTerm , showToast }) => {
   
        const filteredProducts = product.filter((product) => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        ); 
  

  return (
    <div className="home-container">
      <h1>Our Cosplay Products</h1>
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ItemCard key={product.id} product={product} showToast={showToast } />
            
          
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
