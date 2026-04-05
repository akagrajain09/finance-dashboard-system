import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, Search, Filter, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Rent', 'Food', 'Utilities', 'Transport', 'Healthcare', 'Entertainment', 'Other'];

const emptyForm = { amount: '', type: 'income', category: '', date: new Date().toISOString().split('T')[0], notes: '' };

const Records = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [filters, setFilters] = useState({ type: '', category: '', startDate: '', endDate: '' });
  const [page, setPage] = useState(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
      const res = await axios.get('/records', { params });
      setRecords(res.data.records);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const openCreate = () => { setEditRecord(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (r) => {
    setEditRecord(r);
    setForm({ amount: r.amount, type: r.type, category: r.category, date: r.date.split('T')[0], notes: r.notes || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.amount || !form.category) return;
    setSaving(true);
    try {
      if (editRecord) {
        await axios.put(`/records/${editRecord._id}`, form);
      } else {
        await axios.post('/records', form);
      }
      setShowModal(false);
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving record');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await axios.delete(`/records/${id}`);
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting record');
    }
  };

  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Financial Records</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            {pagination.total || 0} records total
          </p>
        </div>
        {isAdmin && (
          <button id="add-record-btn" className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> Add Record
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label className="input-label">Type</label>
          <select className="input-field" style={{ width: 130 }} value={filters.type}
            onChange={e => { setFilters(f => ({ ...f, type: e.target.value })); setPage(1); }}>
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label className="input-label">Category</label>
          <select className="input-field" style={{ width: 150 }} value={filters.category}
            onChange={e => { setFilters(f => ({ ...f, category: e.target.value })); setPage(1); }}>
            <option value="">All</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="input-label">From</label>
          <input type="date" className="input-field" style={{ width: 155 }} value={filters.startDate}
            onChange={e => { setFilters(f => ({ ...f, startDate: e.target.value })); setPage(1); }} />
        </div>
        <div>
          <label className="input-label">To</label>
          <input type="date" className="input-field" style={{ width: 155 }} value={filters.endDate}
            onChange={e => { setFilters(f => ({ ...f, endDate: e.target.value })); setPage(1); }} />
        </div>
        <button className="btn" onClick={() => setFilters({ type: '', category: '', startDate: '', endDate: '' })}
          style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', marginTop: '1.25rem' }}>
          <X size={14} /> Clear
        </button>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading records…</div>
        ) : error ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>{error}</div>
        ) : records.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No records found</div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Notes</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r._id} style={{ transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                      {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td>
                      <span className={`badge badge-${r.type}`}>{r.type}</span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{r.category}</td>
                    <td style={{ fontWeight: 700, color: r.type === 'income' ? '#10b981' : '#ef4444' }}>
                      {r.type === 'income' ? '+' : '-'}{fmt(r.amount)}
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: 200 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                        {r.notes || '—'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn" style={{ padding: '0.35rem 0.6rem', background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}
                            onClick={() => openEdit(r)}><Pencil size={14} /></button>
                          <button className="btn btn-danger" style={{ padding: '0.35rem 0.6rem' }}
                            onClick={() => handleDelete(r._id)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button key={p} className="btn" onClick={() => setPage(p)}
                style={{
                  width: 36, height: 36, padding: 0,
                  background: p === page ? '#3b82f6' : 'rgba(255,255,255,0.06)',
                  color: p === page ? 'white' : '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: 480, padding: '2rem', margin: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 700 }}>{editRecord ? 'Edit Record' : 'New Record'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="input-label">Amount (₹)</label>
                <input type="number" className="input-field" placeholder="0.00" value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="input-label">Type</label>
                  <select className="input-field" value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Category</label>
                  <select className="input-field" value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="">Select…</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="input-label">Date</label>
                <input type="date" className="input-field" value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">Notes (optional)</label>
                <input type="text" className="input-field" placeholder="Brief description…" value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}
                  onClick={() => setShowModal(false)}>Cancel</button>
                <button id="save-record-btn" className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
                  <Check size={16} /> {saving ? 'Saving…' : 'Save Record'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
