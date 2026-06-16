import React from 'react';

const StatCard = ({ title, value, icon, colorClass, delay = 0 }) => {
  return (
    <div 
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-slideUp relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="z-10">
          <dt className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-1">
            {title}
          </dt>
          <dd>
            <div className="text-4xl font-extrabold text-gray-900">{value}</div>
          </dd>
        </div>
        <div className={`z-10 flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${colorClass}`}>
          {icon}
        </div>
      </div>
      
      {/* Decorative background circle */}
      <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full opacity-10 bg-gradient-to-br ${colorClass}`}></div>
    </div>
  );
};

export default StatCard;
