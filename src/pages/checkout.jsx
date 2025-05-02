import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const { cartItems, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !address) return;
    clearCart();
    setSubmitted(true);
    setTimeout(() => navigate('/'), 3000);
  };

  if (submitted) {
    return (
      <div className="container mt-5 text-center">
        <h2>✅ Order Placed!</h2>
        <p>Thank you, {name}. Your cosplay gear is on its way!</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Checkout</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group mb-4">
            {cartItems.map(item => (
              <li key={item.id} className="list-group-item d-flex justify-content-between">
                <span>{item.name} x {item.quantity}</span>
                <span>{item.price * item.quantity} DZD</span>
              </li>
            ))}
          </ul>
          <h4>Total: {getTotal()} DZD</h4>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label>Name:</label>
              <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label>Address:</label>
              <input className="form-control" value={address} onChange={e => setAddress(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-success">Place Order</button>
          </form>
        </>
      )}
    </div>
  );
}

export default Checkout;
