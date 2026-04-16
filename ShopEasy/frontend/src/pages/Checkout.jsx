import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Tag, CheckCircle2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: '', city: '', state: '', postalCode: '', country: '' });
  const [payment, setPayment] = useState({ cardName: '', cardNumber: '', expiry: '', cvc: '' });
  const [coupon, setCoupon] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = () => {
    if(coupon.toUpperCase() === 'INTERN20') {
      setDiscountApplied(true);
      toast.success('Awesome! 20% Discount Applied.');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post('/orders', { shippingAddress: address });
      toast.success('Payment authorized. Order confirmed!', { icon: '🎉' });
      navigate('/orders');
    } catch (error) {
       toast.error(error.response?.data?.message || 'Invalid details');
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl flex flex-col lg:flex-row gap-8">
       <div className="lg:w-2/3 space-y-6">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Secure Checkout</h1>
          
          <form id="checkout-form" onSubmit={submitHandler} className="space-y-6">
            {/* Shipping Box */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
               <h3 className="text-xl font-bold mb-6 border-b border-slate-100 pb-3 text-slate-800">1. Shipping Address</h3>
               <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                    <input required type="text" onChange={(e) => setAddress({...address, street: e.target.value})} className="w-full border rounded-xl px-4 py-3 bg-slate-50/50" placeholder="123 ShopEasy Blvd" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                      <input required type="text" onChange={(e) => setAddress({...address, city: e.target.value})} className="w-full border rounded-xl px-4 py-3 bg-slate-50/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                      <input required type="text" onChange={(e) => setAddress({...address, state: e.target.value})} className="w-full border rounded-xl px-4 py-3 bg-slate-50/50" />
                    </div>
                  </div>
               </div>
            </div>

            {/* Mock Payment Box */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 bg-emerald-50 rounded-bl-3xl text-emerald-600 flex items-center gap-2 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5"/> Secured
               </div>
               <h3 className="text-xl font-bold mb-6 border-b border-slate-100 pb-3 text-slate-800 flex items-center gap-2">
                 2. Payment Details
               </h3>
               
               <div className="bg-slate-900 text-white rounded-xl p-6 mb-6 shadow-xl relative overflow-hidden">
                  <CreditCard className="absolute -right-6 -top-6 w-32 h-32 opacity-10 text-white" />
                  <div className="mb-6"><span className="text-xl font-bold tracking-widest italic opacity-80">SHPEZY</span></div>
                  <input required placeholder="0000 0000 0000 0000" className="w-full bg-transparent text-2xl font-mono tracking-widest outline-none mb-4 placeholder-slate-500" maxLength="19" onChange={(e)=>setPayment({...payment, cardNumber: e.target.value})} />
                  <div className="flex justify-between">
                     <input required placeholder="Name on Card" className="bg-transparent outline-none uppercase font-semibold text-sm placeholder-slate-500 w-1/2" onChange={(e)=>setPayment({...payment, cardName: e.target.value})} />
                     <div className="flex gap-4">
                       <input required placeholder="MM/YY" className="bg-transparent outline-none w-16 text-sm placeholder-slate-500 font-mono" maxLength="5" />
                       <input required placeholder="CVC" className="bg-transparent outline-none w-12 text-sm placeholder-slate-500 font-mono" maxLength="3" />
                     </div>
                  </div>
               </div>
            </div>
          </form>
       </div>

       {/* Right Summary Column */}
       <div className="lg:w-1/3">
          <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 sticky top-24">
             <h3 className="text-xl font-bold mb-6 text-slate-900">Order Summary</h3>
             
             {/* Coupon Field */}
             <div className="mb-6 relative">
                 <label className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2"><Tag className="w-4 h-4"/> Have a coupon?</label>
                 <div className="flex gap-2">
                    <input type="text" placeholder="Hint: INTERN20" onChange={(e)=>setCoupon(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm font-bold uppercase disabled:bg-slate-200" disabled={discountApplied} />
                    <button type="button" onClick={handleApplyCoupon} disabled={discountApplied} className="bg-slate-900 text-white px-4 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50">Apply</button>
                 </div>
                 {discountApplied && <p className="text-emerald-600 text-xs font-bold mt-2 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> -20% Applied</p>}
             </div>
             
             <div className="border-t border-slate-200 pt-6">
                <button 
                  form="checkout-form"
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:bg-slate-400"
                >
                  {loading ? 'Processing...' : 'Pay & Confirm Order'}
                </button>
                <p className="text-center text-xs text-slate-500 mt-4">By confirming, you agree to ShopEasy's Terms.</p>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Checkout;
