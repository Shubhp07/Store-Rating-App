import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { validateEmail, validatePassword, validateName, validateAddress } from '../../utils/validators';

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError(null);
    
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
      await api.post('/auth/signup', formData);
      navigate('/login', { state: { message: 'Account created successfully. Please log in.' } });
    } catch (err) {
      setGlobalError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-8 space-y-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 transition-all duration-300">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Join Us</h2>
        <p className="text-gray-500 font-medium">Create your new account</p>
      </div>

      {globalError && (
        <div className="bg-red-50/80 backdrop-blur-md border border-red-200 p-4 rounded-xl">
          <p className="text-red-700 text-sm font-semibold text-center">{globalError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-700">Full Name</label>
          <input name="name" type="text" required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-gray-900 font-medium"
            placeholder="Min 20 - Max 60 characters" value={formData.name} onChange={handleChange} />
          {errors.name && <p className="text-red-500 text-xs font-semibold mt-1">{errors.name}</p>}
        </div>
        
        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-700">Email</label>
          <input name="email" type="email" required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-gray-900 font-medium"
            placeholder="john@example.com" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="text-red-500 text-xs font-semibold mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-700">Password</label>
          <input name="password" type="password" required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-gray-900 font-medium"
            placeholder="8-16 chars, 1 Uppercase, 1 Special" value={formData.password} onChange={handleChange} />
          {errors.password && <p className="text-red-500 text-xs font-semibold mt-1">{errors.password}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-700">Address</label>
          <textarea name="address" required rows="2"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-gray-900 font-medium resize-none"
            placeholder="Your full address (Max 400 chars)" value={formData.address} onChange={handleChange}></textarea>
          {errors.address && <p className="text-red-500 text-xs font-semibold mt-1">{errors.address}</p>}
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3.5 mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-[0_8px_16px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_20px_-6px_rgba(79,70,229,0.6)] hover:from-indigo-500 hover:to-violet-500 focus:ring-4 focus:ring-indigo-300 transform transition-all duration-200 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center">
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p className="text-center text-sm font-medium text-gray-600 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
          Log in here
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
