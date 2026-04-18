import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../services/api';
import { formatPrice } from '../utils/format';

const ProductCard = ({ product }) => {
  const inStock = product.stock > 0;
  
  const quickAddToCart = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem('userInfo')) {
      toast.error('Please sign in to access your Bag.');
      return;
    }
    try {
      await API.post('/cart', { productId: product._id, quantity: 1 });
      toast.success(`${product.name} added to Bag!`);
    } catch (error) {
      toast.error('Error adding ' + product.name);
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden transition-all duration-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] hover:-translate-y-3 relative h-[500px]">
      
      {/* Immersive Image Display */}
      <Link to={`/product/${product._id}`} className="relative h-64 w-full flex items-center justify-center p-10 bg-gradient-to-b from-slate-50/50 to-white overflow-hidden">
        {/* Modern Out of Stock Overlay */}
        {!inStock && (
           <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
             <span className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
               Sold Out
             </span>
           </div>
        )}
        
        {/* Subtle decorative circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <img 
          src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'} 
          alt={product.name}
          className="max-h-full object-contain mix-blend-multiply z-10 scale-95 group-hover:scale-105 transition-transform duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)"
        />
      </Link>

      {/* Elegant Details Box */}
      <div className="p-8 flex flex-col flex-grow bg-white">
        <div className="flex justify-between items-center mb-4">
           <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] px-2 py-1 bg-blue-50 rounded-md">
             {product.category}
           </span>
           <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold text-slate-700">{product.rating || '5.0'}</span>
           </div>
        </div>
        
        <Link to={`/product/${product._id}`}>
           <h3 className="text-xl font-bold text-slate-900 leading-[1.2] mb-3 tracking-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
             {product.name}
           </h3>
        </Link>
        
        <p className="text-sm text-slate-400 font-medium line-clamp-2 mb-6">
          {product.description || 'Experience cutting-edge design and unparalleled performance.'}
        </p>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <p className="text-2xl font-black text-slate-900 tracking-tighter">
            {formatPrice(product.price)}
          </p>
          
          <button 
             onClick={quickAddToCart}
             disabled={!inStock} 
             className="bg-slate-900 hover:bg-black text-white p-3.5 rounded-2xl transition-all duration-300 active:scale-90 disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed group/btn shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20"
          >
             <ShoppingBag className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
