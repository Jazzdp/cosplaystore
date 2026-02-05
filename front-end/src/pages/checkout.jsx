import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import authenticatedApi from '../Util/AxiosConfig';
import api from '../Util/AxiosConfig';
function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!name || !address || !phone) {
      setError('Please fill in all fields');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('jwt');
      const userDataRaw = localStorage.getItem('user');
      let userId = null;

      // Get user ID if logged in
      if (userDataRaw) {
        try {
          const userData = JSON.parse(userDataRaw);
          userId = userData.id;
        } catch (err) {
          console.error('Failed to parse user data:', err);
        }
      }

      // Create one order per cart item
      for (const item of cartItems) {
        const payload = {
          user: userId ? { id: userId } : null,
          product: { id: item.id },
          size: item.selectedSize ? { id: item.selectedSize.id } : null,
          quantity: item.quantity,
          fullName: name,
          address: address,
          phone: parseInt(phone) || 0,
          status: 'Pending'
        };

        console.log('Sending order payload:', payload);

        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await authenticatedApi.post('/api/orders', {
          body: JSON.stringify(payload),
          headers
        });

        if (!res.ok) {
          const txt = await res.text();
          console.error('Order creation failed:', txt);
          throw new Error(`Failed to create order: ${res.status}`);
        }
      }

      clearCart();
      setSubmitted(true);
      setTimeout(() => navigate('/'), 2200);
    } catch (err) {
      console.error('Order creation error', err);
      setError('Failed to place order: ' + err.message);
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
            <input style={styles.input} placeholder="Phone number" value={phone} onChange={e=>setPhone(e.target.value)} required />
            <input style={styles.input} placeholder="Shipping address" value={address} onChange={e=>setAddress(e.target.value)} required />
            <button type="submit" disabled={submitting} style={{padding:12,background:'linear-gradient(135deg,#ec4899,#be185d)',color:'white',border:'none',borderRadius:10,fontWeight:700,width:'100%'}}>
              {submitting ? 'Placing...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div style={styles.summaryCard}>
          <h4 style={{marginBottom:12}}>Order summary</h4>
          {cartItems.length === 0 ? (
            <p style={{color:'#6b7280'}}>Your cart is empty.</p>
          ) : (
            <div>
              {cartItems.map(item => (
                <div key={item.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #f3f4f6'}}>
                  <div>
                    <div style={{fontWeight:700,color:'#111827'}}>{item.name}</div>
                    <div style={{fontSize:12,color:'#6b7280'}}>x {item.quantity}</div>
                  </div>
                  <div style={{fontWeight:700}}>{(item.price * item.quantity).toFixed(2)} DZD</div>
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