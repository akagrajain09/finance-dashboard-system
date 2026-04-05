import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const roleColors = {
    Admin: '#3b82f6',
    Analyst: '#10b981',
    Viewer: '#8b5cf6',
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, roles: ['Viewer', 'Analyst', 'Admin'] },
    { to: '/records', label: 'Records', icon: <FileText size={18} />, roles: ['Analyst', 'Admin'] },
  ];

  return (
    <aside className="sidebar glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '0.5rem',
          background: 'linear-gradient(135deg, #3b82f6, #10b981)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '1rem', color: 'white'
        }}>F</div>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>FinanceOS</span>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navLinks
          .filter(link => link.roles.includes(user?.role))
          .map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem', borderRadius: '0.5rem',
                textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem',
                transition: 'all 0.2s',
                background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: isActive ? '#3b82f6' : '#94a3b8',
                borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
              })}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
      </nav>

      {/* User info */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{
          padding: '1rem', borderRadius: '0.75rem',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '1rem'
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>{user?.email}</div>
          <span style={{
            display: 'inline-block', marginTop: '0.5rem',
            padding: '0.2rem 0.6rem', borderRadius: '9999px',
            fontSize: '0.7rem', fontWeight: 600,
            background: `${roleColors[user?.role]}22`,
            color: roleColors[user?.role]
          }}>{user?.role}</span>
        </div>
        <button onClick={logout} className="btn btn-danger" style={{ width: '100%' }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
