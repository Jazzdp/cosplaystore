import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/itemcard.css';
import { useNavigate } from 'react-router-dom';

const ItemCard = ({ product, showToast }) => {
  const { id, name, price, image } = product;
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    showToast && showToast(); 
  };

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="item-card" onClick={handleCardClick}>
      <div className="item-image-container">
        <img src={image} alt={name} className="item-image" />
        {product.views < 10 && <span className="badge">New Arrival</span>}
      </div>
      <div className="item-details">
        <h3 className="item-name">{name}</h3>
        <p className="item-price">
          <span className="price-icon"></span> {price.toLocaleString()} ₫
        </p>
      </div>
      <button 
        className="add-to-cart-btn" 
        onClick={handleAdd}
      >
        Add to Cart
      </button> 
    </div>
  ); 
};

export default ItemCard;
