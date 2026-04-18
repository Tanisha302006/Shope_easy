import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, CreditCard } from 'lucide-react';

const Home = () => {
  return (
    <div className="w-full bg-white min-h-screen">
      
      {/* 🚀 Pro Hero Section */}
      <section className="relative w-full pt-20 md:pt-32 pb-24 md:pb-40 px-6 overflow-hidden mesh-gradient">
        <div className="container mx-auto flex flex-col items-center text-center max-w-6xl z-10 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-bold text-blue-600 tracking-wide uppercase">New Collection Live</span>
          </div>

          <h1 className="text-6xl md:text-[100px] font-black tracking-tighter text-slate-900 mb-8 leading-[0.85] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Elevate your <br/> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 animate-gradient">
              digital lifestyle.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-3xl font-medium tracking-tight leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Experience the pinnacle of design and technology with ShopEasy. 
            Discover curated collections that redefine the modern boundary.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/products" className="bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(0,0,0,0.2)] active:scale-95">
              Explore the Store
            </Link>
            <Link to="/products" className="text-slate-900 hover:text-blue-600 font-bold text-xl flex items-center gap-2 group transition-colors">
              Learn more <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
        
        {/* Dynamic Background */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] animate-float opacity-70"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[100px] animate-float opacity-70" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* 📦 High-Performance Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50', title: 'Lightning Fast.', desc: 'Seamless shopping from discovery to doorstep.' },
              { icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50', title: 'Ironclad Security.', desc: 'Your data is protected by industry-leading encryption.' },
              { icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-50', title: 'Smart Payments.', desc: 'Flexible options tailored for every lifestyle.' }
            ].map((feature, i) => (
              <div key={i} className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2">
                <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-sm`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-2xl text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✨ Immersive Categories Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Design for everyone.</h2>
              <p className="text-xl text-slate-500 font-medium">Choose a category and discover perfection.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/products?category=Electronics" className="group relative h-[600px] rounded-[3.5rem] overflow-hidden bg-white border border-slate-200 transition-all duration-700 hover:border-blue-500/20">
               <div className="absolute top-16 left-16 z-20">
                  <h3 className="text-5xl font-black text-slate-900 tracking-tight mb-3">Electronics</h3>
                  <p className="text-xl text-blue-600 font-bold flex items-center gap-2">Explore <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></p>
               </div>
               <img src="https://images.unsplash.com/photo-1621330396173-e41b18717937?w=1000&q=80" className="absolute bottom-[-10%] right-[-10%] w-[120%] h-full object-contain group-hover:scale-110 transition-transform duration-[2s] ease-out" alt="Tech" />
            </Link>
            
            <Link to="/products?category=Fashion" className="group relative h-[600px] rounded-[3.5rem] overflow-hidden bg-slate-900 transition-all duration-700">
               <div className="absolute top-16 left-16 z-20">
                  <h3 className="text-5xl font-black text-white tracking-tight mb-3">Fashion</h3>
                  <p className="text-xl text-slate-400 font-bold flex items-center gap-2">Discover style <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></p>
               </div>
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-70 group-hover:scale-105 transition-all duration-[2s]"></div>
            </Link>

            <Link to="/products?category=Gaming" className="group relative h-[600px] rounded-[3.5rem] overflow-hidden bg-indigo-600 transition-all duration-700">
               <div className="absolute top-16 left-16 z-20">
                  <h3 className="text-5xl font-black text-white tracking-tight mb-3">Gaming</h3>
                  <p className="text-xl text-indigo-200 font-bold flex items-center gap-2">Enter the arena <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></p>
               </div>
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-[2s]"></div>
            </Link>

            <Link to="/products?category=Luxury" className="group relative h-[600px] rounded-[3.5rem] overflow-hidden bg-amber-50 border border-amber-200 transition-all duration-700 hover:border-amber-400">
               <div className="absolute top-16 left-16 z-20">
                  <h3 className="text-5xl font-black text-amber-900 tracking-tight mb-3">Luxury</h3>
                  <p className="text-xl text-amber-600 font-bold flex items-center gap-2">Timeless elegance <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></p>
               </div>
               <img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000&q=80" className="absolute bottom-[-15%] right-[-15%] w-[110%] h-[90%] object-contain group-hover:scale-110 transition-transform duration-[2s] ease-out" alt="Luxury" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
