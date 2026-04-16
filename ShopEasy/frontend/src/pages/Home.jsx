import { Link } from 'react-router-dom';
import { ArrowRight, Laptop, Shirt, Sofa, Headphones, ShieldCheck, Truck, Clock } from 'lucide-react';

const Home = () => {
  const categories = [
    { name: 'Electronics', icon: Laptop, color: 'bg-indigo-100 text-indigo-600', link: '/products?category=Electronics' },
    { name: 'Fashion', icon: Shirt, color: 'bg-pink-100 text-pink-600', link: '/products?category=Clothing' },
    { name: 'Home Furniture', icon: Sofa, color: 'bg-amber-100 text-amber-600', link: '/products?category=Furniture' },
    { name: 'Accessories', icon: Headphones, color: 'bg-emerald-100 text-emerald-600', link: '/products?category=Accessories' },
  ];

  return (
    <div className="w-full">
      {/* 🚀 Immersive Hero Section */}
      <section className="relative w-full bg-slate-900 text-white overflow-hidden rounded-[2.5rem] mx-auto mt-4 max-w-[96%] xl:max-w-7xl shadow-2xl">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        <div className="relative px-8 py-24 md:py-32 lg:px-16 flex flex-col items-start z-10 w-full max-w-3xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/20 text-blue-300 font-bold text-sm tracking-widest uppercase mb-6 border border-blue-500/30">
            Next-Gen E-Commerce
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Elevate Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Shopping Standard.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed">
            Discover a curated collection of premium electronics, lifestyle apparel, and modern furniture at prices you won't believe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/products" className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 group">
              Shop Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 px-8 py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* 📦 Value Proposition Bar */}
      <section className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-gray-100">
           <div className="flex flex-col items-center text-center px-4">
              <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600"><Truck className="w-8 h-8"/></div>
              <h4 className="font-bold text-lg text-slate-800 mb-2">Free Global Shipping</h4>
              <p className="text-slate-500 text-sm">On all orders spanning over $150.00.</p>
           </div>
           <div className="flex flex-col items-center text-center px-4 md:border-x border-gray-100">
              <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-600"><ShieldCheck className="w-8 h-8"/></div>
              <h4 className="font-bold text-lg text-slate-800 mb-2">Secure Payments</h4>
              <p className="text-slate-500 text-sm">100% secure processing with Stripe & PayPal.</p>
           </div>
           <div className="flex flex-col items-center text-center px-4">
              <div className="h-16 w-16 bg-rose-50 rounded-full flex items-center justify-center mb-4 text-rose-600"><Clock className="w-8 h-8"/></div>
              <h4 className="font-bold text-lg text-slate-800 mb-2">24/7 Dedicated Support</h4>
              <p className="text-slate-500 text-sm">Our expert team is here for you anytime.</p>
           </div>
        </div>
      </section>

      {/* ✨ Beautiful Category Cards */}
      <section className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="flex justify-between items-end mb-10">
          <div>
             <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Shop by Category</h2>
             <p className="text-slate-500 mt-2 text-lg">Browse our highly tailored micro-markets.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link key={idx} to={cat.link} className="group relative bg-white border border-gray-100 p-8 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col items-center justify-center text-center">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
                 <cat.icon className="w-32 h-32" />
              </div>
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm z-10 ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                <cat.icon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 z-10">{cat.name}</h3>
              <p className="text-blue-600 font-medium text-sm mt-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-10">
                Explore Now →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
