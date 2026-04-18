import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../services/api';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';

import { formatPrice } from '../utils/format';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Get primary product
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        
        // Wishlist sync check
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setIsWishlisted(storedWishlist.includes(data._id));

        // Bonus: Get Related Products (mocking by fetching all and filtering by category)
        const { data: allProducts } = await API.get(`/products?category=${data.category}`);
        setRelatedProducts(allProducts.filter(p => p._id !== data._id).slice(0,4));

      } catch (error) {
        toast.error('Failed to load product details');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const addToCartHandler = async () => {
    if (!localStorage.getItem('userInfo')) {
      toast.error('Please login to add items to the cart');
      return navigate('/login');
    }
    try {
      setAddingToCart(true);
      await API.post('/cart', { productId: product._id, quantity: qty });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleWishlist = () => {
    let storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (storedWishlist.includes(product._id)) {
      storedWishlist = storedWishlist.filter(item => item !== product._id);
      toast('Removed from Wishlist', { icon: '💔' });
    } else {
      storedWishlist.push(product._id);
      toast('Added to Wishlist!', { icon: '❤️' });
    }
    localStorage.setItem('wishlist', JSON.stringify(storedWishlist));
    setIsWishlisted(!isWishlisted);
  };

  if (loading) return <Loader className="mt-20" />;
  if (!product) return null;

  return (
    <div className="w-full min-h-screen bg-white">
      {/* 🛡️ Flagship Product Section */}
      <section className="pt-24 pb-20 px-6 mesh-gradient overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            {/* Immersive Image Display */}
            <div className="w-full lg:w-1/2 relative group animate-fade-in-up">
              <div className="relative aspect-square bg-white rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-white/50 flex items-center justify-center p-12 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-100 rounded-full blur-[80px] opacity-50"></div>
                
                <img 
                  src={product.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&q=80'} 
                  alt={product.name} 
                  className="w-full h-full object-contain mix-blend-multiply z-10 transition-transform duration-700 group-hover:scale-105" 
                />

                {/* Wishlist Toggle */}
                <button 
                  onClick={toggleWishlist} 
                  className={`absolute top-10 right-10 z-20 p-4 rounded-full shadow-xl transition-all hover:scale-110 active:scale-90 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-slate-400 hover:text-red-500'}`}
                >
                  <Heart className={`w-7 h-7 ${isWishlisted ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>

            {/* Premium Info Panel */}
            <div className="w-full lg:w-1/2 flex flex-col animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-md">
                  {product.category}
                </span>
                <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-amber-700">{product.rating || '5.0'}</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9]">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mb-8">
                <p className="text-5xl font-black text-slate-900 tracking-tighter">{formatPrice(product.price)}</p>
                {product.stock > 0 && (
                  <span className="text-emerald-600 text-sm font-bold flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> {product.stock} in stock
                  </span>
                )}
              </div>

              <p className="text-xl text-slate-500 font-medium leading-[1.6] mb-10 max-w-xl">
                {product.description || 'Elevate your daily experience with our flagship design. Engineered for perfection, crafted for the modern individual.'}
              </p>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto">
                <div className="flex items-center bg-slate-100 rounded-2xl p-1 w-full sm:w-fit border border-slate-200">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-12 h-12 flex items-center justify-center text-xl font-bold hover:bg-white rounded-xl transition-colors"
                  >-</button>
                  <span className="px-6 text-lg font-black w-14 text-center">{qty}</span>
                  <button 
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-12 h-12 flex items-center justify-center text-xl font-bold hover:bg-white rounded-xl transition-colors"
                  >+</button>
                </div>

                <button 
                  onClick={addToCartHandler} 
                  disabled={product.stock === 0 || addingToCart} 
                  className="w-full sm:flex-1 bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:-translate-y-1 active:scale-95 disabled:bg-slate-200"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {product.stock === 0 ? 'Notify Me' : 'Add to Bag'}
                </button>
              </div>
              
              <p className="mt-8 text-xs text-slate-400 font-medium flex items-center gap-4">
                <span>✓ Premium Shipping included</span>
                <span>✓ 2-Year Warranty</span>
                <span>✓ 30-Day Returns</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🎭 Experience & Upsell */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            
            {/* Reviews Column */}
            <div className="lg:col-span-1">
              <h3 className="text-3xl font-black text-slate-900 mb-10 tracking-tight flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-blue-600" /> Reviews
              </h3>
              
              <div className="space-y-8">
                {[
                  { name: 'Alex Rivera', comment: 'The build quality is simply stunning. It feels like a piece of art.', rating: 5 },
                  { name: 'Jordan Hayes', comment: 'Exactly what I was looking for. The interface is intuitive and fast.', rating: 4 }
                ].map((rev, i) => (
                  <div key={i} className="pb-8 border-b border-slate-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-slate-900">{rev.name}</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className={`w-3.5 h-3.5 ${j < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed">{rev.comment}</p>
                  </div>
                ))}

                <button className="w-full py-4 rounded-xl border-2 border-slate-100 font-bold text-slate-900 hover:border-slate-900 transition-colors">
                  Read all 124 reviews
                </button>
              </div>
            </div>

            {/* Related Grid */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">You may also like.</h3>
                <Link to="/products" className="text-blue-600 font-bold hover:underline">See all Store</Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {relatedProducts.length > 0 ? relatedProducts.map(rp => (
                   <ProductCard key={rp._id} product={rp} />
                )) : (
                  <div className="col-span-2 py-12 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center">
                    <p className="text-slate-400 font-bold italic tracking-tight">Preparing related collections...</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
