import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';
import { validateEmail, validatePassword, validateName, validateAddress } from '../../utils/validators';

const EditUserModal = ({ isOpen, onClose, user, onUserUpdated }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'user', is_suspended: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        address: user.address || '',
        role: user.role || 'user',
        is_suspended: user.is_suspended || false
      });
      setErrors({});
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      address: validateAddress(formData.address),
      password: formData.password ? validatePassword(formData.password) : null
    };

    if (Object.values(newErrors).some(err => err !== null)) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        role: formData.role,
        is_suspended: formData.is_suspended
      };
      if (formData.password) {
        payload.password = formData.password;
      }
      await api.put(`/admin/users/${user.id}`, payload);
      addToast('User updated successfully!', 'success');
      onUserUpdated();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update user', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User Details">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
          <input name="name" type="text" required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white"
            value={formData.name} onChange={handleChange} />
          {errors.name && <p className="text-red-500 text-xs font-semibold mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input name="email" type="email" required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white"
            value={formData.email} onChange={handleChange} />
          {errors.email && <p className="text-red-500 text-xs font-semibold mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">New Password (optional)</label>
          <input name="password" type="password" placeholder="Leave blank to keep current password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white"
            value={formData.password} onChange={handleChange} />
          {errors.password && <p className="text-red-500 text-xs font-semibold mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Role</label>
          <select name="role" required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white"
            value={formData.role} onChange={handleChange}>
            <option value="user">Normal User</option>
            <option value="store_owner">Store Owner</option>
            <option value="admin">System Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Address</label>
          <textarea name="address" required rows="2"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white resize-none"
            value={formData.address} onChange={handleChange}></textarea>
          {errors.address && <p className="text-red-500 text-xs font-semibold mt-1">{errors.address}</p>}
        </div>

        <div className="flex items-center gap-3 py-2">
          <input
            id="is_suspended_toggle"
            name="is_suspended"
            type="checkbox"
            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            checked={formData.is_suspended}
            onChange={handleChange}
          />
          <label htmlFor="is_suspended_toggle" className="text-sm font-bold text-red-600 dark:text-red-400 cursor-pointer select-none">
            Suspend Account (block logins and ratings)
          </label>
        </div>

        <div className="pt-4 pb-2">
          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-indigo-500 hover:to-violet-500 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transform transition-all duration-200 active:scale-95 disabled:opacity-70 flex justify-center items-center">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
