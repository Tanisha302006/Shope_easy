import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('userInfo')) {
      navigate('/');
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      setLoading(true);
      const { data } = await API.post('/auth/register', { name, email, password });
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Registration successful. Welcome!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full">
        <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center tracking-tight">Create Account</h2>
        
        <form className="space-y-4" onSubmit={submitHandler}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-black active:scale-[0.98] transition-all shadow-md mt-6">
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
