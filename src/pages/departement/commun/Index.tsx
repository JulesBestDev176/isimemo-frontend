
// Ce dossier contient les pages partagées (communes) à plusieurs rôles, comme le calendrier, la messagerie, etc.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

export default Index;
