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

    if (!cartItems || cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    try {
      // Create one order per cart item
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

        const res = await fetch('http://localhost:8080/api/orders', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Failed to create order: ${res.status} ${txt}`);
        }
      }

      clearCart();
      setSubmitted(true);
      setTimeout(() => navigate('/'), 2200);
    } catch (err) {
      console.error('Order creation error', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{minHeight:'70vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{background:'white',padding:40,borderRadius:16,boxShadow:'0 10px 30px rgba(0,0,0,0.08)',textAlign:'center'}}>
          <h2 style={{color:'#111827'}}>✅ Order Placed</h2>
          <p style={{color:'#6b7280'}}>Thanks — your order is confirmed. We'll email updates shortly.</p>
        </div>
      </div>
    );
  }

  const styles = {
    page: { minHeight: '80vh', padding: '40px 20px', background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)' },
    container: { maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 },
    formCard: { background:'white', borderRadius:16, padding:24, boxShadow:'0 10px 30px rgba(0,0,0,0.06)' },
    summaryCard: { background:'white', borderRadius:16, padding:20, boxShadow:'0 10px 30px rgba(0,0,0,0.06)' },
    input: { width:'100%', padding:10, borderRadius:8, border:'1px solid #e5e7eb', marginBottom:12 }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.formCard}>
          <h3 style={{marginBottom:12}}>Shipping details</h3>
          {error && <div style={{background:'#fee2e2',padding:10,borderRadius:8,color:'#991b1b',marginBottom:12}}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <input style={styles.input} placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
            <input style={styles.input} placeholder="Shipping address" value={address} onChange={e=>setAddress(e.target.value)} required />
            <button type="submit" disabled={submitting} style={{padding:12,background:'linear-gradient(135deg,#ec4899,#be185d)',color:'white',border:'none',borderRadius:10,fontWeight:700,width:'100%'}}>{submitting? 'Placing...' : 'Place Order'}</button>
          </form>
        </div>

        <div style={styles.summaryCard}>
          <h4 style={{marginBottom:12}}>Order summary</h4>
          {cartItems.length === 0 ? (
            <p style={{color:'#6b7280'}}>Your cart is empty.</p>
          ) : (
            <div>
              {cartItems.map(it=> (
                <div key={it.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #f3f4f6'}}>
                  <div>
                    <div style={{fontWeight:700,color:'#111827'}}>{it.name}</div>
                    <div style={{fontSize:12,color:'#6b7280'}}>x {it.quantity}</div>
                  </div>
                  <div style={{fontWeight:700}}>{(it.price*it.quantity).toFixed(2)} DZD</div>
                </div>
              ))}

              <div style={{display:'flex',justifyContent:'space-between',marginTop:12,fontWeight:700}}>
                <div>Total</div>
                <div>{getCartTotal().toFixed(2)} DZD</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
