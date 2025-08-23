import React from 'react';
import { Link , useLocation} from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/navbar.css';

const Navbar = ({ onSearch }) => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const location = useLocation();
  const hideOnPaths = [ '/', '/checkout','/cart'];
  const shouldShowSearch = !hideOnPaths.includes(location.pathname);
  
  
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">Cosplay Store</Link>
      </div>

      <div className="navbar-center">
      {shouldShowSearch && (
        <input
        type="text"
          placeholder="Search products..."
          onChange={(e) => onSearch(e.target.value)}
        />
      )}
      </div>

      <div className="navbar-right">
        {/* Add link to All Products */}
        <Link to="/AllProducts" className="all-products-link">All Products</Link>

        {/* Cart link */}
        <Link to="/cart" className="cart-link">
          🛒 Cart ({totalItems})
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;