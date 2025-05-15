
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/services/logService';
import { ErrorHandler } from '@/utils/errorHandler';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const AdminLayout = () => {
  const { isAdmin, loading, user } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Log admin access attempt
    logger.info('Admin access attempt', { 
      userId: user?.id, 
      isAdmin: isAdmin,
      path: window.location.pathname
    });
    
    try {
      // Si le chargement est terminé
      if (!loading) {
        setAuthChecked(true);
        
        if (!user) {
          logger.warning('Unauthorized access attempt: Not authenticated', {
            path: window.location.pathname
          });
          navigate('/auth', { replace: true });
          return;
        }
        
        // Ne rediriger que si isAdmin est explicitement false (pas undefined)
        if (isAdmin === false) { // Check for explicitly false
          logger.warning('Unauthorized access attempt: Not admin', {
            userId: user.id,
            isAdmin: isAdmin,
            path: window.location.pathname
          });
          setError("Vous n'avez pas les permissions d'administrateur nécessaires.");
          // Retarder la redirection pour que l'utilisateur puisse voir le message d'erreur
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 3000);
        } else if (isAdmin === undefined && !loading) {
          // Si isAdmin est undefined mais que le chargement est terminé, on attend
          logger.info('Admin status is still being determined', {
            userId: user.id,
            loading: loading
          });
          // Ne pas rediriger, juste attendre
        }
      }
    } catch (err) {
      logger.error('Error in AdminLayout authorization', { error: err });
      setError("Une erreur est survenue lors de la vérification des autorisations.");
    }
  }, [isAdmin, loading, navigate, user]);
  
  if (loading || isAdmin === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="text-slate-600 ml-3">Vérification des autorisations...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Link to="/" className="text-amber-600 hover:text-amber-700">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Only render if user is admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="text-slate-600 ml-3">Vérification des autorisations...</p>
      </div>
    );
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
                  to="/admin/content" 
                  className="text-slate-600 hover:text-amber-600 transition"
                >
                  Contenu du site
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
