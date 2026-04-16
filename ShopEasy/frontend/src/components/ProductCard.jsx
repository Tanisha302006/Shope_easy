import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  // Safe defaults
  const rating = product.rating || 0;
  const inStock = product.stock > 0;

  return (
    <div className="group flex flex-col bg-white rounded-3xl shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 hover:-translate-y-2 relative h-full">
      
      {/* Image Block & Badges */}
      <div className="relative h-60 w-full overflow-hidden bg-gray-50 flex items-center justify-center p-4">
        {/* Stock status badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg shadow-sm backdrop-blur-md ${inStock ? 'bg-white/80 text-emerald-700' : 'bg-red-500/90 text-white'}`}>
            {inStock ? 'In Stock' : 'Sold Out'}
          </span>
        </div>
        
        {/* Category tag */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-2 py-1 bg-slate-900/10 backdrop-blur-md text-slate-800 text-[10px] uppercase font-bold rounded-md">
            {product.category || 'Item'}
          </span>
        </div>

        <img 
          src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'} 
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />

        {/* Quick add overlay */}
        <div className="absolute -bottom-16 w-full px-4 group-hover:bottom-4 transition-all duration-300 z-20">
           <button disabled={!inStock} className="w-full bg-slate-900/90 backdrop-blur-sm text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-lg active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed">
              <ShoppingCart className="w-4 h-4" /> Quick Add
           </button>
        </div>
      </div>

      {/* Details Box */}
      <div className="p-6 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`} className="block flex-grow focus:outline-none">
           <h3 className="text-xl font-extrabold text-slate-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors duration-200">
             {product.name}
           </h3>
           <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed font-medium">
             {product.description}
           </p>
        </Link>
        
        <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            {/* Mock Rating Component */}
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-slate-700">{rating.toFixed(1)}</span>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
