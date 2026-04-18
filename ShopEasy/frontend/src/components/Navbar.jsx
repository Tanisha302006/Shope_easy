import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      setUserInfo(JSON.parse(stored));
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'}`}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className={`flex justify-between items-center px-8 h-16 rounded-2xl transition-all duration-500 border ${scrolled ? 'bg-white/80 backdrop-blur-2xl border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.05)]' : 'bg-transparent border-transparent'}`}>
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-black tracking-tighter text-slate-900 group">
            Shop<span className="text-blue-600 transition-colors duration-300">Easy.</span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {['Store', 'Electronics', 'Fashion', 'Gaming'].map((item) => (
              <Link 
                key={item}
                to={item === 'Store' ? '/products' : `/products?category=${item}`} 
                className="text-[13px] font-bold text-slate-600 hover:text-blue-600 transition-all tracking-wide uppercase"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-5">
            <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all"><Search className="w-4 h-4" rotate-3/></button>
            
            {userInfo?.isAdmin && (
              <Link to="/admin" className="flex items-center gap-2 text-xs font-black text-white bg-slate-900 px-4 py-2 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10">
                <Shield className="w-3 h-3" /> ADMIN
              </Link>
            )}
            
            <Link to="/login" className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all"><User className="w-5 h-5" /></Link>
            <Link to="/cart" className="group relative p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-lg border-2 border-white">
                0
              </span>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
             <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-900">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[88px] z-40 bg-white/95 backdrop-blur-3xl p-8 animate-fade-in-up">
          <div className="flex flex-col space-y-6">
            {['Store', 'Electronics', 'Fashion', 'Gaming', 'Bag', 'Account'].map((item) => (
              <Link 
                key={item}
                to={item === 'Store' ? '/products' : item === 'Bag' ? '/cart' : item === 'Account' ? '/login' : `/products?category=${item}`} 
                className="text-4xl font-black text-slate-900 tracking-tighter hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
