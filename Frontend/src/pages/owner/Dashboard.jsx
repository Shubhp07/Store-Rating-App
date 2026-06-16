import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';
import Table from '../../components/common/Table';
import StatCard from '../../components/common/StatCard';
import { SkeletonTable, SkeletonStatCard } from '../../components/common/Skeletons';

const OwnerDashboard = () => {
  const [ratings, setRatings] = useState([]);
  const [storeData, setStoreData] = useState(null);
  const [stats, setStats] = useState({ average_rating: 0, total_ratings: 0 });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/owner/dashboard');
      if (res.data && res.data.store) {
        setStoreData(res.data.store);
        setStats({
          average_rating: res.data.average_rating || 0,
          total_ratings: res.data.total_ratings || 0
        });
        
        if (res.data.raters) {
          const mappedRatings = res.data.raters.map(rater => ({
            ...rater,
            Store: res.data.store,
            User: { name: rater.name, email: rater.email },
            createdAt: rater.rated_at
          }));
          setRatings(mappedRatings);
        } else {
          setRatings([]);
        }
      } else if (Array.isArray(res.data)) {
        setRatings(res.data);
      } else {
        setRatings(res.data.ratings || []);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // No store assigned yet, this is fine
        setRatings([]);
        setStoreData(null);
      } else {
        addToast('Failed to load owner dashboard', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const columns = [
    { key: 'user_name', label: 'Rated By', sortable: false, render: (row) => <span className="font-medium text-gray-700 dark:text-gray-300">{row.User?.name || 'Anonymous'}</span> },
    { key: 'user_email', label: 'User Email', sortable: false, render: (row) => <span className="text-gray-500 dark:text-gray-400">{row.User?.email || 'N/A'}</span> },
    { 
      key: 'rating', 
      label: 'Rating', 
      sortable: false,
      render: (row) => (
        <div className="inline-flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800/50 shadow-sm">
          <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          {row.rating}
        </div>
      )
    },
    { 
      key: 'date', 
      label: 'Date', 
      sortable: false, 
      render: (row) => <span className="text-gray-500 dark:text-gray-400 text-sm">{new Date(row.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
    }
  ];

  return (
    <div className="space-y-6 animate-slideUp">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Store Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Review feedback and metrics for your store.</p>
        </div>
      </div>

      {loading ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <SkeletonStatCard />
            <SkeletonStatCard />
          </div>
          <SkeletonTable columns={4} rows={4} />
        </>
      ) : !storeData ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Store Assigned</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            You have not been assigned to manage any store yet. Please contact a system administrator.
          </p>
        </div>
      ) : (
        <>
          {/* Store Info Banner */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-800/30 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
              <span className="text-white font-bold text-2xl">{storeData.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{storeData.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {storeData.address}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2">
            <StatCard 
              title="Average Rating" 
              value={stats.average_rating > 0 ? stats.average_rating : 'N/A'} 
              colorClass="from-amber-400 to-orange-500 shadow-amber-500/30 shadow-lg text-white"
              delay={0}
              icon={
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              }
            />
            <StatCard 
              title="Total Ratings" 
              value={stats.total_ratings} 
              colorClass="from-indigo-500 to-purple-600 shadow-indigo-500/30 shadow-lg text-white"
              delay={100}
              icon={
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden p-6 relative transition-colors duration-200">
            {/* Decorative background blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
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
        </>
      )}
    </div>
  );
};

export default OwnerDashboard;
