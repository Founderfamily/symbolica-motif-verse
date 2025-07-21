
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface ParallaxPeriodHeaderProps {
  period: {
    id: string;
    name: string;
    dateRange: string;
    description: string;
    color: string;
    gradient: string;
    cultures: string[];
  };
  isSubPeriod?: boolean;
}

const PERIOD_THEMES = {
  prehistoire: {
    texture: 'bg-gradient-to-br from-stone-800/20 via-amber-900/10 to-stone-700/20',
    pattern: 'pattern-dots-lg opacity-10',
    particles: '🗿',
    overlay: 'bg-gradient-to-r from-amber-900/80 to-stone-800/80'
  },
  antiquite: {
    texture: 'bg-gradient-to-br from-amber-100/30 via-yellow-50/20 to-amber-200/30',
    pattern: 'pattern-grid-lg opacity-20',
    particles: '🏛️',
    overlay: 'bg-gradient-to-r from-amber-600/85 to-yellow-600/85'
  },
  'moyen-age': {
    texture: 'bg-gradient-to-br from-blue-900/20 via-indigo-800/15 to-purple-900/20',
    pattern: 'pattern-dots-lg opacity-15',
    particles: '⚔️',
    overlay: 'bg-gradient-to-r from-blue-700/80 to-indigo-700/80'
  },
  renaissance: {
    texture: 'bg-gradient-to-br from-purple-100/30 via-pink-50/20 to-purple-200/30',
    pattern: 'pattern-grid-lg opacity-25',
    particles: '🎨',
    overlay: 'bg-gradient-to-r from-purple-600/85 to-pink-600/85'
  },
  moderne: {
    texture: 'bg-gradient-to-br from-green-100/30 via-emerald-50/20 to-teal-200/30',
    pattern: 'pattern-dots-lg opacity-20',
    particles: '⚡',
    overlay: 'bg-gradient-to-r from-green-600/85 to-teal-600/85'
  }
};

export function ParallaxPeriodHeader({ period, isSubPeriod = false }: ParallaxPeriodHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 0.95]);

  const theme = PERIOD_THEMES[period.id as keyof typeof PERIOD_THEMES] || PERIOD_THEMES.moderne;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl ${isSubPeriod ? 'h-32' : 'h-48'} mb-8`}
    >
      {/* Background with parallax */}
      <motion.div 
        style={{ y, scale }}
        className={`absolute inset-0 ${theme.texture} ${theme.pattern}`}
      />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={isVisible ? {
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
              opacity: [0.1, 0.3, 0.1]
            } : {}}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          >
            {theme.particles}
          </motion.div>
        ))}
      </div>

      {/* Gradient overlay */}
      <motion.div 
        style={{ opacity }}
        className={`absolute inset-0 ${theme.overlay}`}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center p-8">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className={`${isSubPeriod ? 'text-2xl' : 'text-4xl'} font-bold text-white mb-2 text-shadow-lg`}>
              {period.name}
            </h2>
            <p className="text-white/90 text-lg mb-3 text-shadow">
              {period.description}
            </p>
            <p className="text-white/80 text-sm mb-4 text-shadow">
              {period.dateRange}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-2"
          >
            {period.cultures.map((culture, index) => (
              <motion.div
                key={culture}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                  {culture}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Animated border */}
      <motion.div 
        className="absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)`,
          backgroundSize: '200% 200%'
        }}
        animate={isVisible ? {
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}
