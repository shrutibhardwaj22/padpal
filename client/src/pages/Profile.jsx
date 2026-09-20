import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const BADGE_THRESHOLDS = [
  { points: 10, badge: '🩸 Period Pal' },
  { points: 30, badge: '⚡ Fast Responder' },
  { points: 60, badge: '🏆 Care Champion' },
];

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/auth/me')
      .then(({ data }) => setProfile(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pts = profile?.compassionPoints || 0;
  const earnedBadges = BADGE_THRESHOLDS.filter(b => pts >= b.points);
  const nextBadge = BADGE_THRESHOLDS.find(b => pts < b.points);
  const prevThreshold = nextBadge
    ? BADGE_THRESHOLDS[BADGE_THRESHOLDS.indexOf(nextBadge) - 1]?.points || 0
    : null;

  if (loading) {
    return (
      <div className="profile-page">
        <p className="profile-loading">Loading...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-top">
          <div className="profile-avatar">{user.avatar}</div>
          <div>
            <p className="profile-name">{user.nickname}</p>
            <p className="profile-sub">{user.hostelBlock} · Room {user.roomNumber}</p>
          </div>
        </div>

        <div className="points-card">
          <p className="points-number">{pts}</p>
          <p className="points-label">Compassion Points</p>
          <div className="badges-row">
            {earnedBadges.length === 0 ? (
              <span className="no-badge">Help others to earn badges! 🌸</span>
            ) : (
              earnedBadges.map(b => (
                <span key={b.badge} className="badge-chip">{b.badge}</span>
              ))
            )}
          </div>
        </div>

        {nextBadge && (
          <div className="next-badge-card">
            <p className="next-badge-text">
              🎯 <b>{nextBadge.points - pts} more points</b> to earn {nextBadge.badge}
            </p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(
                    ((pts - (prevThreshold || 0)) /
                      (nextBadge.points - (prevThreshold || 0))) * 100,
                    100
                  )}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}