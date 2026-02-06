import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticatedApi } from '../Util/AxiosConfig';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [modalType, setModalType] = useState('product'); // 'product' or 'order'
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [formData, setFormData] = useState({
    name: '', categoryId: '', price: '', sizes: [], image: ''
  });

  const [orderFormData, setOrderFormData] = useState({
    id: '', quantity: '', status: '' , phone: '', address: '', fullName: '', createdAt: ''
  });

  const [userFormData, setUserFormData] = useState({
    id: '', username: '', role: '', email: '', fullName: '', phone: ''
  });

  const [categoryFormData, setCategoryFormData] = useState({
    id: '', name: '', picUrl: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const verifyAdminAccess = async () => {
    const jwt = localStorage.getItem('jwt');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!jwt || user.role !== 'ROLE_ADMIN') {
      navigate('/login');
      return false;
    }

    try {
      const res = await authenticatedApi.get('/admin/verify');
      if (res.data && res.data.authorized) {
        setAuthorized(true);
        return true;
      }
      navigate('/login');
      return false;
    } catch (err) {
      console.error('Admin verification failed:', err);
      navigate('/login');
      return false;
    }
  };

  const loadData = async () => {
    try {
      const [pRes, uRes, oRes, cRes] = await Promise.all([
        authenticatedApi.get('/products'),
        authenticatedApi.get('/users'),
        authenticatedApi.get('/orders'),
        authenticatedApi.get('/api/categories')
      ]);

      setProducts(Array.isArray(pRes.data) ? pRes.data : []);
      setUsers(Array.isArray(uRes.data) ? uRes.data : []);
      setOrders(Array.isArray(oRes.data) ? oRes.data : []);
      setCategories(Array.isArray(cRes.data) ? cRes.data : []);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    const init = async () => {
      const isAuthorized = await verifyAdminAccess();
      if (isAuthorized) {
        await loadData();
      }
    };
    init();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await authenticatedApi.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
      setSuccess('Product deleted successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to delete product');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await authenticatedApi.delete(`/orders/${id}`);
      setOrders(orders.filter(o => o.id !== id));
      setSuccess('Order deleted successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to delete order');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await authenticatedApi.delete(`/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      setSuccess('User deleted successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to delete user');
    }
  };

  const handleAddCategory = () => {
    setCategoryFormData({ id: '', name: '', picUrl: '' });
    setModalMode('add');
    setModalType('category');
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setCategoryFormData({
      id: category.id,
      name: category.name,
      picUrl: category.picUrl
    });
    setModalMode('edit');
    setModalType('category');
    setShowModal(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await authenticatedApi.delete(`/api/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
      setSuccess('Category deleted successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to delete category');
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setModalMode('edit');
    setModalType('product');
    setShowModal(true);
  };

  const handleEditOrder = (order) => {
    setOrderFormData({
      id: order.id,
      quantity: order.quantity || 1,
      status: order.status || 'Pending',
      phone: order.phone || '',
      address: order.address || '',
      fullName: order.fullName || '',
      size: order.size || null,
      productId: order.product?.id,
      createdAt: order.createdAt
    });

    setModalMode('edit');
    setModalType('order');
    setShowModal(true);
  };

  const handleAdd = () => {
    setFormData({ name: '', categoryId: '', price: '', sizes: [], image: '' });
    setModalMode('add');
    setModalType('product');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    
    if (modalType === 'product') {
      // Only validate all fields when ADDING (not editing)
      if (modalMode === 'add') {
        if (!formData.name || !formData.name.trim()) {
          setError('Product name is required');
          return;
        }
        if (!formData.categoryId) {
          setError('Category is required');
          return;
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
          setError('Valid price is required');
          return;
        }
        if (!formData.image || !formData.image.trim()) {
          setError('Image URL is required');
          return;
        }
        if (!formData.sizes || formData.sizes.length === 0) {
          setError('At least one size is required');
          return;
        }
      } else {
        // When editing, only validate fields that have been changed
        if (formData.name && !formData.name.trim()) {
          setError('Product name cannot be empty');
          return;
        }
        if (formData.price && parseFloat(formData.price) <= 0) {
          setError('Valid price is required');
          return;
        }
      }

      const payload = { 
        name: formData.name,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        price: formData.price ? parseFloat(formData.price) : null, 
        sizes: formData.sizes,
        imageUrl: formData.image,
        description: formData.description || ''
      };

      try {
        if (modalMode === 'add') {
          const res = await authenticatedApi.post('/products', payload);
          setProducts([res.data, ...products]);
          setSuccess('Product added successfully!');
          setTimeout(() => setShowModal(false), 500);
        } else {
          const res = await authenticatedApi.put(`/products/${formData.id}`, payload);
          setProducts(products.map(p => p.id === formData.id ? res.data : p));
          setSuccess('Product updated successfully!');
          setTimeout(() => setShowModal(false), 500);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to save product');
      }
    } else if (modalType === 'order') {
      // Update order
      const payload = {
        quantity: parseInt(orderFormData.quantity),
        status: orderFormData.status,
        phone: parseInt(orderFormData.phone) || 0,
        address: orderFormData.address,
        fullName: orderFormData.fullName,
        size: orderFormData.size ? { id: orderFormData.size.id } : null
      };

      try {
        // If status is changed to Cancelled, delete the order (which will restore stock)
        if (orderFormData.status === 'Cancelled') {
          if (!window.confirm('Cancelling this order will restore the stock. Continue?')) {
            return;
          }
          await authenticatedApi.delete(`/orders/${orderFormData.id}`);
          setOrders(orders.filter(o => o.id !== orderFormData.id));
          setSuccess('Order cancelled successfully!');
          setShowModal(false);
        } else {
          const res = await authenticatedApi.put(`/orders/${orderFormData.id}`, payload);
          setOrders(orders.map(o => o.id === orderFormData.id ? res.data : o));
          setSuccess('Order updated successfully!');
          setShowModal(false);
        }
      } catch (err) {
        console.error('Error updating order:', err);
        setError(err.response?.data?.message || 'Failed to update order');
      }
    } else if (modalType === 'user') {
      // Update user
      const payload = {
        username: userFormData.username,
        email: userFormData.email,
        fullName: userFormData.fullName,
        phone: userFormData.phone,
        role: userFormData.role,
        password: userFormData.password || ''
      };

      try {
        const res = await authenticatedApi.put(`/users/${userFormData.id}`, payload);
        setUsers(users.map(u => u.id === userFormData.id ? res.data : u));
        setSuccess('User updated successfully!');
        setTimeout(() => setShowModal(false), 500);
      } catch (err) {
        console.error('Error updating user:', err);
        setError(err.response?.data?.message || 'Failed to update user');
      }
    } else if (modalType === 'category') {
      // Validate category fields
      if (!categoryFormData.name || !categoryFormData.name.trim()) {
        setError('Category name is required');
        return;
      }
      if (!categoryFormData.picUrl || !categoryFormData.picUrl.trim()) {
        setError('Category picture URL is required');
        return;
      }

      const payload = {
        name: categoryFormData.name,
        picUrl: categoryFormData.picUrl
      };

      try {
        if (modalMode === 'add') {
          const res = await authenticatedApi.post('/api/categories', payload);
          setCategories([...categories, res.data]);
          setSuccess('Category added successfully!');
          setTimeout(() => setShowModal(false), 500);
        } else {
          const res = await authenticatedApi.put(`/api/categories/${categoryFormData.id}`, payload);
          setCategories(categories.map(c => c.id === categoryFormData.id ? res.data : c));
          setSuccess('Category updated successfully!');
          setTimeout(() => setShowModal(false), 500);
        }
      } catch (err) {
        console.error('Error with category:', err);
        setError(err.response?.data?.message || 'Failed to save category');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = { 'Delivered': 'success', 'Pending': 'warning', 'Shipped': 'info' };
    return colors[status] || 'secondary';
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredUsers = users.filter(u => (u.fullName || u.username) && (u.fullName || u.username).toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredOrders = orders.filter(o => (o.fullName || o.phone || o.id?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase()));

  if (!authorized || loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #fae8ff 100%)'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{width: '50px', height: '50px', border: '4px solid #fce7f3', borderTopColor: '#ec4899', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem'}}></div>
          <p style={{color: '#64748b'}}>Verifying access...</p>
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
        .table-container { background: white; border-radius: 15px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead { background: #fce7f3; }
        th { border: none; color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.5px; padding: 1rem; text-align: left; white-space: nowrap; }
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
        .modal-content { background: white; border-radius: 15px; max-width: 600px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; }
        .modal-header { background: linear-gradient(135deg, #ec4899, #a855f7); color: white; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
        .modal-body { padding: 1.5rem; overflow-y: auto; flex: 1; }
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
        @media (max-width: 768px) {
          .main-content { margin-left: 0; }
        }
      `}</style>

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
          <div className={`stat-card blue ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <p style={{color: '#64748b', marginBottom: '0.25rem'}}>Total Categories</p>
                <h2 style={{fontWeight: 'bold', margin: 0}}>{categories.length}</h2>
              </div>
              <div className="stat-icon blue">🏷️</div>
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
            {activeTab === 'categories' && (
              <button className="btn-gradient" onClick={handleAddCategory}>+ Add Category</button>
            )}
          </div>

          {activeTab === 'products' && (
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Sizes</th>
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
                    <td>{p.categoryName}</td>
                    <td style={{fontWeight: 'bold'}}>${p.price}</td>
                    <td>
                      {p.sizes && p.sizes.length > 0 
                        ? p.sizes.map(s => `${s.sizeValue} (${s.stock})`).join(', ')
                        : 'No sizes'
                      }
                    </td>
                    <td>
                      <button className="action-btn edit" onClick={() => handleEdit(p)}>✏️</button>
                      <button className="action-btn delete" onClick={() => handleDelete(p.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'users' && (
            users.length === 0 ? (
              <div style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>
                <p>⚠️ Unable to load users</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td style={{fontWeight: 600}}>{u.fullName || u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.phone|| 'N/A'}</td>
                      <td>
                        <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'primary' : 'info'}`}>
                          {u.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn edit" onClick={() => {
                          setUserFormData(u);
                          setModalMode('edit');
                          setModalType('user');
                          setShowModal(true);
                        }}>✏️</button>
                        <button className="action-btn delete" onClick={() => handleDeleteUser(u.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {activeTab === 'orders' && (
            orders.length === 0 ? (
              <div style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>
                <p>⚠️ No orders found</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Product</th>
                    <th>Size</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(o => (
                    <tr key={o.id}>
                      <td style={{fontWeight: 'bold'}}>#{o.id}</td>
                      <td>{o.fullName || o.user?.fullName || o.user?.username || 'N/A'}</td>
                      <td>{o.phone || o.user?.phone || 'N/A'}</td>
                      <td>{o.address || 'N/A'}</td>
                      <td>{o.product?.name || 'N/A'}</td>
                      <td>{o.size ? `${o.size.sizeValue}` : 'N/A'}</td>
                      <td>{o.quantity}</td>
                      <td style={{fontWeight: 'bold'}}>${(o.quantity * (o.product?.price || 0)).toFixed(2)}</td>
                      <td>{o.status}</td>
                      <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <button className="action-btn edit" onClick={() => handleEditOrder(o)}>✏️</button>
                        <button className="action-btn delete" onClick={() => handleDeleteOrder(o.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {activeTab === 'categories' && (
            categories.length === 0 ? (
              <div style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>
                <p>⚠️ No categories found</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Picture</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id}>
                      <td><strong>{cat.name}</strong></td>
                      <td>
                        <img src={cat.picUrl || 'https://via.placeholder.com/50'} alt={cat.name} className="product-img" />
                      </td>
                      <td>
                        <button className="action-btn edit" onClick={() => handleEditCategory(cat)}>✏️</button>
                        <button className="action-btn delete" onClick={() => handleDeleteCategory(cat.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>
                {modalType === 'product' 
                  ? (modalMode === 'add' ? 'Add New Product' : 'Edit Product')
                  : modalType === 'category'
                  ? (modalMode === 'add' ? 'Add New Category' : 'Edit Category')
                  : 'Edit Order'}
              </h5>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            {error && (
              <div style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: '0.75rem 1rem',
                borderRadius: '4px',
                margin: '1rem',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{
                background: '#dcfce7',
                color: '#16a34a',
                padding: '0.75rem 1rem',
                borderRadius: '4px',
                margin: '1rem',
                fontSize: '0.9rem'
              }}>
                {success}
              </div>
            )}
            <div className="modal-body">
              {modalType === 'product' ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Product Name</label>
                    <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-control" value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})}>
                      <option value="">Select a category...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price</label>
                    <input type="number" step="0.01" className="form-control" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sizes</label>
                    <div style={{marginBottom: '1rem'}}>
                      <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem'}}>
                        {['One Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(size => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              const exists = formData.sizes.find(s => s.sizeValue === size);
                              if (!exists) {
                                setFormData({...formData, sizes: [...formData.sizes, {sizeValue: size, stock: 5, color: ''}]});
                              } else {
                                setFormData({...formData, sizes: formData.sizes.filter(s => s.sizeValue !== size)});
                              }
                            }}
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              border: '2px solid',
                              background: formData.sizes.find(s => s.sizeValue === size) ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'white',
                              color: formData.sizes.find(s => s.sizeValue === size) ? 'white' : '#64748b',
                              borderColor: formData.sizes.find(s => s.sizeValue === size) ? '#ec4899' : '#e2e8f0',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              fontWeight: 500,
                              fontSize: '0.875rem'
                            }}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {formData.sizes && formData.sizes.length > 0 && (
                      <div style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '1rem',
                        background: '#f8fafc'
                      }}>
                        {formData.sizes.map((size, idx) => (
                          <div key={idx} style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr auto',
                            gap: '0.75rem',
                            marginBottom: idx < formData.sizes.length - 1 ? '1rem' : '0',
                            paddingBottom: idx < formData.sizes.length - 1 ? '1rem' : '0',
                            borderBottom: idx < formData.sizes.length - 1 ? '1px solid #e2e8f0' : 'none'
                          }}>
                            <div>
                              <label style={{fontSize: '0.75rem', color: '#64748b', fontWeight: 600}}>Size</label>
                              <input 
                                type="text" 
                                className="form-control"
                                value={size.sizeValue}
                                readOnly
                                style={{background: '#f1f5f9'}}
                              />
                            </div>
                            <div>
                              <label style={{fontSize: '0.75rem', color: '#64748b', fontWeight: 600}}>Stock</label>
                              <input 
                                type="number" 
                                min="0"
                                className="form-control"
                                value={size.stock || 0}
                                onChange={(e) => {
                                  const updatedSizes = [...formData.sizes];
                                  updatedSizes[idx].stock = parseInt(e.target.value) || 0;
                                  setFormData({...formData, sizes: updatedSizes});
                                }}
                              />
                            </div>
                            <div>
                              <label style={{fontSize: '0.75rem', color: '#64748b', fontWeight: 600}}>Color</label>
                              <input 
                                type="text" 
                                className="form-control"
                                placeholder="Optional"
                                value={size.color || ''}
                                onChange={(e) => {
                                  const updatedSizes = [...formData.sizes];
                                  updatedSizes[idx].color = e.target.value;
                                  setFormData({...formData, sizes: updatedSizes});
                                }}
                              />
                            </div>
                            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({...formData, sizes: formData.sizes.filter((_, i) => i !== idx)});
                                }}
                                style={{
                                  background: '#fee2e2',
                                  color: '#ef4444',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '0.5rem 0.75rem',
                                  cursor: 'pointer',
                                  fontWeight: 500,
                                  fontSize: '0.875rem'
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {formData.sizes.length === 0 && (
                      <p style={{color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem', fontStyle: 'italic'}}>
                        Click size buttons above to add sizes
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Image URL</label>
                    <input type="text" className="form-control" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
                  </div>
                </>
              ) : modalType === 'user' ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" value={userFormData.username} disabled style={{background: '#f1f5f9'}} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" value={userFormData.fullName} onChange={(e) => setUserFormData({...userFormData, fullName: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={userFormData.email} onChange={(e) => setUserFormData({...userFormData, email: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input type="text" className="form-control" value={userFormData.phone} onChange={(e) => setUserFormData({...userFormData, phone: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select className="form-control" value={userFormData.role} onChange={(e) => setUserFormData({...userFormData, role: e.target.value})}>
                      <option value="ROLE_USER">User</option>
                      <option value="ROLE_ADMIN">Admin</option>
                    </select>
                  </div>
                </>
              ) : modalType === 'category' ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Category Name</label>
                    <input type="text" className="form-control" value={categoryFormData.name} onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Picture URL</label>
                    <input type="text" className="form-control" value={categoryFormData.picUrl} onChange={(e) => setCategoryFormData({...categoryFormData, picUrl: e.target.value})} />
                  </div>
                  {categoryFormData.picUrl && (
                    <div style={{marginTop: '1rem', textAlign: 'center'}}>
                      <img src={categoryFormData.picUrl} alt="Category preview" style={{maxWidth: '100%', maxHeight: '200px', borderRadius: '8px'}} />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Quantity</label>
                    <input type="number" min="1" className="form-control" value={orderFormData.quantity} onChange={(e) => setOrderFormData({...orderFormData, quantity: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Size</label>
                    <select 
                      className="form-control" 
                      value={orderFormData.size?.id || ''} 
                      onChange={(e) => {
                        const selectedSizeId = e.target.value;
                        if (!selectedSizeId) {
                          setOrderFormData({...orderFormData, size: null});
                        } else {
                          const selectedProduct = products.find(p => p.id === orderFormData.productId);
                          const selectedSize = selectedProduct?.sizes?.find(s => s.id === parseInt(selectedSizeId));
                          setOrderFormData({...orderFormData, size: selectedSize || null});
                        }
                      }}
                    >
                      <option value="">No Size</option>
                      {orderFormData.productId && products.find(p => p.id === orderFormData.productId)?.sizes?.map(s => (
                        <option key={s.id} value={s.id}>{s.sizeValue} (Stock: {s.stock})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-control" value={orderFormData.status} onChange={(e) => setOrderFormData({...orderFormData, status: e.target.value})}>
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-control" value={orderFormData.fullName} onChange={(e) => setOrderFormData({ ...orderFormData, fullName: e.target.value })}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label> 
                    <input className="form-control" value={orderFormData.phone} onChange={(e) =>  setOrderFormData({ ...orderFormData, phone: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <textarea className="form-control" value={orderFormData.address} onChange={(e) => setOrderFormData({ ...orderFormData, address: e.target.value }) }/>
                  </div>
                </>
              )}
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
