import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="text-3xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
            ShopEasy
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-gray-600 hover:text-blue-600 font-semibold transition-colors">
              Discover Products
            </Link>
            <div className="flex items-center space-x-6 border-l pl-6 border-gray-200">
              <Link to="/cart" className="text-gray-600 hover:text-blue-600 relative group transition-colors">
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm border-2 border-white">
                  3
                </span>
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-blue-600 relative group">
                <div className="bg-gray-100 p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                  <User className="w-5 h-5" />
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
             <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-blue-600 focus:outline-none">
                {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="flex flex-col px-4 pt-2 pb-6 space-y-4">
            <Link to="/products" className="block px-3 py-3 text-base font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-lg">Products</Link>
            <Link to="/cart" className="block px-3 py-3 text-base font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-lg">Cart (3)</Link>
            <Link to="/profile" className="block px-3 py-3 text-base font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-lg">My Profile / Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
