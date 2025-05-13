
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

const NewsletterSignup = () => {
  return (
    <section className="py-12 px-4 md:px-8 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-700 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400"></div>
        <div className="absolute inset-0 pattern-zigzag-lg"></div>
      </div>
      
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-2">Restez informé</h2>
          <p className="text-amber-100">Inscrivez-vous à notre newsletter pour suivre l'évolution du projet</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <Input 
            placeholder="Votre email" 
            className="bg-white/90 border-transparent focus:border-white focus:ring-white text-amber-900 shadow-lg"
          />
          <Button 
            className="bg-white text-amber-900 hover:bg-amber-100 whitespace-nowrap shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            S'inscrire
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
