import { useState } from 'react';
import API from '../api/axios';
import './HelpModal.css';

const TIMES = ['2 mins', '5 mins', '10 mins', '15 mins'];

export default function HelpModal({ request, onClose, onHelped }) {
  const [selectedTime, setSelectedTime] = useState('5 mins');
  const [loading, setLoading] = useState(false);
  const [matched, setMatched] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await API.patch(`/requests/${request._id}/help`);
      setMatched(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-sheet">
        {!matched ? (
          <>
            <button className="modal-close" onClick={onClose}>✕</button>
            <h3 className="modal-title">Offer help 🤝</h3>
            <p className="modal-sub">
              {request.hostelBlock}, Room {request.roomNumber} needs: {request.items.join(', ')}
            </p>
            {error && <p className="modal-error">{error}</p>}
            <p className="modal-label">Estimated delivery time</p>
            <div className="time-row">
              {TIMES.map(t => (
                <span
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`time-chip ${selectedTime === t ? 'selected' : ''}`}
                >
                  {t}
                </span>
              ))}
            </div>
            <button
              className="modal-confirm-btn"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Matching...' : "Confirm — I'll deliver it"}
            </button>
          </>
        ) : (
          <>
            <div className="match-anim">🤝</div>
            <h3 className="match-title">You're a PadPal!</h3>
            <div className="delivery-box">
              <p>📍 {request.hostelBlock}, Room {request.roomNumber}</p>
              <p>📦 {request.items.join(', ')}</p>
              <p>⏱ ETA: {selectedTime}</p>
            </div>
            <p className="delivery-note">
              🔒 She only sees your room number. Knock or leave outside.
            </p>
            <button
              className="modal-confirm-btn"
              onClick={() => { onHelped(); onClose(); }}
            >
              Mark as Dropped ✓
            </button>
          </>
        )}
      </div>
    </div>
  );
}