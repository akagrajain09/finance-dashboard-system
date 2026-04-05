import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
