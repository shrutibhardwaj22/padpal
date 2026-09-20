import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

export default function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/admin/stats'),
      API.get('/admin/users')
    ])
      .then(([s, u]) => {
        setStats(s.data);
        setUsers(u.data);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const blockUser = async (id) => {
    if (!window.confirm('Block this user?')) return;
    await API.patch(`/admin/users/${id}/block`);
    setUsers(prev => prev.map(u =>
      u._id === id ? { ...u, role: 'blocked' } : u
    ));
  };

  const unblockUser = async (id) => {
    await API.patch(`/admin/users/${id}/unblock`);
    setUsers(prev => prev.map(u =>
      u._id === id ? { ...u, role: 'user' } : u
    ));
  };

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-loading">Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h2 className="admin-heading">🛡️ Admin Panel</h2>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${tab === 'stats' ? 'active' : ''}`}
            onClick={() => setTab('stats')}
          >
            📊 Stats
          </button>
          <button
            className={`admin-tab ${tab === 'users' ? 'active' : ''}`}
            onClick={() => setTab('users')}
          >
            👥 Users
          </button>
        </div>

        {tab === 'stats' && stats && (
          <div className="stats-grid">
            {[
              { label: 'Total Requests', value: stats.totalRequests, icon: '📋' },
              { label: 'Completed', value: stats.completed, icon: '✅' },
              { label: 'Open Now', value: stats.open, icon: '🔴' },
              { label: 'Total Users', value: stats.totalUsers, icon: '👩‍🎓' },
            ].map(item => (
              <div key={item.label} className="stat-card">
                <p className="stat-icon">{item.icon}</p>
                <p className="stat-number">{item.value}</p>
                <p className="stat-label">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'users' && (
          <div>
            {users.map(u => (
              <div key={u._id} className="user-row">
                <div>
                  <p className="user-name">{u.avatar} {u.nickname}</p>
                  <p className="user-sub">
                    {u.hostelBlock} · Room {u.roomNumber} · {u.compassionPoints} pts
                  </p>
                </div>
                {u.role === 'blocked' ? (
                  <button className="unblock-btn" onClick={() => unblockUser(u._id)}>
                    Unblock
                  </button>
                ) : (
                  <button className="block-btn" onClick={() => blockUser(u._id)}>
                    Block
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}