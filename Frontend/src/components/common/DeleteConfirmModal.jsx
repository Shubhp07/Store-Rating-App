import React from 'react';
import Modal from './Modal';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || "Confirm Deletion"}>
      <div className="space-y-6">
        <div className="flex items-center gap-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/30">
          <svg className="w-10 h-10 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="font-bold">Warning</h4>
            <p className="text-sm text-red-500 dark:text-red-400 mt-0.5">This action is permanent and cannot be undone.</p>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 font-medium">{message || "Are you sure you want to delete this resource?"}</p>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-red-600/20"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
