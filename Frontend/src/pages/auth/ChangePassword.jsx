import React, { useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';
import { validatePassword } from '../../utils/validators';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const passError = validatePassword(formData.newPassword);
    if (passError) {
      setErrors({ newPassword: passError });
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', formData);
      addToast('Password updated successfully!', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 animate-slideUp">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-50 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-pink-50 rounded-full opacity-50 blur-xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Change Password</h2>
          <p className="text-gray-500 text-sm mb-8 font-medium">Ensure your account is using a long, random password to stay secure.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
              <input 
                name="oldPassword" 
                type="password" 
                required
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-gray-900 font-medium"
                value={formData.oldPassword} 
                onChange={handleChange} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
              <input 
                name="newPassword" 
                type="password" 
                required
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-gray-900 font-medium"
                value={formData.newPassword} 
                onChange={handleChange} 
              />
              {errors.newPassword && <p className="text-red-500 text-xs font-semibold mt-2">{errors.newPassword}</p>}
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-indigo-500 hover:to-violet-500 focus:ring-4 focus:ring-indigo-300 transform transition-all duration-200 active:scale-95 disabled:opacity-70"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
