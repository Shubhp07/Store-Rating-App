import React from 'react';

const StoreCard = ({ store, onRateClick }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white font-bold text-xl">{store.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="inline-flex items-center gap-1.5 font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {store.average_rating || 'No Ratings'}
            </span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1" title={store.name}>{store.name}</h3>
        <div className="flex items-start text-gray-500 text-sm mb-4">
          <svg className="w-5 h-5 mr-1.5 flex-shrink-0 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-2" title={store.address}>{store.address}</span>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-100 mt-2 flex items-center justify-between">
        <div className="text-sm font-medium">
          {store.user_rating ? (
            <span className="text-green-700 bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-200">
              Your Rating: <b className="text-green-800">{store.user_rating} ★</b>
            </span>
          ) : (
            <span className="text-gray-400 italic">Not rated yet</span>
          )}
        </div>
        
        <button 
          onClick={() => onRateClick(store)}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md active:scale-95 ${
            store.user_rating 
              ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {store.user_rating ? 'Modify Rating' : 'Rate Store'}
        </button>
      </div>
    </div>
  );
};

export default StoreCard;
