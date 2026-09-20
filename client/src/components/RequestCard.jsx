import { useState } from 'react';
import HelpModal from './HelpModal';
import { useAuth } from '../context/AuthContext';
import './RequestCard.css';

export default function RequestCard({ request, onHelped }) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const isOwn = request.postedBy?.toString() === user.id?.toString();
  const isMatched = request.status !== 'open';

  return (
    <div className="request-card">
      <div className="header">
        <div className="user-info">
          <div className="avatar">🌸</div>
          <div>
            <p className="location">{request.hostelBlock}, Room {request.roomNumber}</p>
            <p className="time">
              {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <span className={`badge ${request.urgency === 'emergency' ? 'emergency' : 'normal'}`}>
          {request.urgency === 'emergency' ? '🚨 Urgent' : '🕐 Normal'}
        </span>
      </div>

      <div className="items">
        {request.items.map(item => (
          <span key={item} className="item-tag">{item}</span>
        ))}
      </div>

      {isOwn ? (
        <button className="own-btn" disabled>Your request</button>
      ) : isMatched ? (
        <button className="matched-btn" disabled>Helper matched ✓</button>
      ) : (
        <button className="help-btn" onClick={() => setShowModal(true)}>I can help 🤝</button>
      )}

      {showModal && (
        <HelpModal
          request={request}
          onClose={() => setShowModal(false)}
          onHelped={onHelped}
        />
      )}
    </div>
  );
}