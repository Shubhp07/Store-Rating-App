import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';
import Table from '../../components/common/Table';
import AddStoreModal from '../../components/admin/AddStoreModal';
import { SkeletonTable } from '../../components/common/Skeletons';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        sortBy,
        order
      }).toString();
      const res = await api.get(`/admin/stores?${queryParams}`);
      setStores(res.data);
    } catch (err) {
      addToast('Failed to load stores', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, order, addToast]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(key);
      setOrder('ASC');
    }
  };

  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'address', 
      label: 'Address', 
      sortable: true, 
      render: (row) => <span className="text-gray-500 block max-w-[250px] truncate" title={row.address}>{row.address}</span> 
    },
    { 
      key: 'average_rating', 
      label: 'Rating', 
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 shadow-sm">
          <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          {row.average_rating || 'N/A'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-slideUp">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Manage Stores</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">View and manage registered stores across the platform.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-5 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Register Store
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap gap-5 items-end transition-colors duration-200">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Search Name</label>
          <input 
            type="text" 
            placeholder="Filter by name..." 
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all text-gray-900 dark:text-gray-100"
            value={filters.name}
            onChange={(e) => setFilters({...filters, name: e.target.value})}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Search Address</label>
          <input 
            type="text" 
            placeholder="Filter by address..." 
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all text-gray-900 dark:text-gray-100"
            value={filters.address}
            onChange={(e) => setFilters({...filters, address: e.target.value})}
          />
        </div>
      </div>

      {loading ? (
        <SkeletonTable columns={4} rows={6} />
      ) : (
        <Table 
          columns={columns} 
          data={stores} 
          onSort={handleSort} 
          sortBy={sortBy} 
          order={order} 
        />
      )}

      <AddStoreModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onStoreAdded={fetchStores}
      />
    </div>
  );
};

export default Stores;
