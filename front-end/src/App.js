import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast, ToastContainer } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/cart';
import Navbar from './components/navbar';
import { CartProvider } from './context/CartContext';
import Checkout from './pages/checkout';
import AllProducts from './pages/AllProducts';
import Category from './pages/Category';
import Login from "./components/Login";
import './App.css'
function App() {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleAddToCartToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <CartProvider>
      <Router>
        <Navbar onSearch={setSearchTerm} />
        <Routes>
          <Route path="/" element={<Home searchTerm={searchTerm} showToast={handleAddToCartToast} />} />
          <Route path="/product/:id" element={<ProductDetail showToast={handleAddToCartToast} />} />
          <Route path="/AllProducts" element={<AllProducts searchTerm={searchTerm} showToast={handleAddToCartToast} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/products" element={<AllProducts showToast={handleAddToCartToast} searchTerm={searchTerm} />} />
          <Route path="/category/:name" element={<Category searchTerm={searchTerm} showToast={handleAddToCartToast} />} />
          <Route path="/login" element={<Login />} />

         </Routes>

         <ToastContainer
           className="position-fixed top-0 start-50 translate-middle-x mt-3"
             style={{ zIndex: 9999 }}
         >
         <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
             bg="success"
             delay={3000}
              autohide
          >
          <Toast.Body className="text-white">✔️ Added to cart</Toast.Body>
          </Toast>
         </ToastContainer>
      </Router>
    </CartProvider>
  );
}
export default App;
