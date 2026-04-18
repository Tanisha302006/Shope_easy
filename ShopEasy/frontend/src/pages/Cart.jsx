import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

import { formatPrice } from '../utils/format';

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const { data } = await API.get('/cart');
      setCart(data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login to view cart');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [navigate]);

  const removeFromCart = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`);
      toast.success('Item removed');
      fetchCart(); // Refresh cart UI
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const updateQuantity = async (productId, currentQuantity, newQuantity) => {
      try {
        await API.put(`/cart/${productId}`, { quantity: newQuantity });
        fetchCart();
      } catch (error) {
        toast.error('Unable to update quantity');
      }
  };

  if (loading) return <Loader className="mt-20" />;

  const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.items.reduce((acc, item) => acc + (item.quantity * (item.product?.price || 0)), 0);

  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-slate-900 tracking-tight">Shopping Cart</h1>
      
      {cart.items.length === 0 ? (
        <EmptyState 
          message="Your shopping cart is completely empty." 
          actionLink="/products" 
          actionText="Discover our products" 
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="space-y-6">
              {cart.items.map((item) => (
                <div key={item._id} className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                  <img src={item.product?.image || 'https://via.placeholder.com/150'} alt={item.product?.name} className="w-24 h-24 object-cover rounded-xl bg-slate-50" />
                  
                  <div className="flex-grow text-center sm:text-left">
                     <Link to={`/product/${item.product?._id}`} className="text-lg font-semibold text-slate-800 hover:text-blue-600">
                       {item.product?.name}
                     </Link>
                     <p className="text-slate-500 mt-1">{formatPrice(item.product?.price)}</p>
                  </div>

                  <div className="flex items-center gap-4">
                     <select 
                       value={item.quantity}
                       onChange={(e) => updateQuantity(item.product._id, item.quantity, e.target.value)}
                       className="border-slate-200 border rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 min-w-[70px]"
                     >
                        {[...Array(10).keys()].map(x => (
                           <option key={x+1} value={x+1}>{x+1}</option>
                        ))}
                     </select>
                     
                     <button onClick={() => removeFromCart(item.product._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/3">
             <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl sticky top-24">
                <h3 className="text-xl font-bold mb-4 border-b border-slate-700 pb-4">Order Summary</h3>
                <div className="flex justify-between mb-3 text-slate-300">
                   <span>Items ({totalItems})</span>
                   <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between mb-6 text-slate-300">
                   <span>Shipping</span>
                   <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between items-center mb-6 pt-4 border-t border-slate-700">
                   <span className="font-semibold text-lg">Total</span>
                   <span className="font-bold text-2xl">{formatPrice(totalPrice)}</span>
                </div>
                <Link to="/checkout" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex justify-center items-center transition-colors shadow-lg">
                   Proceed to Checkout
                </Link>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
