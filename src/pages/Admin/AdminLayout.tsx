
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/services/logService';
import { ErrorHandler } from '@/utils/errorHandler';

const AdminLayout = () => {
  const { isAdmin, loading, user } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  
  useEffect(() => {
    // Log admin access attempt
    logger.info('Admin access attempt', { 
      userId: user?.id, 
      isAdmin: isAdmin,
      path: window.location.pathname
    });
    
    // Si l'utilisateur n'est pas connecté ou si le chargement est terminé et l'utilisateur n'est pas admin
    if (!loading) {
      setAuthChecked(true);
      
      if (!user) {
        logger.warning('Unauthorized access attempt: Not authenticated', {
          path: window.location.pathname
        });
        navigate('/auth', { replace: true });
        return;
      }
      
      if (!isAdmin) {
        logger.warning('Unauthorized access attempt: Not admin', {
          userId: user.id,
          path: window.location.pathname
        });
        navigate('/', { replace: true });
      }
    }
  }, [isAdmin, loading, navigate, user]);
  
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Only render if user is admin
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">Administration Symbolica</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link 
                  to="/admin" 
                  className="text-slate-600 hover:text-amber-600 transition"
                >
                  Tableau de bord
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/symbols" 
                  className="text-slate-600 hover:text-amber-600 transition"
                >
                  Symboles
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="text-slate-600 hover:text-amber-600 transition"
                >
                  Retour au site
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
