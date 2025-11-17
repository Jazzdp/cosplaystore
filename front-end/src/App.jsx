import React, { useState, useEffect } from 'react';
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
import AdminDashboard from './pages/AdminDashboard';
import OrdersPage from './pages/Orders';


function App() {
  
  
  const [toast, setToast] = useState({ show: false, message: '', bg: 'success' });

  const showToast = (message = '✔️ Added to cart', bg = 'success') => {
    setToast({ show: true, message, bg });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2000);
  };

  // Listen for custom add/out-of-stock events
  useEffect(() => {
    const addedHandler = () => showToast('✔️ Added to cart', 'success');
    const oosHandler = () => showToast('Out of stock', 'danger');
    window.addEventListener('added-to-cart', addedHandler);
    window.addEventListener('out-of-stock', oosHandler);
    return () => {
      window.removeEventListener('added-to-cart', addedHandler);
      window.removeEventListener('out-of-stock', oosHandler);
    };
  }, []);

  return (
    
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home  showToast={showToast} />} />
          <Route path="/products/:id" element={<ProductDetail showToast={showToast} />} />
          <Route path="/AllProducts" element={<AllProducts showToast={showToast} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/products" element={<AllProducts showToast={showToast}  />} />
          
          <Route path="/category/:category" element={<Category  showToast={showToast}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/orders" element={<OrdersPage />} />
         </Routes>

         <ToastContainer
           className="position-fixed top-0 start-50 translate-middle-x mt-3"
             style={{ zIndex: 9999 }}
         >
         <Toast
            show={toast.show}
            onClose={() => setToast((t) => ({ ...t, show: false }))}
             bg={toast.bg}
             delay={3000}
              autohide
          >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
         </ToastContainer> 
      </Router>
      <Footer />
    </CartProvider>
    
    
  );
}
export default App;
