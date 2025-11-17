import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWithAuth = (url) => {
    const jwt = localStorage.getItem('jwt');
    return fetch(url, { headers: jwt ? { Authorization: `Bearer ${jwt}` } : {} });
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    const load = async () => {
      try {
        // Use /orders/me for authenticated users to fetch only their own orders
        const res = await fetchWithAuth('http://localhost:8080/orders/me');
        if (!res.ok) throw new Error(`Failed to load orders (${res.status})`);
        const data = await res.json();
        if (!mounted) return;
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Orders load error', err);
        setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const backButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'linear-gradient(to right, #ec4899, #f43f5e)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    boxShadow: '0 4px 6px rgba(236, 72, 153, 0.3)',
    transition: 'all 0.2s'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-fuchsia-50">
      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            style={backButtonStyle}
            onClick={() => navigate(-1)}
            onMouseEnter={(e) => e.target.style.boxShadow = '0 6px 12px rgba(236, 72, 153, 0.4)'}
            onMouseLeave={(e) => e.target.style.boxShadow = '0 4px 6px rgba(236, 72, 153, 0.3)'}
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h2 className="text-3xl font-bold text-gray-800">My Orders</h2>
          <div style={{ width: '80px' }}></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-6">
          {loading && <div className="text-center py-8 text-gray-500">Loading orders…</div>}
          {error && <div className="text-center py-8 text-red-600">{error}</div>}
          {!loading && !error && orders.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              No orders found.
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-pink-50 border-b border-pink-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Qty</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date Placed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-pink-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-800">#{o.id}</td>
                      <td className="px-6 py-4 text-gray-700">{o.product?.name || `Product #${o.product?.id}`}</td>
                      <td className="px-6 py-4 text-gray-700">{o.quantity}</td>
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={getStatusStyle(o.status)}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusStyle(status) {
  const statusMap = {
    'Pending': { backgroundColor: '#fef3c7', color: '#92400e' },
    'Processing': { backgroundColor: '#dbeafe', color: '#0c2340' },
    'Shipped': { backgroundColor: '#bfdbfe', color: '#0c2340' },
    'Delivered': { backgroundColor: '#dcfce7', color: '#166534' },
    'Cancelled': { backgroundColor: '#fee2e2', color: '#991b1b' }
  };
  return statusMap[status] || { backgroundColor: '#f3f4f6', color: '#6b7280' };
}
