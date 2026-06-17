import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';
import StatCard from '../../components/common/StatCard';
import { SkeletonStatCard } from '../../components/common/Skeletons';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        addToast('Failed to load dashboard statistics', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [addToast]);

  if (loading) {
    return (
      <div className="space-y-8 animate-slideUp">
        <div>
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>
      </div>
    );
  }

  const userBreakdown = stats?.roleBreakdown || { admin: 0, store_owner: 0, user: 0 };
  const totalUsers = stats?.totalUsers || 1;

  const adminPercentage = Math.round((userBreakdown.admin / totalUsers) * 100) || 0;
  const ownerPercentage = Math.round((userBreakdown.store_owner / totalUsers) * 100) || 0;
  const normalUserPercentage = Math.round((userBreakdown.user / totalUsers) * 100) || 0;

  return (
    <div className="space-y-8 animate-slideUp">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">System Overview</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Welcome to the Administrator Control Panel.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          delay={0}
          colorClass="from-blue-500 to-cyan-400 shadow-blue-500/30 shadow-lg text-white"
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatCard 
          title="Total Stores" 
          value={stats?.totalStores || 0} 
          delay={100}
          colorClass="from-purple-500 to-indigo-500 shadow-purple-500/30 shadow-lg text-white"
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <StatCard 
          title="Total Ratings" 
          value={stats?.totalRatings || 0} 
          delay={200}
          colorClass="from-pink-500 to-rose-400 shadow-pink-500/30 shadow-lg text-white"
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* User Role Breakdown */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-200">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20H2v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              User Role Breakdown
            </h3>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-600 dark:text-gray-400">Normal Users</span>
                  <span className="text-gray-900 dark:text-white">{userBreakdown.user} ({normalUserPercentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${normalUserPercentage}%` }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-600 dark:text-gray-400">Store Owners</span>
                  <span className="text-gray-900 dark:text-white">{userBreakdown.store_owner} ({ownerPercentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${ownerPercentage}%` }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-600 dark:text-gray-400">Administrators</span>
                  <span className="text-gray-900 dark:text-white">{userBreakdown.admin} ({adminPercentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                  <div className="bg-pink-500 h-full rounded-full transition-all duration-500" style={{ width: `${adminPercentage}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Store Owner Coverage */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-200">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Ownership Coverage
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="46" className="stroke-gray-100 dark:stroke-gray-700 fill-none" strokeWidth="10" />
                  <circle cx="56" cy="56" r="46" className="stroke-indigo-600 dark:stroke-indigo-500 fill-none transition-all duration-700" 
                    strokeWidth="10" 
                    strokeDasharray={`${2 * Math.PI * 46}`} 
                    strokeDashoffset={`${2 * Math.PI * 46 * (1 - (stats?.storeCoverage?.percentage || 0) / 100)}`} 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-extrabold text-gray-900 dark:text-white">{stats?.storeCoverage?.percentage || 0}%</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Coverage</span>
                </div>
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <p className="text-gray-700 dark:text-gray-300 font-bold text-lg">Store Management Health</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {stats?.storeCoverage?.assigned} of {stats?.storeCoverage?.total} stores are currently managed by store owners.
                </p>
                {stats?.storeCoverage?.total > stats?.storeCoverage?.assigned && (
                  <span className="inline-block bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 text-xs font-bold px-3 py-1 rounded-xl mt-2">
                    {stats?.storeCoverage?.total - stats?.storeCoverage?.assigned} store(s) require owners!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Store Leaderboard */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden flex flex-col justify-between transition-colors duration-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              Top Rated Stores
            </h3>

            {(!stats?.topStores || stats.topStores.length === 0) ? (
              <div className="text-center py-16 text-gray-400 font-semibold italic">
                No stores rated yet.
              </div>
            ) : (
              <div className="space-y-4">
                {stats.topStores.map((store, index) => (
                  <div key={store.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all duration-200 hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm ${
                        index === 0 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        index === 1 ? 'bg-slate-100 text-slate-800 border border-slate-200' :
                        index === 2 ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-extrabold text-gray-900 dark:text-white">{store.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{store.total_ratings} ratings received</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/50">
                      <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {store.average_rating}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-6 text-center text-xs font-semibold text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
            Updated in real-time
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
