import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';

const RatingModal = ({ isOpen, onClose, store, onRatingSubmit }) => {
  const { addToast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && store) {
      setRating(store.user_rating || 0);
      setHoverRating(0);
    }
  }, [isOpen, store]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      addToast('Please select a rating from 1 to 5', 'error');
      return;
    }

    setLoading(true);
    try {
      if (store.user_rating_id) {
        await api.patch(`/user/ratings/${store.user_rating_id}`, { rating });
        addToast('Rating updated successfully!', 'success');
      } else {
        await api.post('/user/ratings', { store_id: store.id, rating });
        addToast('Rating submitted successfully!', 'success');
      }
      onRatingSubmit();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit rating', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!store) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={store.user_rating ? "Modify Your Rating" : "Rate This Store"}>
      <div className="text-center mb-6">
        <h4 className="text-xl font-extrabold text-gray-900">{store.name}</h4>
        <p className="text-sm text-gray-500 mt-1">How would you rate your experience here?</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
            >
              <svg 
                className={`w-14 h-14 transition-colors duration-200 ${
                  star <= (hoverRating || rating) ? 'text-amber-400 drop-shadow-md' : 'text-gray-200'
                }`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>

        <div className="text-sm font-bold text-indigo-700 bg-indigo-50 px-5 py-2.5 rounded-xl border border-indigo-100">
          {rating === 0 ? 'Select Stars' : `${rating} out of 5 Stars`}
        </div>

        <div className="w-full pt-4 border-t border-gray-100">
          <button type="submit" disabled={loading || rating === 0}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-[0_8px_16px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_20px_-6px_rgba(79,70,229,0.6)] hover:from-indigo-500 hover:to-violet-500 focus:ring-4 focus:ring-indigo-300 transform transition-all duration-200 active:scale-[0.98] disabled:opacity-70">
            {loading ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RatingModal;
