import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import API from '../api/axios';
import RequestCard from '../components/RequestCard';
import MyRequestCard from '../components/MyRequestCard';
import { useAuth } from '../context/AuthContext';
import './Feed.css';

export default function Feed() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [tab, setTab] = useState('feed');
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);

  const fetchRequests = async () => {
    try {
      const { data } = await API.get('/requests');
      setRequests(data.requests || []);

      const { data: mine } = await API.get('/requests/mine');
      setMyRequests(mine || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchRequests();

    socketRef.current = io(process.env.REACT_APP_SOCKET_URL);

    socketRef.current.emit('join-block', user.hostelBlock);

    socketRef.current.on('new-request', fetchRequests);
    socketRef.current.on('request-updated', fetchRequests);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  return (
    <div className="feed-page">
      <div className="feed-container">
        <div className="feed-top-row">
          <div>
            <h2 className="feed-heading">PadPal Feed</h2>
            <p className="feed-sub">
              {user?.hostelBlock} · Live 🟢
            </p>
          </div>

          <button
            className="feed-new-btn"
            onClick={() => navigate('/raise')}
          >
            + Need help
          </button>
        </div>

        <div className="feed-tabs">
          <button
            className={`feed-tab ${tab === 'feed' ? 'active' : ''}`}
            onClick={() => setTab('feed')}
          >
            Nearby requests
          </button>

          <button
            className={`feed-tab ${tab === 'mine' ? 'active' : ''}`}
            onClick={() => setTab('mine')}
          >
            My requests
          </button>
        </div>

        {loading ? (
          <p className="feed-empty-text">Loading...</p>
        ) : tab === 'feed' ? (
          requests.length === 0 ? (
            <div className="feed-empty-box">
              <p className="empty-icon">🌸</p>
              <p className="empty-text">No requests right now.</p>
              <p className="empty-sub">
                Need something? Post a request!
              </p>
            </div>
          ) : (
            requests.map((req) => (
              <RequestCard
                key={req._id}
                request={req}
                onHelped={fetchRequests}
              />
            ))
          )
        ) : myRequests.length === 0 ? (
          <div className="feed-empty-box">
            <p className="empty-icon">🌸</p>
            <p className="empty-text">No requests yet.</p>
          </div>
        ) : (
          myRequests.map((req) => (
            <MyRequestCard
              key={req._id}
              request={req}
              onUpdate={fetchRequests}
            />
          ))
        )}
      </div>
    </div>
  );
}