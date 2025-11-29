import React from 'react';
// import { Navigate } from 'react-router-dom';   // Désactivé : plus besoin de redirection
import { useAuthContext } from '../context/AuthContext';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { loading } = useAuthContext();

  // ✔ On peut garder le loader pour éviter les flashs si tu veux
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // ✔ Authentification désactivée → on laisse entrer tout le monde
  return <>{children}</>;
};

export default ProtectedRoute;
