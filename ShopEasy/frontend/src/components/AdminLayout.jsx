import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, 
  LogOut, ChevronLeft, Store, Shield
} from 'lucide-react';
import { useState, useEffect } from 'react';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
      return;
    }
    const parsed = JSON.parse(userInfo);
    if (!parsed.isAdmin) {
      navigate('/');
      return;
    }
    setUser(parsed);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/admin/users', icon: Users, label: 'Users' },
  ];

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-20' : 'w-72'} bg-slate-950 text-white flex flex-col transition-all duration-300 ease-in-out relative`}>
        
        {/* Logo Area */}
        <div className="px-6 py-7 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="text-lg font-bold tracking-tight">ShopEasy</h1>
                <p className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">Admin Console</p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse Toggle */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors z-50"
        >
          <ChevronLeft className={`w-3 h-3 text-slate-300 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `
                flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-white shadow-sm border border-blue-500/10' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }
                ${collapsed ? 'justify-center px-0' : ''}
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 pb-6 space-y-2">
          <NavLink
            to="/"
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            <Store className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Back to Store</span>}
          </NavLink>
          
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full ${collapsed ? 'justify-center px-0' : ''}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>

          {/* User Badge */}
          {!collapsed && (
            <div className="mt-4 mx-1 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Signed in as</p>
              <p className="text-sm font-semibold text-white truncate mt-0.5">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
