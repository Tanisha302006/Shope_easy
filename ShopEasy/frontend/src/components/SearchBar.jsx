import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${keyword.trim()}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <form onSubmit={submitHandler} className="relative max-w-md w-full group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
      </div>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="block w-full pl-12 pr-14 py-4 bg-white border border-slate-200 rounded-2xl leading-5 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 sm:text-sm transition-all duration-300 shadow-sm"
        placeholder="Find your next favorite item..."
      />
      <button 
        type="submit"
        className="absolute inset-y-2 right-2 px-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center group/btn"
      >
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </form>
  );
};

export default SearchBar;
