import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './RaiseRequest.css';

const ITEMS = [
  { label: 'Pad (Normal)', icon: '🩸' },
  { label: 'Pad (XL)', icon: '🩸' },
  { label: 'Painkiller', icon: '💊' },
  { label: 'Heating Pad', icon: '🔥' },
  { label: 'Other', icon: '🎒' },
];

export default function RaiseRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [urgency, setUrgency] = useState('normal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleItem = (label) => {
    setSelectedItems(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) return setError('Please select at least one item');
    setLoading(true);
    setError('');
    try {
      await API.post('/requests', { items: selectedItems, urgency });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="raise-page">
      <div className="raise-container">
        <h2 className="raise-heading">What do you need?</h2>
        <p className="raise-sub">Your identity stays anonymous. Only block & room shown.</p>

        {error && <p className="raise-error">{error}</p>}

        <p className="section-label">Select items</p>
        <div className="items-grid">
          {ITEMS.map(({ label, icon }) => (
            <div
              key={label}
              onClick={() => toggleItem(label)}
              className={`item-card ${selectedItems.includes(label) ? 'selected' : ''}`}
            >
              <span className="item-icon">{icon}</span>
              <span className="item-label">{label}</span>
            </div>
          ))}
        </div>

        <p className="section-label">Urgency</p>
        <div className="urgency-row">
          <div
            onClick={() => setUrgency('normal')}
            className={`urgency-card ${urgency === 'normal' ? 'normal' : ''}`}
          >
            🕐 Normal
          </div>
          <div
            onClick={() => setUrgency('emergency')}
            className={`urgency-card ${urgency === 'emergency' ? 'emergency' : ''}`}
          >
            🚨 Emergency
          </div>
        </div>

        <div className="location-box">
          📍 Your location: <b>{user.hostelBlock}, Room {user.roomNumber}</b>
        </div>

        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Posting...' : 'Post request anonymously →'}
        </button>
        <p className="raise-note">
          👁️ Only block & room shown. No name, no photo.
        </p>
      </div>
    </div>
  );
}