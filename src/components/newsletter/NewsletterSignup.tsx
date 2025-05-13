
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const NewsletterSignup = () => {
  return (
    <section className="py-10 px-4 md:px-8 bg-amber-700">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-2">Restez informé</h2>
          <p className="text-amber-100">Inscrivez-vous à notre newsletter pour suivre l'évolution du projet</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <Input 
            placeholder="Votre email" 
            className="bg-white/90 border-transparent focus:border-white focus:ring-white text-amber-900"
          />
          <Button 
            className="bg-white text-amber-900 hover:bg-amber-100 whitespace-nowrap"
          >
            S'inscrire
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
