
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
    texture: 'bg-gradient-to-br from-chart-1/20 via-chart-1/10 to-chart-1/30',
    pattern: 'pattern-dots-lg opacity-10',
    particles: '🗿',
    overlay: 'bg-gradient-to-r from-chart-1/80 to-chart-1/70'
  },
  antiquite: {
    texture: 'bg-gradient-to-br from-chart-2/20 via-chart-2/10 to-chart-2/30',
    pattern: 'pattern-grid-lg opacity-20',
    particles: '🏛️',
    overlay: 'bg-gradient-to-r from-chart-2/80 to-chart-2/70'
  },
  'moyen-age': {
    texture: 'bg-gradient-to-br from-chart-3/20 via-chart-3/10 to-chart-3/30',
    pattern: 'pattern-dots-lg opacity-15',
    particles: '⚔️',
    overlay: 'bg-gradient-to-r from-chart-3/80 to-chart-3/70'
  },
  renaissance: {
    texture: 'bg-gradient-to-br from-chart-4/20 via-chart-4/10 to-chart-4/30',
    pattern: 'pattern-grid-lg opacity-25',
    particles: '🎨',
    overlay: 'bg-gradient-to-r from-chart-4/80 to-chart-4/70'
  },
  moderne: {
    texture: 'bg-gradient-to-br from-chart-5/20 via-chart-5/10 to-chart-5/30',
    pattern: 'pattern-dots-lg opacity-20',
    particles: '⚡',
    overlay: 'bg-gradient-to-r from-chart-5/80 to-chart-5/70'
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
