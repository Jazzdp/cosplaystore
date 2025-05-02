import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/cart.css';

function Cart() {
  const { cartItems, changeQuantity, removeFromCart, getTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-content">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <button className="btn-shop-now" onClick={() => window.location.href = '/'}>
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Shopping Cart</h2>
      
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img src={item.image} alt={item.name} />
            </div>
            
            <div className="cart-item-details">
              <h3 className="cart-item-name">{item.name}</h3>
              <p className="cart-item-price">{item.price} DZD</p>
            </div>
            
            <div className="cart-item-quantity">
              <button className="quantity-btn" onClick={() => changeQuantity(item.id, -1)}>−</button>
              <span className="quantity-value">{item.quantity}</span>
              <button className="quantity-btn" onClick={() => changeQuantity(item.id, 1)}>+</button>
            </div>
            
            <div className="cart-item-subtotal">{item.price * item.quantity} DZD</div>
            
            <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>{getTotal()} DZD</span>
        </div>
        <div className="cart-summary-row">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="cart-summary-row total">
          <span>Total</span>
          <span>{getTotal()} DZD</span>
        </div>
        
        <button className="checkout-btn" onClick={() => window.location.href = '/checkout'}>
          Proceed to Checkout
          </button>

        
        <button className="continue-shopping-btn" onClick={() => window.location.href = '/'}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default Cart;