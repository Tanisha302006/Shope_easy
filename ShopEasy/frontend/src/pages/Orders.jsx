import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/myorders');
        setOrders(data);
      } catch (error) {
        toast.error('Failed to grab order history');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader className="mt-20" />;

  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Your Order History</h1>
      
      {orders.length === 0 ? (
        <EmptyState 
          message="You haven't placed any orders yet." 
          actionLink="/products" 
          actionText="Browse Catalog" 
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-slate-100 pb-4 mb-4 gap-4">
                <div>
                   <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Order ID</p>
                   <p className="font-mono text-slate-800">{order._id}</p>
                </div>
                <div>
                   <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Date</p>
                   <p className="text-slate-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                   <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Status</p>
                   <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                      {order.orderStatus}
                   </span>
                </div>
                <div>
                   <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Total Price</p>
                   <p className="text-xl font-bold text-slate-900">${order.totalAmount}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="font-semibold text-slate-700 flex items-center gap-2">
                   <PackageOpen className="w-5 h-5" /> Packaged Items
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 p-3 bg-slate-50 rounded-xl">
                      <div className="flex-grow">
                          <Link to={`/product/${item.product}`} className="font-medium text-slate-800 hover:text-blue-600">
                            {item.name}
                          </Link>
                          <p className="text-sm text-slate-500">Qty: {item.quantity} × ${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
