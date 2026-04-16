import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import API from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch logic directly executing on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/products');
        setProducts(data);
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Explore Products
        </h1>
        <SearchBar />
      </div>

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <EmptyState message="No products found in the catalog right now." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
