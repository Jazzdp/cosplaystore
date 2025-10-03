import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name || !address) return;

    // Require logged-in user to associate orders
    const userDataRaw = localStorage.getItem('user');
    if (!userDataRaw) {
      setError('You must be logged in to place an order.');
      setTimeout(() => navigate('/login'), 1200);
      return;
    }

    let userData = null;
    try { userData = JSON.parse(userDataRaw); } catch (err) { /* ignore */ }

    // If local user object doesn't include id, but we have a JWT, try to recover via /api/auth/me
    if ((!userData || !userData.id)) {
      const token = localStorage.getItem('jwt');
      if (token) {
        try {
          const meRes = await fetch('http://localhost:8080/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (meRes.ok) {
            const me = await meRes.json();
            userData = { id: me.id, username: me.username };
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            setError('Invalid user session. Please login again.');
            setTimeout(() => navigate('/login'), 1200);
            return;
          }
        } catch (err) {
          console.error('Failed to recover session from token', err);
          setError('Invalid user session. Please login again.');
          setTimeout(() => navigate('/login'), 1200);
          return;
        }
      } else {
        setError('Invalid user session. Please login again.');
        setTimeout(() => navigate('/login'), 1200);
        return;
      }
    }

    if (!cartItems || cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    try {
      // Create one order per cart item (existing backend Order model links one product per order)
      const responses = [];
      const token = localStorage.getItem('jwt');
      for (const item of cartItems) {
        const payload = {
          user: { id: userData.id },
          product: { id: item.id },
          quantity: item.quantity,
          status: 'PLACED'
        };

        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('http://localhost:8080/orders', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Failed to create order: ${res.status} ${txt}`);
        }

        responses.push(await res.json());
      }

      // All orders created successfully
      clearCart();
      setSubmitted(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      console.error('Order creation error', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
      {error && <div className="alert alert-danger">{error}</div>}
      {submitting && <div className="mb-3">Submitting your order...</div>}

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group mb-4">
            {cartItems.map(item => (
              <li key={item.id} className="list-group-item d-flex justify-content-between">
                <span>{item.name} x {item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)} DZD</span>
              </li>
            ))}
          </ul>
          <h4>Total: {getCartTotal().toFixed(2)} DZD</h4>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label>Name:</label>
              <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label>Address:</label>
              <input className="form-control" value={address} onChange={e => setAddress(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-success" disabled={submitting}>{submitting ? 'Placing...' : 'Place Order'}</button>
          </form>
        </>
      )}
    </div>
  );
}

export default Checkout;
