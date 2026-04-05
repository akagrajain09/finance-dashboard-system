import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, TrendingUp, UserPlus } from 'lucide-react';

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Viewer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password, formData.role);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  const update = (field) => (e) => setFormData(f => ({ ...f, [field]: e.target.value }));

  return (
    <div className="auth-container">
      {/* Animated background blobs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
          top: '-200px', right: '-200px', animation: 'float 9s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
          bottom: '-150px', left: '-150px', animation: 'float 11s ease-in-out infinite reverse'
        }} />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
      `}</style>

      <div className="glass-panel auth-form" style={{ position: 'relative', zIndex: 1, maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '1rem', margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <UserPlus size={26} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Create Account</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem', fontSize: '0.875rem' }}>
            Join FinanceOS to manage your finances
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem', borderRadius: '0.5rem',
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444', fontSize: '0.875rem'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label className="input-label">Full Name</label>
            <input
              id="reg-name"
              type="text"
              className="input-field"
              placeholder="John Doe"
              value={formData.name}
              onChange={update('name')}
              required
            />
          </div>

          <div>
            <label className="input-label">Email Address</label>
            <input
              id="reg-email"
              type="email"
              className="input-field"
              placeholder="john@example.com"
              value={formData.email}
              onChange={update('email')}
              required
            />
          </div>

          <div>
            <label className="input-label">Role</label>
            <select
              id="reg-role"
              className="input-field"
              value={formData.role}
              onChange={update('role')}
            >
              <option value="Viewer">Viewer — View dashboard only</option>
              <option value="Analyst">Analyst — View records &amp; insights</option>
              <option value="Admin">Admin — Full access</option>
            </select>
          </div>

          <div>
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={update('password')}
                required
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', color: '#94a3b8', cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="input-label">Confirm Password</label>
            <input
              id="reg-confirm-password"
              type="password"
              className="input-field"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={update('confirmPassword')}
              required
            />
          </div>

          <button
            id="register-btn"
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              padding: '0.875rem', fontSize: '1rem', marginTop: '0.25rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#3b82f6', fontWeight: 500, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
