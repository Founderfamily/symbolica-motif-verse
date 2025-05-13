
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <h2 className="text-2xl font-bold text-white mb-4">Symbolica</h2>
            <p className="max-w-md text-slate-400">Une plateforme open-source dédiée à la découverte, l'analyse et la création autour des symboles & motifs culturels.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium text-white mb-4">Plateforme</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Explorer</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Contribuer</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">À propos</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-4">Communauté</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Forum</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-4">Légal</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-white transition-colors">Mentions légales</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Confidentialité</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Licence</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 Symbolica — Association loi 1901</p>
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">FR</a>
              <a href="#" className="hover:text-white transition-colors">EN</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
