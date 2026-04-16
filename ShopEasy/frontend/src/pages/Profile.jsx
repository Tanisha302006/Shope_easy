import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../services/api';
import Loader from '../components/Loader';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/auth/me');
        setUser(data);
      } catch (error) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('userInfo');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) return <Loader className="mt-20" />;

  return (
    <div className="container mx-auto px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-slate-900 tracking-tight">My Profile</h1>
      
      {user && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-extrabold uppercase shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-slate-500">{user.email}</p>
              <div className="mt-2">
                {user.isAdmin && (
                   <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">ADMINISTRATOR</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-medium text-slate-600 mb-1">Registered Name</label>
                 <input type="text" className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 text-slate-600" readOnly value={user.name} />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
                 <input type="email" className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 text-slate-600" readOnly value={user.email} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
