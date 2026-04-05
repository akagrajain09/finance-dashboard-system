import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';

const pageTitles = {
  '/dashboard': 'Dashboard Overview',
  '/records': 'Financial Records',
};

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'FinanceOS';

  return (
    <header className="navbar" style={{ background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(12px)' }}>
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</h1>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.125rem' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '0.5rem', padding: '0.5rem', color: '#94a3b8', cursor: 'pointer'
        }}>
          <Bell size={18} />
        </button>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6, #10b981)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '0.875rem', color: 'white'
        }}>
          {user?.name?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
