
import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const AdminLayout = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Si l'utilisateur n'est pas admin et le chargement est terminé, rediriger
    if (!loading && !isAdmin) {
      navigate('/auth');
    }
  }, [isAdmin, loading, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
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
