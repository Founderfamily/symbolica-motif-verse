
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Animation utilities
export const fadeInAnimation = (index: number = 0, delay: number = 0.1) => {
  const baseDelay = delay * index;
  return {
    opacity: 0,
    transform: 'translateY(10px)',
    animation: `fadeIn 0.5s ease-out ${baseDelay}s forwards`
  };
};

// Custom gradient generator for cultural themes
export const culturalGradient = (culture: string) => {
  const gradients = {
    'Celtique': 'from-emerald-50 to-emerald-100',
    'Française': 'from-blue-50 to-indigo-100', 
    'Grecque': 'from-cyan-50 to-sky-100',
    'Indienne': 'from-rose-50 to-orange-100',
    'Ashanti': 'from-amber-50 to-amber-100',
    'Japonaise': 'from-sky-50 to-blue-100',
    'Aborigène': 'from-orange-50 to-red-100',
    'Nordique': 'from-slate-50 to-gray-100',
    'Islamique': 'from-teal-50 to-emerald-100',
    'Mésoaméricaine': 'from-lime-50 to-green-100',
    'default': 'from-slate-50 to-slate-100'
  };
  
  return gradients[culture as keyof typeof gradients] || gradients.default;
};
