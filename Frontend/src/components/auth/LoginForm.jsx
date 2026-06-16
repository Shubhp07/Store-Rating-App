import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';

const LoginForm = () => {
  const { login } = useAuth();
  const location = useLocation();
  const message = location.state?.message;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 transition-all duration-300">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Welcome Back</h2>
        <p className="text-gray-500 font-medium">Please sign in to your account</p>
      </div>
      
      {message && (
        <div className="bg-green-50/80 backdrop-blur-md border border-green-200 p-4 rounded-xl">
          <p className="text-green-700 text-sm font-semibold text-center">{message}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50/80 backdrop-blur-md border border-red-200 p-4 rounded-xl animate-pulse">
          <p className="text-red-700 text-sm font-semibold text-center">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-gray-700" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-gray-900 font-medium"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-gray-700" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-gray-900 font-medium"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-[0_8px_16px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_20px_-6px_rgba(79,70,229,0.6)] hover:from-indigo-500 hover:to-violet-500 focus:ring-4 focus:ring-indigo-300 transform transition-all duration-200 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Sign In'}
        </button>
      </form>
      
      <p className="text-center text-sm font-medium text-gray-600 mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
          Create one now
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
