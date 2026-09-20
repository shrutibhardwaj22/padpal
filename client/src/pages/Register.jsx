import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './Register.css';

const AVATARS = ['🌸', '🌼', '🌷', '🌺', '🍀'];
const BLOCKS = ['Block A', 'Block B', 'Block C', 'Block D'];

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nickname: '',
    avatar: '🌸',
    hostelBlock: 'Block A',
    roomNumber: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/auth/register', form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">🌸 Join PadPal</h2>
        <p className="register-sub">Anonymous. Safe. Always nearby.</p>
        {error && <p className="register-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="form-label">Nickname</label>
          <input
            className="form-input"
            placeholder="e.g. Flower_203"
            value={form.nickname}
            onChange={e => setForm({ ...form, nickname: e.target.value })}
            required
          />

          <label className="form-label">Pick your avatar</label>
          <div className="avatar-row">
            {AVATARS.map(a => (
              <span
                key={a}
                onClick={() => setForm({ ...form, avatar: a })}
                className={`avatar-option ${form.avatar === a ? 'selected' : ''}`}
              >
                {a}
              </span>
            ))}
          </div>

          <label className="form-label">Hostel Block</label>
          <select
            className="form-input"
            value={form.hostelBlock}
            onChange={e => setForm({ ...form, hostelBlock: e.target.value })}
          >
            {BLOCKS.map(b => <option key={b}>{b}</option>)}
          </select>

          <label className="form-label">Room Number</label>
          <input
            className="form-input"
            placeholder="e.g. 203"
            value={form.roomNumber}
            onChange={e => setForm({ ...form, roomNumber: e.target.value })}
            required
          />

          <label className="form-label">Password (min 6 characters)</label>
          <input
            className="form-input"
            type="password"
            placeholder="Set a password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />

          <button className="form-btn" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Enter anonymously →'}
          </button>
        </form>
        <p className="register-bottom">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}