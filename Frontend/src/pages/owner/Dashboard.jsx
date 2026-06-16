import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';
import Table from '../../components/common/Table';
import Spinner from '../../components/common/Spinner';

const OwnerDashboard = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/owner/dashboard');
      if (Array.isArray(res.data)) {
        setRatings(res.data);
      } else {
        setRatings(res.data.ratings || []);
      }
    } catch (err) {
      addToast('Failed to load owner dashboard', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const columns = [
    { key: 'store_name', label: 'Store Name', sortable: false, render: (row) => <span className="font-bold text-gray-800">{row.Store?.name || 'Unknown Store'}</span> },
    { key: 'user_name', label: 'Rated By', sortable: false, render: (row) => <span className="font-medium text-gray-700">{row.User?.name || 'Anonymous'}</span> },
    { key: 'user_email', label: 'User Email', sortable: false, render: (row) => <span className="text-gray-500">{row.User?.email || 'N/A'}</span> },
    { 
      key: 'rating', 
      label: 'Rating', 
      sortable: false,
      render: (row) => (
        <div className="inline-flex items-center gap-1.5 font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 shadow-sm">
          <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          {row.rating}
        </div>
      )
    },
    { 
      key: 'date', 
      label: 'Date', 
      sortable: false, 
      render: (row) => <span className="text-gray-500 text-sm">{new Date(row.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
    }
  ];

  return (
    <div className="space-y-6 animate-slideUp">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Store Performance</h2>
          <p className="text-gray-500 font-medium mt-1">Review feedback and ratings from your customers.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-3xl shadow-sm border border-gray-100">
          <Spinner size="w-12 h-12" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-6 relative">
          {/* Decorative background blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Recent Ratings Received
            </h3>
            <Table 
              columns={columns} 
              data={ratings} 
              onSort={() => {}} 
              sortBy="" 
              order="" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
