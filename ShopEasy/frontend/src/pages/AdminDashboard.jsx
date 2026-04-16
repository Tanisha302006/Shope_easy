import { useState, useEffect } from 'react';
import { Package, Trash2, Edit, PlusCircle } from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products');
        setProducts(data);
      } catch (error) {
        toast.error('Failed to load inventory');
      }
    };
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
        toast.success('Product deleted internally');
      } catch (error) {
        toast.error('Error deleting product');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
           <Package className="w-8 h-8 text-blue-600" /> Executive Dashboard
        </h1>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg">
          <PlusCircle className="w-5 h-5"/> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Product Details</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Category</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Price</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Stock</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                     <img src={product.image || 'https://via.placeholder.com/50'} className="w-12 h-12 object-cover rounded-lg bg-slate-100" />
                     <span className="font-semibold text-slate-800">{product.name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{product.category}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">${product.price}</td>
                  <td className="px-6 py-4">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock > 0 ? product.stock : 'Empty'}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-5 h-5"/></button>
                    <button onClick={() => deleteHandler(product._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
