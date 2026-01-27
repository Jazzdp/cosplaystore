import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  items: [],
};

// Action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      // Check for existing item with same product ID AND same size
      const existingItemIndex = state.items.findIndex(item => 
        item.id === product.id && 
        ((item.selectedSize?.id === product.selectedSize?.id) || 
         (item.selectedSize === null && product.selectedSize === null))
      );
      
      let newItems;
      if (existingItemIndex >= 0) {
        // If same product and size exists, just increase quantity
        newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // If different size or new product, add as separate item
        // Create unique cartItemId combining productId and sizeId
        const sizeId = product.selectedSize?.id || 'no-size';
        const cartItemId = `${product.id}-${sizeId}`;
        
        newItems = [...state.items, { 
          cartItemId,
          id: product.id, 
          quantity,
          name: product.name,
          price: product.price,
          image: product.imageUrl || product.image,
          selectedSize: product.selectedSize || null
        }];
      }
      
      return {
        ...state,
        items: newItems
      };
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      const newItems = state.items.filter(item => item.cartItemId !== action.payload.cartItemId);
      return {
        ...state,
        items: newItems
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { cartItemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, {
          type: CART_ACTIONS.REMOVE_ITEM,
          payload: { cartItemId }
        });
      }
      
      const newItems = state.items.map(item => 
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      );
      
      return {
        ...state,
        items: newItems
      };
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      return initialState;
    }
    
    case CART_ACTIONS.LOAD_CART: {
      return {
        ...state,
        items: action.payload.items || []
      };
    }
    
    default:
      return state;
  }
}

// Create context
const CartContext = createContext();

// Cart provider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({
          type: CART_ACTIONS.LOAD_CART,
          payload: { items: Array.isArray(parsedCart) ? parsedCart : [] }
        });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  // Calculate totals
  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  // Action creators
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity }
    });
  };

  const removeFromCart = (cartItemId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { cartItemId }
    });
  };

  const updateQuantity = (cartItemId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { cartItemId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    localStorage.removeItem('cart');
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    // State
    cartItems: state.items,
    itemCount: getItemCount(),
    total: getCartTotal(),
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    
    // Helpers
    getCartTotal,
    getItemCount,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}