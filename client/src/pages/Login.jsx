import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './Login.css';

const BLOCKS = ['Block A', 'Block B', 'Block C', 'Block D'];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
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
      const { data } = await API.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">🌸 PadPal</h2>
        <p className="login-sub">Girl-to-girl support, always nearby</p>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit}>
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

          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />

          <button className="form-btn" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Enter anonymously →'}
          </button>
        </form>
        <p className="form-bottom">
          New here? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}