import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import API from '../services/api';

const CATEGORIES = [
  'All',
  'Electronics',
  'Smartphones',
  'Audio',
  'Fashion',
  'Gaming',
  'Luxury',
  'Fitness',
  'Smart Home'
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';
  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (currentCategory !== 'All') params.category = currentCategory;
        if (keyword) params.keyword = keyword;
        
        const { data } = await API.get('/products', { params });
        setProducts(data);
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentCategory, keyword]);

  const handleCategoryChange = (category) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* 🏙️ Store Header */}
      <section className="pt-24 pb-16 px-6 mesh-gradient border-b border-slate-100">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-12 animate-fade-in-up">
            <div className="flex-shrink-0">
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-2">
                The <span className="text-blue-600">Store.</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium tracking-tight">
                {keyword 
                  ? `Showing results for "${keyword}"` 
                  : 'Absolute best in modern innovation.'
                }
              </p>
            </div>
            
            <div className="w-full max-w-xl">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-7xl pb-32 pt-12">
        {/* ✨ Category Navigation */}
        <div className="flex items-center gap-3 overflow-x-auto pb-8 no-scrollbar animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all duration-500 border ${
                currentCategory === cat
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20 scale-105'
                  : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:text-slate-900 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 🛍️ Product Grid */}
        {loading ? (
          <div className="py-20 flex justify-center"><Loader /></div>
        ) : products.length === 0 ? (
          <div className="py-20"><EmptyState message={`We're currently refilling the ${currentCategory} shelves.`} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
