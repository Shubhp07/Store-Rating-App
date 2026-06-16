import React from 'react';
import SignupForm from '../../components/auth/SignupForm';

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Dynamic Animated Background */}
      <div className="absolute top-10 -right-4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-20 -left-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-10 left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      
      <div className="z-10 w-full flex justify-center px-4 py-8">
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
