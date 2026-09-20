import { useState } from 'react';
import API from '../api/axios';
import './MyRequestCard.css';

export default function MyRequestCard({ request, onUpdate }) {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReceived = async () => {
    setLoading(true);
    setError('');
    try {
      await API.patch(`/requests/${request._id}/received`, { rating });
      onUpdate();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  const statusClass = {
    open: 'status-open',
    matched: 'status-matched',
    completed: 'status-completed',
  };

  return (
    <div className="my-request-card">
      <div className="header">
        <div className="items">
          {request.items.map(item => (
            <span key={item} className="item-tag">{item}</span>
          ))}
        </div>
        <span className={`status-badge ${statusClass[request.status]}`}>
          {request.status}
        </span>
      </div>

      <p className="posted-time">
        {new Date(request.createdAt).toLocaleString()}
      </p>

      {error && <p className="error-msg">{error}</p>}

      {request.status === 'matched' && (
        <div className="rating-section">
          <p className="rating-label">Someone is on their way! Rate them:</p>
          <div className="stars">
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={`star ${star <= rating ? '' : 'inactive'}`}
              >
                ⭐
              </span>
            ))}
          </div>
          <button
            className="received-btn"
            onClick={handleReceived}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Mark as Received ✓'}
          </button>
        </div>
      )}

      {request.status === 'completed' && (
        <p className="completed-note">
          ✅ Completed {request.rating ? `· You rated ${request.rating}⭐` : ''}
        </p>
      )}
    </div>
  );
}