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
export const culturalGradient = (culture: string): string => {
  switch (culture.toLowerCase()) {
    case 'celtique':
      return 'from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20';
    case 'française':
      return 'from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20';
    case 'grecque':
      return 'from-blue-300/10 to-cyan-500/10 hover:from-blue-300/20 hover:to-cyan-500/20';
    case 'indienne':
      return 'from-orange-500/10 to-amber-500/10 hover:from-orange-500/20 hover:to-amber-500/20';
    case 'ashanti':
      return 'from-yellow-500/10 to-amber-600/10 hover:from-yellow-500/20 hover:to-amber-600/20';
    case 'japonaise':
      return 'from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20';
    case 'aborigène':
      return 'from-orange-600/10 to-red-700/10 hover:from-orange-600/20 hover:to-red-700/20';
    case 'nordique':
      return 'from-sky-500/10 to-blue-600/10 hover:from-sky-500/20 hover:to-blue-600/20';
    case 'islamique':
      return 'from-emerald-400/10 to-teal-600/10 hover:from-emerald-400/20 hover:to-teal-600/20';
    case 'mésoaméricaine':
      return 'from-red-600/10 to-orange-500/10 hover:from-red-600/20 hover:to-orange-500/20';
    case 'chinoise':
      return 'from-purple-500/10 to-red-500/10 hover:from-purple-500/20 hover:to-red-500/20';
    case 'égyptienne':
      return 'from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20';
    case 'amérindienne':
      return 'from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20';
    case 'moyen-orientale':
      return 'from-cyan-500/10 to-blue-600/10 hover:from-cyan-500/20 hover:to-blue-600/20';
    case 'irlandaise':
      return 'from-green-600/10 to-emerald-400/10 hover:from-green-600/20 hover:to-emerald-400/20';
    case 'maorie':
      return 'from-teal-500/10 to-green-600/10 hover:from-teal-500/20 hover:to-green-600/20';
    default:
      return 'from-slate-200/10 to-slate-300/10 hover:from-slate-200/20 hover:to-slate-300/20';
  }
};

// Add CSS variables for cultural colors
document.documentElement.style.setProperty('--color-celtique', '#22c55e');
document.documentElement.style.setProperty('--color-française', '#3b82f6');
document.documentElement.style.setProperty('--color-grecque', '#06b6d4');
document.documentElement.style.setProperty('--color-indienne', '#f97316');
document.documentElement.style.setProperty('--color-ashanti', '#eab308');
document.documentElement.style.setProperty('--color-japonaise', '#ef4444');
document.documentElement.style.setProperty('--color-aborigène', '#9a3412');
document.documentElement.style.setProperty('--color-nordique', '#0ea5e9');
document.documentElement.style.setProperty('--color-islamique', '#10b981');
document.documentElement.style.setProperty('--color-mésoaméricaine', '#dc2626');
document.documentElement.style.setProperty('--color-chinoise', '#a855f7');
document.documentElement.style.setProperty('--color-égyptienne', '#f59e0b');
document.documentElement.style.setProperty('--color-amérindienne', '#ea580c');
document.documentElement.style.setProperty('--color-moyen-orientale', '#06b6d4');
document.documentElement.style.setProperty('--color-irlandaise', '#16a34a');
document.documentElement.style.setProperty('--color-maorie', '#14b8a6');

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
