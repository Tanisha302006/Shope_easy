import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../services/api';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';

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
    <div className="container mx-auto px-4 max-w-6xl mt-4 pb-16">
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-10 mb-16 relative">
        {/* Wishlist Floating Button */}
        <button onClick={toggleWishlist} className={`absolute top-8 right-8 z-20 p-3 rounded-full shadow-md transition-all ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white text-slate-400 hover:text-red-500 hover:bg-slate-50 border border-slate-100'}`}>
           <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500' : ''}`} />
        </button>

        <div className="w-full md:w-1/2 bg-slate-50 rounded-2xl h-80 md:h-[500px] flex items-center justify-center overflow-hidden">
          <img src={product.image || 'https://via.placeholder.com/600'} alt={product.name} className="w-full h-full object-contain mix-blend-multiply p-8" />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <span className="text-sm text-blue-600 font-bold mb-2 uppercase tracking-widest">{product.category}</span>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">{product.name}</h1>
          <div className="flex items-center gap-2 mb-6">
             <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
             <span className="font-bold text-slate-700">{product.rating || 5.0}</span>
             <span className="text-slate-400 text-sm ml-2 underline cursor-pointer hover:text-blue-600">See all reviews</span>
          </div>
          <p className="text-4xl font-black text-slate-900 mb-6">${product.price}</p>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">{product.description}</p>

          <div className="flex items-center gap-4 mt-auto">
            <select value={qty} onChange={(e) => setQty(e.target.value)} disabled={product.stock === 0} className="border-slate-200 border-2 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 w-24 bg-white text-lg font-bold">
              {[...Array(product.stock > 0 ? product.stock : 1).keys()].map(x => ( <option key={x + 1} value={x + 1}>{x + 1}</option> ))}
            </select>
            <button onClick={addToCartHandler} disabled={product.stock === 0 || addingToCart} className="flex-grow bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg shadow-blue-600/30 disabled:bg-slate-300">
              <ShoppingCart className="w-5 h-5" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* Bonus Features: Reviews & Related */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Reviews Sidebar */}
         <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 h-fit">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2"><MessageSquare className="w-6 h-6 text-blue-600"/> Customer Reviews</h3>
            
            {/* Mock Review form */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 shadow-sm">
               <div className="flex gap-1 mb-2">
                 {[1,2,3,4,5].map(i=><Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 cursor-pointer hover:scale-110"/>)}
               </div>
               <textarea className="w-full text-sm bg-slate-50 border-0 rounded-lg p-3 resize-none focus:ring-2 mt-2" placeholder="Write your review here..."></textarea>
               <button className="bg-slate-900 text-white w-full py-2 rounded-lg text-sm font-bold mt-2 hover:bg-blue-600 transition-colors">Submit Review</button>
            </div>

            {/* Mock static review */}
            <div className="border-b border-slate-200 pb-4 mb-4">
               <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-slate-800">Jane Smith</span>
                  <div className="flex"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><Star className="w-3 h-3 text-slate-300" /></div>
               </div>
               <p className="text-slate-600 text-sm">Absolutely fantastic product! Exceeded my expectations. Will buy again.</p>
            </div>
         </div>

         {/* Related Products Grid */}
         <div className="col-span-1 lg:col-span-2">
            <h3 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">You might also like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedProducts.length > 0 ? relatedProducts.map(rp => (
                   <ProductCard key={rp._id} product={rp} />
                )) : <p className="text-slate-500 col-span-2">No related configurations found.</p>}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProductDetails;
