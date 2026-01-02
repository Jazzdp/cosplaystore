
 /* import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '', category: '', price: '', stock: '', image: ''
  });

  const API_URL = 'http://localhost:8080';

  const fetchWithAuth = (url) => {
    const jwt = localStorage.getItem('jwt');
    const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};
    return fetch(url, { headers });
  };

  const loadData = async () => {
    console.log('Loading data from:', API_URL);
    try {
      const [pRes, uRes, oRes] = await Promise.all([
        fetchWithAuth(`${API_URL}/products`).catch(err => { console.error('Products error:', err); return null; }),
        fetchWithAuth(`${API_URL}/users`).catch(err => { console.error('Users error:', err); return null; }),
        fetchWithAuth(`${API_URL}/orders`).catch(err => { console.error('Orders error:', err); return null; })
      ]);

      if (pRes && pRes.ok) {
        const data = await pRes.json();
        console.log('Products loaded:', data);
        setProducts(Array.isArray(data) ? data : []);
      }
      if (uRes && uRes.ok) {
        const data = await uRes.json();
        console.log('Users loaded:', data);
        setUsers(Array.isArray(data) ? data : []);
      }
      if (oRes && oRes.ok) {
        const data = await oRes.json();
        console.log('Orders loaded:', data);
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      console.log('Loading complete');
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const jwt = localStorage.getItem('jwt');
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
      });
      if (res.ok) setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleAdd = () => {
    setFormData({ name: '', category: '', price: '', stock: '', image: '' });
    setModalMode('add');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const jwt = localStorage.getItem('jwt');
    const payload = { 
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price), 
      stockQuantity: parseInt(formData.stock),
      imageUrl: formData.image
    };
    const headers = { 'Content-Type': 'application/json', ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}) };

    try {
      if (modalMode === 'add') {
        const res = await fetch(`${API_URL}/products`, { method: 'POST', headers, body: JSON.stringify(payload) });
        if (res.ok) {
          const newProduct = await res.json();
          setProducts([newProduct, ...products]);
        }
      } else {
        const res = await fetch(`${API_URL}/products/${formData.id}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
        if (res.ok) {
          const updated = await res.json();
          setProducts(products.map(p => p.id === formData.id ? updated : p));
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    const colors = { 'Delivered': 'success', 'Pending': 'warning', 'Shipped': 'info' };
    return colors[status] || 'secondary';
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredUsers = users.filter(u => (u.fullName || u.username) && (u.fullName || u.username).toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredOrders = orders.filter(o => (o.user?.fullName || o.user?.username || '') && (o.user?.fullName || o.user?.username || '').toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #fae8ff 100%)'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{width: '50px', height: '50px', border: '4px solid #fce7f3', borderTopColor: '#ec4899', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem'}}></div>
          <p style={{color: '#64748b'}}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        body { background: linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #fae8ff 100%); min-height: 100vh; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .sidebar { display: none; }
        .main-content { margin-left: 0; padding: 2rem; transition: margin-left 0.3s ease; }
        .header { background: white; padding: 1rem 1.5rem; border-radius: 15px; box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05); margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; }
        .stat-card { background: white; border-radius: 15px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); transition: transform 0.3s, box-shadow 0.3s; border: 2px solid transparent; cursor: pointer; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(236, 72, 153, 0.2); }
        .stat-card.active { border-color: #ec4899; box-shadow: 0 8px 25px rgba(236, 72, 153, 0.3); }
        .stat-card.pink { border-color: #fce7f3; }
        .stat-card.purple { border-color: #f3e8ff; }
        .stat-card.fuchsia { border-color: #fae8ff; }
        .stat-icon { width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        .stat-icon.pink { background: #fce7f3; color: #ec4899; }
        .stat-icon.purple { background: #f3e8ff; color: #a855f7; }
        .stat-icon.fuchsia { background: #fae8ff; color: #d946ef; }
        .btn-gradient { background: linear-gradient(135deg, #ec4899, #a855f7); border: none; color: white; padding: 0.6rem 1.5rem; border-radius: 10px; font-weight: 500; transition: all 0.3s; cursor: pointer; }
        .btn-gradient:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4); }
        .table-container { background: white; border-radius: 15px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); }
        table { width: 100%; border-collapse: collapse; }
        thead { background: #fce7f3; }
        th { border: none; color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.5px; padding: 1rem; text-align: left; }
        tbody tr { transition: background 0.2s; }
        tbody tr:hover { background: #fce7f3; }
        td { padding: 1rem; border-bottom: 1px solid #f1f5f9; }
        .badge { padding: 0.5rem 1rem; border-radius: 20px; font-weight: 500; font-size: 0.875rem; }
        .badge.success { background: #dcfce7; color: #16a34a; }
        .badge.warning { background: #fef3c7; color: #ca8a04; }
        .badge.info { background: #dbeafe; color: #2563eb; }
        .badge.primary { background: #f3e8ff; color: #a855f7; }
        .product-img { width: 50px; height: 50px; border-radius: 10px; object-fit: cover; }
        .action-btn { width: 35px; height: 35px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; border: none; transition: all 0.3s; cursor: pointer; margin-right: 0.5rem; }
        .action-btn.edit { background: #dbeafe; color: #3b82f6; }
        .action-btn.edit:hover { background: #3b82f6; color: white; }
        .action-btn.delete { background: #fee2e2; color: #ef4444; }
        .action-btn.delete:hover { background: #ef4444; color: white; }
        .search-box { position: relative; flex-grow: 1; max-width: 400px; }
        .search-box input { width: 100%; padding: 0.6rem 0.6rem 0.6rem 2.5rem; border-radius: 10px; border: 1px solid #e2e8f0; }
        .search-box input:focus { outline: none; border-color: #ec4899; box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1); }
        .avatar { width: 45px; height: 45px; border-radius: 50%; background: linear-gradient(135deg, #ec4899, #a855f7); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 1rem; }
        .modal-content { background: white; border-radius: 15px; max-width: 500px; width: 100%; overflow: hidden; }
        .modal-header { background: linear-gradient(135deg, #ec4899, #a855f7); color: white; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; }
        .modal-body { padding: 1.5rem; }
        .modal-footer { padding: 1rem 1.5rem; display: flex; gap: 0.75rem; justify-content: flex-end; }
        .form-group { margin-bottom: 1rem; }
        .form-label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #334155; }
        .form-control { width: 100%; padding: 0.6rem; border: 1px solid #e2e8f0; border-radius: 8px; }
        .form-control:focus { outline: none; border-color: #ec4899; box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1); }
        .btn { padding: 0.6rem 1.5rem; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.3s; border: none; }
        .btn-secondary { background: #e2e8f0; color: #475569; }
        .btn-secondary:hover { background: #cbd5e1; }
        .close-btn { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .close-sidebar-btn { display: flex !important; }
        .menu-btn { display: none !important; }
        @media (max-width: 768px) {
          .main-content { margin-left: 0; }
        }
      `}</style>

      <div className={`sidebar ${!sidebarOpen ? 'hide' : ''}`}>
        <div className="sidebar-header">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3 style={{margin: 0}}>✨ Cosplay Admin</h3>
            <button 
              className="close-sidebar-btn" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSidebarOpen(false);
              }}
            >
              ×
            </button>
          </div>
        </div>
        <nav style={{marginTop: '1rem'}}>
          <div className="nav-item">
            <div className={`nav-link ${activeTab === 'products' ? 'active' : ''}`} onClick={() => { setActiveTab('products'); setSidebarOpen(false); }}>
              <span>📦</span>
              <span>Products</span>
            </div>
          </div>
          <div className="nav-item">
            <div className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => { setActiveTab('users'); setSidebarOpen(false); }}>
              <span>👥</span>
              <span>Users</span>
            </div>
          </div>
          <div className="nav-item">
            <div className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}>
              <span>🛍️</span>
              <span>Orders</span>
            </div>
          </div>
        </nav>
        <div style={{position: 'absolute', bottom: 0, width: '100%', padding: '1rem'}}>
          <div className="nav-link" onClick={() => { localStorage.removeItem('jwt'); window.location.href = '/login'; }}>
            <span>🚪</span>
            <span>Logout</span>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="header">
          <div style={{display: 'flex', alignItems: 'center'}}>
            <h2 style={{margin: 0, fontWeight: 'bold'}}>Dashboard</h2>
          </div>
          <div className="avatar">A</div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
          <div className={`stat-card pink ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <p style={{color: '#64748b', marginBottom: '0.25rem'}}>Total Products</p>
                <h2 style={{fontWeight: 'bold', margin: 0}}>{products.length}</h2>
              </div>
              <div className="stat-icon pink">📦</div>
            </div>
          </div>
          <div className={`stat-card purple ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <p style={{color: '#64748b', marginBottom: '0.25rem'}}>Total Users</p>
                <h2 style={{fontWeight: 'bold', margin: 0}}>{users.length}</h2>
              </div>
              <div className="stat-icon purple">👥</div>
            </div>
          </div>
          <div className={`stat-card fuchsia ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <p style={{color: '#64748b', marginBottom: '0.25rem'}}>Total Orders</p>
                <h2 style={{fontWeight: 'bold', margin: 0}}>{orders.length}</h2>
              </div>
              <div className="stat-icon fuchsia">🛍️</div>
            </div>
          </div>
        </div>

        <div className="table-container">
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem'}}>
            <div className="search-box">
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {activeTab === 'products' && (
              <button className="btn-gradient" onClick={handleAdd}>+ Add Product</button>
            )}
          </div>

          {activeTab === 'products' && (
            <div style={{overflowX: 'auto'}}>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                          <img src={p.imageUrl || 'https://via.placeholder.com/50'} alt={p.name} className="product-img" />
                          <span style={{fontWeight: 600}}>{p.name}</span>
                        </div>
                      </td>
                      <td>{p.category}</td>
                      <td style={{fontWeight: 'bold'}}>${p.price}</td>
                      <td>
                        <span className={`badge ${p.stockQuantity > 10 ? 'success' : 'warning'}`}>{p.stockQuantity}</span>
                      </td>
                      <td>
                        <button className="action-btn edit" onClick={() => handleEdit(p)}>✏️</button>
                        <button className="action-btn delete" onClick={() => handleDelete(p.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div style={{overflowX: 'auto'}}>
              {users.length === 0 ? (
                <div style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>
                  <p>⚠️ Unable to load users - Admin permissions required</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                      <th>Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td style={{fontWeight: 600}}>{u.fullName || u.username}</td>
                        <td>{u.email}</td>
                        <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td><span className="badge primary">0</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div style={{overflowX: 'auto'}}>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(o => (
                    <tr key={o.id}>
                      <td style={{fontWeight: 'bold'}}>#{o.id}</td>
                      <td>{o.user?.fullName || o.user?.username || 'N/A'}</td>
                      <td>{o.product?.name || 'N/A'}</td>
                      <td style={{fontWeight: 'bold'}}>${(o.quantity * (o.product?.price || 0)).toFixed(2)}</td>
                      <td><span className={`badge ${getStatusColor(o.status)}`}>{o.status}</span></td>
                      <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>{modalMode === 'add' ? 'Add New Product' : 'Edit Product'}</h5>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input type="text" className="form-control" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Price</label>
                <input type="number" step="0.01" className="form-control" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input type="number" className="form-control" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input type="text" className="form-control" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-gradient" onClick={handleSubmit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} */
import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '', category: '', price: '', stock: '', image: ''
  });

  const API_URL = 'http://localhost:8080';

  const fetchWithAuth = (url) => {
    const jwt = localStorage.getItem('jwt');
    const headers = jwt ? { 
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    } : { 'Content-Type': 'application/json' };
    
    console.log(`Fetching ${url} with headers:`, headers);
    
    return fetch(url, { headers });
  };

  const loadData = async () => {
    console.log('Loading data from:', API_URL);
    try {
      const [pRes, uRes, oRes] = await Promise.all([
        fetchWithAuth(`${API_URL}/products`).catch(err => { console.error('Products error:', err); return null; }),
        fetchWithAuth(`${API_URL}/api/users`).catch(err => { console.error('Users error:', err); return null; }),
        fetchWithAuth(`${API_URL}/api/orders`).catch(err => { console.error('Orders error:', err); return null; })
      ]);

      console.log('Orders response:', oRes);
      console.log('Orders response status:', oRes?.status);

      if (pRes && pRes.ok) {
        const data = await pRes.json();
        console.log('Products loaded:', data);
        setProducts(Array.isArray(data) ? data : []);
      }
      if (uRes && uRes.ok) {
        const data = await uRes.json();
        console.log('Users loaded:', data);
        setUsers(Array.isArray(data) ? data : []);
      }
      if (oRes && oRes.ok) {
        const data = await oRes.json();
        console.log('Orders loaded:', data);
        setOrders(Array.isArray(data) ? data : []);
      } else {
        console.error('Orders failed with status:', oRes?.status);
      }
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      console.log('Loading complete');
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadData(); 
    
    // Debug JWT
    const jwt = localStorage.getItem('jwt');
    console.log('=== JWT DEBUG ===');
    console.log('JWT exists:', !!jwt);
    if (jwt) {
      try {
        const parts = jwt.split('.');
        const payload = JSON.parse(atob(parts[1]));
        console.log('JWT Payload:', payload);
        console.log('Roles/Authorities:', payload.roles || payload.role || payload.authorities || payload.auth);
      } catch (e) {
        console.error('Failed to decode JWT:', e);
      }
    }
    console.log('=================');
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const jwt = localStorage.getItem('jwt');
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
      });
      if (res.ok) setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleAdd = () => {
    setFormData({ name: '', category: '', price: '', stock: '', image: '' });
    setModalMode('add');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const jwt = localStorage.getItem('jwt');
    const payload = { 
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price), 
      stockQuantity: parseInt(formData.stock),
      imageUrl: formData.image
    };
    const headers = { 'Content-Type': 'application/json', ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}) };

    try {
      if (modalMode === 'add') {
        const res = await fetch(`${API_URL}/products`, { method: 'POST', headers, body: JSON.stringify(payload) });
        if (res.ok) {
          const newProduct = await res.json();
          setProducts([newProduct, ...products]);
        }
      } else {
        const res = await fetch(`${API_URL}/products/${formData.id}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
        if (res.ok) {
          const updated = await res.json();
          setProducts(products.map(p => p.id === formData.id ? updated : p));
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    const colors = { 'Delivered': 'success', 'Pending': 'warning', 'Shipped': 'info' };
    return colors[status] || 'secondary';
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredUsers = users.filter(u => (u.fullName || u.username) && (u.fullName || u.username).toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredOrders = orders.filter(o => (o.user?.fullName || o.user?.username || '') && (o.user?.fullName || o.user?.username || '').toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #fae8ff 100%)'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{width: '50px', height: '50px', border: '4px solid #fce7f3', borderTopColor: '#ec4899', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem'}}></div>
          <p style={{color: '#64748b'}}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        body { background: linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #fae8ff 100%); min-height: 100vh; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .sidebar { display: none; }
        .main-content { margin-left: 0; padding: 2rem; transition: margin-left 0.3s ease; }
        .header { background: white; padding: 1rem 1.5rem; border-radius: 15px; box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05); margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; }
        .stat-card { background: white; border-radius: 15px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); transition: transform 0.3s, box-shadow 0.3s; border: 2px solid transparent; cursor: pointer; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(236, 72, 153, 0.2); }
        .stat-card.active { border-color: #ec4899; box-shadow: 0 8px 25px rgba(236, 72, 153, 0.3); }
        .stat-card.pink { border-color: #fce7f3; }
        .stat-card.purple { border-color: #f3e8ff; }
        .stat-card.fuchsia { border-color: #fae8ff; }
        .stat-icon { width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        .stat-icon.pink { background: #fce7f3; color: #ec4899; }
        .stat-icon.purple { background: #f3e8ff; color: #a855f7; }
        .stat-icon.fuchsia { background: #fae8ff; color: #d946ef; }
        .btn-gradient { background: linear-gradient(135deg, #ec4899, #a855f7); border: none; color: white; padding: 0.6rem 1.5rem; border-radius: 10px; font-weight: 500; transition: all 0.3s; cursor: pointer; }
        .btn-gradient:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4); }
        .table-container { background: white; border-radius: 15px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); }
        table { width: 100%; border-collapse: collapse; }
        thead { background: #fce7f3; }
        th { border: none; color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.5px; padding: 1rem; text-align: left; }
        tbody tr { transition: background 0.2s; }
        tbody tr:hover { background: #fce7f3; }
        td { padding: 1rem; border-bottom: 1px solid #f1f5f9; }
        .badge { padding: 0.5rem 1rem; border-radius: 20px; font-weight: 500; font-size: 0.875rem; }
        .badge.success { background: #dcfce7; color: #16a34a; }
        .badge.warning { background: #fef3c7; color: #ca8a04; }
        .badge.info { background: #dbeafe; color: #2563eb; }
        .badge.primary { background: #f3e8ff; color: #a855f7; }
        .product-img { width: 50px; height: 50px; border-radius: 10px; object-fit: cover; }
        .action-btn { width: 35px; height: 35px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; border: none; transition: all 0.3s; cursor: pointer; margin-right: 0.5rem; }
        .action-btn.edit { background: #dbeafe; color: #3b82f6; }
        .action-btn.edit:hover { background: #3b82f6; color: white; }
        .action-btn.delete { background: #fee2e2; color: #ef4444; }
        .action-btn.delete:hover { background: #ef4444; color: white; }
        .search-box { position: relative; flex-grow: 1; max-width: 400px; }
        .search-box input { width: 100%; padding: 0.6rem 0.6rem 0.6rem 2.5rem; border-radius: 10px; border: 1px solid #e2e8f0; }
        .search-box input:focus { outline: none; border-color: #ec4899; box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1); }
        .avatar { width: 45px; height: 45px; border-radius: 50%; background: linear-gradient(135deg, #ec4899, #a855f7); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 1rem; }
        .modal-content { background: white; border-radius: 15px; max-width: 500px; width: 100%; overflow: hidden; }
        .modal-header { background: linear-gradient(135deg, #ec4899, #a855f7); color: white; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; }
        .modal-body { padding: 1.5rem; }
        .modal-footer { padding: 1rem 1.5rem; display: flex; gap: 0.75rem; justify-content: flex-end; }
        .form-group { margin-bottom: 1rem; }
        .form-label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #334155; }
        .form-control { width: 100%; padding: 0.6rem; border: 1px solid #e2e8f0; border-radius: 8px; }
        .form-control:focus { outline: none; border-color: #ec4899; box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1); }
        .btn { padding: 0.6rem 1.5rem; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.3s; border: none; }
        .btn-secondary { background: #e2e8f0; color: #475569; }
        .btn-secondary:hover { background: #cbd5e1; }
        .close-btn { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .close-sidebar-btn { display: flex !important; }
        .menu-btn { display: none !important; }
        @media (max-width: 768px) {
          .main-content { margin-left: 0; }
        }
      `}</style>

      <div className={`sidebar ${!sidebarOpen ? 'hide' : ''}`}>
        <div className="sidebar-header">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3 style={{margin: 0}}>✨ Cosplay Admin</h3>
            <button 
              className="close-sidebar-btn" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSidebarOpen(false);
              }}
            >
              ×
            </button>
          </div>
        </div>
        <nav style={{marginTop: '1rem'}}>
          <div className="nav-item">
            <div className={`nav-link ${activeTab === 'products' ? 'active' : ''}`} onClick={() => { setActiveTab('products'); setSidebarOpen(false); }}>
              <span>📦</span>
              <span>Products</span>
            </div>
          </div>
          <div className="nav-item">
            <div className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => { setActiveTab('users'); setSidebarOpen(false); }}>
              <span>👥</span>
              <span>Users</span>
            </div>
          </div>
          <div className="nav-item">
            <div className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}>
              <span>🛍️</span>
              <span>Orders</span>
            </div>
          </div>
        </nav>
        <div style={{position: 'absolute', bottom: 0, width: '100%', padding: '1rem'}}>
          <div className="nav-link" onClick={() => { localStorage.removeItem('jwt'); window.location.href = '/login'; }}>
            <span>🚪</span>
            <span>Logout</span>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="header">
          <div style={{display: 'flex', alignItems: 'center'}}>
            <h2 style={{margin: 0, fontWeight: 'bold'}}>Dashboard</h2>
          </div>
          <div className="avatar">A</div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
          <div className={`stat-card pink ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <p style={{color: '#64748b', marginBottom: '0.25rem'}}>Total Products</p>
                <h2 style={{fontWeight: 'bold', margin: 0}}>{products.length}</h2>
              </div>
              <div className="stat-icon pink">📦</div>
            </div>
          </div>
          <div className={`stat-card purple ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <p style={{color: '#64748b', marginBottom: '0.25rem'}}>Total Users</p>
                <h2 style={{fontWeight: 'bold', margin: 0}}>{users.length}</h2>
              </div>
              <div className="stat-icon purple">👥</div>
            </div>
          </div>
          <div className={`stat-card fuchsia ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <p style={{color: '#64748b', marginBottom: '0.25rem'}}>Total Orders</p>
                <h2 style={{fontWeight: 'bold', margin: 0}}>{orders.length}</h2>
              </div>
              <div className="stat-icon fuchsia">🛍️</div>
            </div>
          </div>
        </div>

        <div className="table-container">
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem'}}>
            <div className="search-box">
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {activeTab === 'products' && (
              <button className="btn-gradient" onClick={handleAdd}>+ Add Product</button>
            )}
          </div>

          {activeTab === 'products' && (
            <div style={{overflowX: 'auto'}}>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                          <img src={p.imageUrl || 'https://via.placeholder.com/50'} alt={p.name} className="product-img" />
                          <span style={{fontWeight: 600}}>{p.name}</span>
                        </div>
                      </td>
                      <td>{p.category}</td>
                      <td style={{fontWeight: 'bold'}}>${p.price}</td>
                      <td>
                        <span className={`badge ${p.stockQuantity > 10 ? 'success' : 'warning'}`}>{p.stockQuantity}</span>
                      </td>
                      <td>
                        <button className="action-btn edit" onClick={() => handleEdit(p)}>✏️</button>
                        <button className="action-btn delete" onClick={() => handleDelete(p.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div style={{overflowX: 'auto'}}>
              {users.length === 0 ? (
                <div style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>
                  <p>⚠️ Unable to load users - Admin permissions required</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td style={{fontWeight: 600}}>{u.fullName || u.username}</td>
                        <td>{u.email}</td>
                        <td><span className="badge info">{u.role}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div style={{overflowX: 'auto'}}>
              {orders.length === 0 ? (
                <div style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>
                  <p>⚠️ No orders found</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(o => (
                      <tr key={o.id}>
                        <td style={{fontWeight: 'bold'}}>#{o.id}</td>
                        <td>{o.user?.fullName || o.user?.username || 'N/A'}</td>
                        <td>{o.product?.name || 'N/A'}</td>
                        <td>{o.quantity}</td>
                        <td style={{fontWeight: 'bold'}}>${(o.quantity * (o.product?.price || 0)).toFixed(2)}</td>
                        <td><span className={`badge ${getStatusColor(o.status)}`}>{o.status}</span></td>
                        <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>{modalMode === 'add' ? 'Add New Product' : 'Edit Product'}</h5>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input type="text" className="form-control" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Price</label>
                <input type="number" step="0.01" className="form-control" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input type="number" className="form-control" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input type="text" className="form-control" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-gradient" onClick={handleSubmit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
