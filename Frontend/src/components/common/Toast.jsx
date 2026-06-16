import React from 'react';
import { useToast } from '../../hooks/useToast';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className={`px-5 py-4 rounded-xl shadow-xl border flex items-center justify-between min-w-[300px] max-w-sm pointer-events-auto transform transition-all duration-300 animate-slideUp backdrop-blur-md ${
            toast.type === 'error' ? 'bg-red-50/90 border-red-200 text-red-800' : 
            toast.type === 'success' ? 'bg-green-50/90 border-green-200 text-green-800' : 
            'bg-indigo-50/90 border-indigo-200 text-indigo-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && (
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-semibold text-sm">{toast.message}</span>
          </div>
          <button onClick={() => removeToast(toast.id)} className="ml-4 text-gray-500 hover:text-gray-800 transition-colors p-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
