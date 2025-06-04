
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CollectionWithTranslations } from '@/types/collections';
import { OptimizedCollectionCard } from './OptimizedCollectionCard';

interface CollectionAnimationsProps {
  collections: CollectionWithTranslations[];
  layout?: 'grid' | 'list' | 'masonry';
  staggerDelay?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

const hoverVariants = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

export const CollectionAnimations: React.FC<CollectionAnimationsProps> = ({
  collections,
  layout = 'grid',
  staggerDelay = 0.1
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getLayoutClasses = () => {
    switch (layout) {
      case 'list':
        return 'flex flex-col space-y-4';
      case 'masonry':
        return 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6';
      default:
        return 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    }
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={getLayoutClasses()}
      >
        <AnimatePresence mode="popLayout">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => setHoveredId(collection.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="relative"
              style={{
                zIndex: hoveredId === collection.id ? 10 : 1
              }}
            >
              <motion.div
                variants={hoverVariants}
                className="h-full"
              >
                <OptimizedCollectionCard collection={collection} />
              </motion.div>

              {/* Effet de brillance au survol */}
              <AnimatePresence>
                {hoveredId === collection.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 rounded-lg pointer-events-none shimmer-effect"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <style>{`
        @keyframes shimmer {
          0% { 
            transform: skewX(-12deg) translateX(-100%); 
          }
          100% { 
            transform: skewX(-12deg) translateX(100%); 
          }
        }
        
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: skewX(-12deg) translateX(-100%);
          animation: shimmer 0.6s ease-out;
        }
      `}</style>
    </>
  );
};
