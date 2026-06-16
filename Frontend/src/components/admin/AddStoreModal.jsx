import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';
import { validateEmail, validateName, validateAddress } from '../../utils/validators';

const AddStoreModal = ({ isOpen, onClose, onStoreAdded }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    if (isOpen) {
      api.get('/admin/users?role=store_owner')
        .then(res => setOwners(res.data))
        .catch(() => addToast('Failed to load store owners', 'error'));
    }
  }, [isOpen, addToast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      address: validateAddress(formData.address)
    };

    if (Object.values(newErrors).some(err => err !== null)) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, owner_id: formData.owner_id || null };
      await api.post('/admin/stores', payload);
      addToast('Store created successfully!', 'success');
      onStoreAdded();
      onClose();
      setFormData({ name: '', email: '', address: '', owner_id: '' });
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add store', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Store">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Store Name</label>
          <input name="name" type="text" required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-gray-900"
            value={formData.name} onChange={handleChange} />
          {errors.name && <p className="text-red-500 text-xs font-semibold mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Store Email</label>
          <input name="email" type="email" required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-gray-900"
            value={formData.email} onChange={handleChange} />
          {errors.email && <p className="text-red-500 text-xs font-semibold mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Store Owner (Optional)</label>
          <select name="owner_id"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-gray-900"
            value={formData.owner_id} onChange={handleChange}>
            <option value="">Select an owner...</option>
            {owners.map(owner => (
              <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
          <textarea name="address" required rows="2"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-gray-900 resize-none"
            value={formData.address} onChange={handleChange}></textarea>
          {errors.address && <p className="text-red-500 text-xs font-semibold mt-1">{errors.address}</p>}
        </div>

        <div className="pt-4 pb-2">
          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-indigo-500 hover:to-violet-500 focus:ring-4 focus:ring-indigo-300 transform transition-all duration-200 active:scale-95 disabled:opacity-70">
            {loading ? 'Creating...' : 'Create Store'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddStoreModal;
