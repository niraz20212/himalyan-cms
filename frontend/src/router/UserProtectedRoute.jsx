import { Navigate, Outlet } from 'react-router-dom';
import authStorage from '../utils/authStorage';

export function UserProtectedRoute() {
  const token = authStorage.getAccessToken();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
