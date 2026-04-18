import { useState, useEffect } from 'react';
import { 
  Users, Trash2, ShieldCheck, ShieldOff, Search, X,
  Mail, Calendar, Crown, User as UserIcon
} from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete "${userName}"? This action cannot be undone.`)) {
      try {
        await API.delete(`/admin/users/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const toggleAdmin = async (userId) => {
    try {
      const { data } = await API.put(`/admin/users/${userId}/toggle-admin`);
      setUsers(users.map(u => u._id === userId ? data.user : u));
      toast.success(data.message);
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminCount = users.filter(u => u.isAdmin).length;
  const customerCount = users.filter(u => !u.isAdmin).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Users</h1>
        <p className="text-slate-500 mt-1 font-medium">{users.length} registered users</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{users.length}</p>
            <p className="text-xs text-slate-500 font-medium">Total Users</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
            <Crown className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{adminCount}</p>
            <p className="text-xs text-slate-500 font-medium">Administrators</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{customerCount}</p>
            <p className="text-xs text-slate-500 font-medium">Customers</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6">
        <div className="flex items-center px-5 py-3 gap-3">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 text-sm outline-none text-slate-800 placeholder:text-slate-400"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                          user.isAdmin 
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {user.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                            {user.name}
                            {user.isAdmin && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                          </p>
                          <p className="text-xs text-slate-400">ID: {user._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${
                        user.isAdmin 
                          ? 'bg-amber-50 text-amber-700 border-amber-200' 
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {user.isAdmin ? (
                          <><ShieldCheck className="w-3.5 h-3.5" /> Admin</>
                        ) : (
                          <><UserIcon className="w-3.5 h-3.5" /> Customer</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleAdmin(user._id)}
                          className={`p-2 rounded-lg transition-all ${
                            user.isAdmin 
                              ? 'text-amber-500 hover:text-amber-700 hover:bg-amber-50' 
                              : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                          title={user.isAdmin ? 'Demote from admin' : 'Promote to admin'}
                        >
                          {user.isAdmin ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deleteUser(user._id, user.name)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete user"
                          disabled={user.isAdmin}
                        >
                          <Trash2 className={`w-4 h-4 ${user.isAdmin ? 'opacity-30 cursor-not-allowed' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-slate-500 font-medium">No users found</p>
                    <p className="text-sm text-slate-400 mt-1">
                      {searchTerm ? 'Try a different search term' : 'Users will appear here after registration'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
