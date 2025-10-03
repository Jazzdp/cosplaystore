import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast, ToastContainer } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/cart';
import Header from './components/Header';
import { CartProvider } from './context/CartContext';
import Checkout from './pages/checkout';
import AllProducts from './pages/AllProducts';
import Category from './pages/Category';
import Login from "./components/Login";
import Register from './pages/Register';
import './App.css'
import './index.css';
import SearchBar from './components/SearchBar';
import Footer from "./components/footer";

function App() {
  
  
  const [showToast, setShowToast] = useState(false);

  const handleAddToCartToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home  showToast={handleAddToCartToast} />} />
          <Route path="/products/:id" element={<ProductDetail showToast={handleAddToCartToast} />} />
          <Route path="/AllProducts" element={<AllProducts showToast={handleAddToCartToast} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/products" element={<AllProducts showToast={handleAddToCartToast}  />} />
          
          <Route path="/category/:category" element={<Category  showToast={handleAddToCartToast}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
      <Footer />
    </CartProvider>
    
    
  );
}
export default App;
