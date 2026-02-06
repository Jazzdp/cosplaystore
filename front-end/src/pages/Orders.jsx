import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { authenticatedApi } from '../Util/AxiosConfig';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    const load = async () => {
      try {
        // Use /api/orders/me for authenticated users to fetch only their own orders
        const { data } = await authenticatedApi.get('/api/orders/me');
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
              <style>{`
                @media (max-width: 768px) {
                  table { font-size: 0.875rem; }
                  th, td { padding: 12px 4px !important; }
                  th { font-size: 0.7rem; }
                }
              `}</style>
              <table className="w-full border-collapse">
                <thead className="bg-gradient-to-r from-pink-100 to-pink-50 border-b-2 border-pink-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-pink-900 uppercase tracking-widest">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-pink-900 uppercase tracking-widest">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-pink-900 uppercase tracking-widest">Qty</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-pink-900 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-pink-900 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100">
                  {orders.map((o, idx) => (
                    <tr key={o.id} className={`transition-all duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-pink-50'} hover:bg-pink-100`}>
                      <td className="px-6 py-4 font-bold text-pink-600">#{o.id}</td>
                      <td className="px-6 py-4 text-gray-800 font-medium">{o.product?.name || `Product #${o.product?.id}`}</td>
                      <td className="px-6 py-4 text-gray-700 font-semibold text-center">{o.quantity}</td>
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold inline-block"
                          style={getStatusStyle(o.status)}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{new Date(o.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</td>
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
