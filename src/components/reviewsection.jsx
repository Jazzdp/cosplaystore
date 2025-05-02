import '../styles/components/ReviewSection.css';

function ReviewSection({ reviews }) {
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
  return (
    <div className="review-section">
      <h3>Avis clients ({reviews.length})</h3>
      <div className="average-rating">
        Note moyenne: {averageRating.toFixed(1)} ⭐
      </div>
      
      <div className="reviews-list">
        {reviews.map((review, index) => (
          <div key={index} className="review-item">
            <div className="review-header">
              <span className="rating">
                {Array(5).fill(0).map((_, i) => (
                  <span key={i}>{i < Math.floor(review.rating) ? '⭐' : '☆'}</span>
                ))}
                {review.rating % 1 !== 0 && '½'}
              </span>
              <span className="user-id">Utilisateur #{review.userId}</span>
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewSection;