import React from 'react';

export const SkeletonTable = ({ columns = 4, rows = 5 }) => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50/50 dark:bg-gray-800/50">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={`th-${i}`} className="px-6 py-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={`tr-${rowIndex}`}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={`td-${rowIndex}-${colIndex}`} className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {colIndex === 0 && <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0"></div>}
                      <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse ${colIndex === 0 ? 'w-24' : 'w-full'}`}></div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-48 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-3 w-2/3">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 animate-pulse"></div>
            </div>
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonStatCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
      <div className="space-y-3">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
      </div>
      <div className="h-14 w-14 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    </div>
  );
};
