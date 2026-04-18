import { useState, useEffect } from 'react';
import { 
  ShoppingBag, ChevronDown, Eye, MapPin, Package,
  Truck, CheckCircle, XCircle, Clock, Filter
} from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

import { formatPrice } from '../../utils/format';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/admin/orders');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const statusOptions = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const filterOptions = ['All', ...statusOptions];

  const filteredOrders = filterStatus === 'All' 
    ? orders 
    : orders.filter(o => o.orderStatus === filterStatus);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing': return <Clock className="w-3.5 h-3.5" />;
      case 'Shipped': return <Truck className="w-3.5 h-3.5" />;
      case 'Delivered': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'Cancelled': return <XCircle className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Processing': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Shipped': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Orders</h1>
          <p className="text-slate-500 mt-1 font-medium">{orders.length} total orders</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5 mb-6 flex gap-1 overflow-x-auto">
        {filterOptions.map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              filterStatus === status
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {status}
            {status !== 'All' && (
              <span className={`ml-1.5 text-xs ${filterStatus === status ? 'text-slate-400' : 'text-slate-400'}`}>
                ({orders.filter(o => o.orderStatus === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
              {/* Order Header Row */}
              <div 
                className="px-6 py-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 cursor-pointer"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-sm">Order #{order._id}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{order.customerName} · {order.customerEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 flex-wrap">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Date</p>
                    <p className="text-sm font-semibold text-slate-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 font-medium">Amount</p>
                    <p className="text-sm font-bold text-slate-900">{formatPrice(order.totalAmount)}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 font-medium">Items</p>
                    <p className="text-sm font-semibold text-slate-700">{order.items?.length || 0}</p>
                  </div>

                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${getStatusStyle(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus}
                  </span>

                  {/* Status Dropdown */}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                    >
                      {statusOptions.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${expandedOrder === order._id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order._id && (
                <div className="px-6 pb-6 border-t border-slate-100 pt-5 animate-in">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4" /> Items Ordered
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                            <div>
                              <p className="font-semibold text-sm text-slate-800">{item.name}</p>
                              <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-sm text-slate-700">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Shipping Address
                      </h4>
                      <div className="bg-slate-50 rounded-xl px-5 py-4 border border-slate-100">
                        {order.shippingAddress && Object.keys(order.shippingAddress).length > 0 ? (
                          <div className="space-y-1 text-sm text-slate-600">
                            {order.shippingAddress.address && <p>{order.shippingAddress.address}</p>}
                            {order.shippingAddress.city && <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode || ''}</p>}
                            {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-400 italic">No shipping address provided</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-16 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500 font-medium">No orders found</p>
            <p className="text-sm text-slate-400 mt-1">
              {filterStatus !== 'All' ? `No "${filterStatus}" orders to display` : 'Orders will appear here once customers make purchases'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
