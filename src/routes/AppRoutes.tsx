import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import ProtectedRoute from '../auth/ProtectedRoute';
import Login from '../pages/Login/Login';
import OTP from '../pages/OTP/OTP';
import Home from '../pages/Home/Home';
import Visit from '../pages/Visit/Visit';
import PJP from '../pages/PJP/PJP';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
          <Navigate to="/" replace /> : 
          <Login />
        } 
      />
      <Route 
        path="/otp" 
        element={
          isAuthenticated ? 
          <Navigate to="/" replace /> : 
          <OTP />
        } 
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/visit" 
        element={
          <ProtectedRoute>
            <Visit />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/pjp" 
        element={
          <ProtectedRoute>
            <PJP />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
