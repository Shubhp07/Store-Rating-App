import React, { useState } from 'react';
import Modal from '../common/Modal';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';
import { validateEmail, validatePassword, validateName, validateAddress } from '../../utils/validators';

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      address: validateAddress(formData.address)
    };

    if (Object.values(newErrors).some(err => err !== null)) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await api.post('/admin/users', formData);
      addToast('User created successfully!', 'success');
      onUserAdded(); 
      onClose(); 
      setFormData({ name: '', email: '', password: '', address: '', role: 'user' });
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add user', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User">
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
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input name="password" type="password" required
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

        <div className="pt-4 pb-2">
          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-indigo-500 hover:to-violet-500 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transform transition-all duration-200 active:scale-95 disabled:opacity-70 flex justify-center items-center">
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;
