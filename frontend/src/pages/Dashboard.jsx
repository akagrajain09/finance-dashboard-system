import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TrendingUp, TrendingDown, Wallet, Activity,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const StatCard = ({ label, value, icon, change, color }) => (
  <div className="glass-panel stat-card" style={{ borderTop: `3px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>{label}</span>
      <div style={{
        padding: '0.5rem', borderRadius: '0.5rem',
        background: `${color}22`, color
      }}>{icon}</div>
    </div>
    <div className="stat-value" style={{ color }}>{value}</div>
    {change !== undefined && (
      <div style={{ fontSize: '0.8rem', color: change >= 0 ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
        {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(change).toFixed(1)}% this month
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('/dashboard/summary');
        setSummary(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center', color: '#94a3b8' }}>
        <Activity size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <p>Loading dashboard…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="glass-panel" style={{ padding: '2rem', color: '#ef4444', textAlign: 'center' }}>
      {error}
    </div>
  );

  const incomePieData = (summary?.categories?.income || []).map(c => ({ name: c.category, value: c.total }));
  const expensePieData = (summary?.categories?.expense || []).map(c => ({ name: c.category, value: c.total }));

  const barData = [
    { name: 'Income', amount: summary?.totalIncome || 0, fill: '#10b981' },
    { name: 'Expense', amount: summary?.totalExpense || 0, fill: '#ef4444' },
    { name: 'Net', amount: summary?.netBalance || 0, fill: '#3b82f6' },
  ];

  return (
    <div>
      {/* Stat Cards */}
      <div className="dashboard-grid">
        <StatCard label="Total Income" value={fmt(summary?.totalIncome)} icon={<TrendingUp size={20} />} color="#10b981" />
        <StatCard label="Total Expenses" value={fmt(summary?.totalExpense)} icon={<TrendingDown size={20} />} color="#ef4444" />
        <StatCard
          label="Net Balance"
          value={fmt(summary?.netBalance)}
          icon={<Wallet size={20} />}
          color={summary?.netBalance >= 0 ? '#3b82f6' : '#f59e0b'}
        />
        <StatCard label="Total Records" value={
          ((summary?.categories?.income?.length || 0) + (summary?.categories?.expense?.length || 0)) + ' categories'
        } icon={<Activity size={20} />} color="#8b5cf6" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Bar chart */}
        <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={48}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 13 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}
                formatter={(v) => fmt(v)}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Income Pie */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Income by Category</h2>
          {incomePieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={incomePieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={3}>
                  {incomePieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}
                  formatter={(v) => fmt(v)}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '3rem' }}>No income data</p>}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Recent Activity</h2>
        {(summary?.recentActivity || []).length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem 0' }}>No recent activity</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {summary.recentActivity.map((record) => (
              <div key={record._id} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.75rem', borderRadius: '0.5rem',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: record.type === 'income' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                  color: record.type === 'income' ? '#10b981' : '#ef4444'
                }}>
                  {record.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{record.category}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                    {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {record.notes && ` · ${record.notes}`}
                  </div>
                </div>
                <div style={{
                  fontWeight: 700, fontSize: '0.95rem',
                  color: record.type === 'income' ? '#10b981' : '#ef4444'
                }}>
                  {record.type === 'income' ? '+' : '-'}{fmt(record.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
