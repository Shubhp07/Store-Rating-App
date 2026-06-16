import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';
import StoreCard from '../../components/user/StoreCard';
import RatingModal from '../../components/user/RatingModal';
import Spinner from '../../components/common/Spinner';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  
  const [selectedStore, setSelectedStore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        sortBy,
        order: sortBy === 'average_rating' ? 'DESC' : 'ASC'
      }).toString();
      const res = await api.get(`/user/stores?${queryParams}`);
      setStores(res.data);
    } catch (err) {
      addToast('Failed to load stores', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, addToast]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStores();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [filters, sortBy, fetchStores]);

  const handleRateClick = (store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-slideUp">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Browse Stores</h2>
          <p className="text-gray-500 font-medium mt-1">Discover, review, and rate your favorite stores.</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap gap-5 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Search Name</label>
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Filter by name..." 
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 font-medium"
              value={filters.name}
              onChange={(e) => setFilters({...filters, name: e.target.value})}
            />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Search Address</label>
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <input 
              type="text" 
              placeholder="Filter by address..." 
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 font-medium"
              value={filters.address}
              onChange={(e) => setFilters({...filters, address: e.target.value})}
            />
          </div>
        </div>
        <div className="w-56">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sort By</label>
          <select 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 font-medium"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Alphabetical</option>
            <option value="average_rating">Highest Rated First</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="w-12 h-12" />
        </div>
      ) : stores.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
          <svg className="w-20 h-20 text-gray-300 mx-auto mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Stores Found</h3>
          <p className="text-gray-500 font-medium">Try adjusting your search filters to find what you're looking for.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} onRateClick={handleRateClick} />
          ))}
        </div>
      )}

      <RatingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        store={selectedStore}
        onRatingSubmit={fetchStores}
      />
    </div>
  );
};

export default Stores;
