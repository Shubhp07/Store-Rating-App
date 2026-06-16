import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './hooks/useToast';
import AppRouter from './routes/AppRouter';
import Toast from './components/common/Toast';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
          <Toast />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
