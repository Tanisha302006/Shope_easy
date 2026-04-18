import { useState, useEffect } from 'react';
import { 
  DollarSign, ShoppingBag, Package, Users, TrendingUp, 
  AlertTriangle, ArrowUpRight, Clock
} from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { CURRENCY, formatPrice } from '../../utils/format';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Total Revenue', 
      value: `${CURRENCY}${stats?.totalRevenue?.toLocaleString('en-IN') || '0'}`, 
      icon: DollarSign, 
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      change: '+12.5%'
    },
    { 
      label: 'Total Orders', 
      value: stats?.totalOrders || 0, 
      icon: ShoppingBag, 
      color: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-700',
      change: '+8.2%'
    },
    { 
      label: 'Products', 
      value: stats?.totalProducts || 0, 
      icon: Package, 
      color: 'from-violet-500 to-purple-600',
      bgLight: 'bg-violet-50',
      textColor: 'text-violet-700',
      change: '+3'
    },
    { 
      label: 'Customers', 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      color: 'from-amber-500 to-orange-600', 
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-700',
      change: '+24'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-1 font-medium">Welcome back. Here's your store overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {statCards.map(({ label, value, icon: Icon, color, bgLight, textColor, change }) => (
          <div key={label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-bold ${textColor} ${bgLight} px-2.5 py-1 rounded-full`}>
                <TrendingUp className="w-3 h-3" />
                {change}
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
            <p className="text-sm text-slate-500 font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
              <p className="text-sm text-slate-500">Latest transactions on your store</p>
            </div>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats?.recentOrders?.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{order.customerName}</p>
                          <p className="text-xs text-slate-400">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">{formatPrice(order.totalAmount)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                      <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                      <p className="font-medium">No orders yet</p>
                      <p className="text-sm mt-1">Orders will appear here once customers start purchasing.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Order Status + Low Stock */}
        <div className="space-y-6">
          {/* Order Status Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Order Status</h2>
            <div className="space-y-4">
              {[
                { label: 'Processing', count: stats?.ordersByStatus?.processing || 0, color: 'bg-amber-500' },
                { label: 'Shipped', count: stats?.ordersByStatus?.shipped || 0, color: 'bg-blue-500' },
                { label: 'Delivered', count: stats?.ordersByStatus?.delivered || 0, color: 'bg-emerald-500' },
                { label: 'Cancelled', count: stats?.ordersByStatus?.cancelled || 0, color: 'bg-red-500' },
              ].map(({ label, count, color }) => {
                const total = stats?.totalOrders || 1;
                const pct = Math.round((count / total) * 100) || 0;
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700">{label}</span>
                      <span className="text-sm font-bold text-slate-900">{count}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Low Stock Alert</h2>
                <p className="text-sm text-slate-500">Products with less than 5 items</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-red-50/50 rounded-xl px-5 py-4 border border-red-100">
              <span className="text-sm font-medium text-red-700">Products running low</span>
              <span className="text-2xl font-bold text-red-600">{stats?.lowStockCount || 0}</span>
            </div>
          </div>

          {/* Quick Stat */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium text-slate-300">Average Order</span>
            </div>
            <p className="text-3xl font-bold">
              {stats?.totalOrders > 0 ? formatPrice(stats.totalRevenue / stats.totalOrders) : formatPrice(0)}
            </p>
            <p className="text-sm text-slate-400 mt-1">per transaction</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
