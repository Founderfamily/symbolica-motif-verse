
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
    animation: `fadeIn 0.6s ease-out ${baseDelay}s forwards`
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

// Generate gradient text utility
export const gradientText = (from: string, to: string) => {
  return `bg-gradient-to-r from-${from} to-${to} bg-clip-text text-transparent`;
};

// Animation delay utility for staggered animations
export const staggerDelay = (index: number, baseDelay: number = 0.1) => {
  return {
    animationDelay: `${index * baseDelay}s`
  };
};

// Hover animation utility
export const hoverAnimation = (type: 'scale' | 'lift' | 'glow' | 'all') => {
  switch (type) {
    case 'scale':
      return 'hover:scale-105 transition-transform duration-300';
    case 'lift':
      return 'hover:-translate-y-1 transition-transform duration-300';
    case 'glow':
      return 'hover:shadow-lg hover:shadow-amber-100/20 transition-shadow duration-300';
    case 'all':
      return 'hover:scale-105 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-100/20 transition-all duration-300';
    default:
      return '';
  }
};

// Pattern background utility
export const patternBackground = (type: 'dots' | 'grid' | 'zigzag') => {
  switch (type) {
    case 'dots':
      return 'pattern-dots-lg';
    case 'grid':
      return 'pattern-grid-lg';
    case 'zigzag':
      return 'pattern-zigzag-lg';
    default:
      return '';
  }
};
