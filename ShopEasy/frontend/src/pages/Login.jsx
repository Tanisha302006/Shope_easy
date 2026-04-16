import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/');
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.post('/auth/login', { email, password });
      
      // Store user token details in browser cache
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full">
        <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center tracking-tight">Welcome Back</h2>
        
        <form className="space-y-4" onSubmit={submitHandler}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" 
              placeholder="you@example.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-bold py-3 rounded-lg active:scale-[0.98] transition-all shadow-md mt-4 ${loading ? 'opacity-70' : 'hover:bg-blue-700'}`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600 text-sm">
          Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
