import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [uRes, oRes] = await Promise.all([
          fetch('http://localhost:8080/users'),
          fetch('http://localhost:8080/orders')
        ]);
        const [uData, oData] = await Promise.all([uRes.json(), oRes.json()]);
        if (!mounted) return;
        setUsers(Array.isArray(uData) ? uData : []);
        setOrders(Array.isArray(oData) ? oData : []);
      } catch (err) {
        console.error('Admin load error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="container mt-5">Loading admin dashboard...</div>;

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card p-3">
            <h5>Users</h5>
            <p className="display-6">{users.length}</p>
            <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/users')}>Manage users</button>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <h5>Orders</h5>
            <p className="display-6">{orders.length}</p>
            <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/orders')}>Manage orders</button>
          </div>
        </div>
      </div>

      <hr />

      <h4 className="mt-4">Recent Orders</h4>
      <div className="list-group">
        {orders.slice(0, 10).map(o => (
          <div key={o.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>Order #{o.id}</strong> — User: {o.user?.username || o.user?.id} — Product: {o.product?.name || o.product?.id}
            </div>
            <div>{o.quantity} pcs</div>
          </div>
        ))}
      </div>

      <h4 className="mt-4">Users</h4>
      <div className="list-group">
        {users.slice(0, 20).map(u => (
          <div key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{u.username}</strong>
              <div className="small text-muted">{u.email}</div>
            </div>
            <div className="badge bg-secondary">{u.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
