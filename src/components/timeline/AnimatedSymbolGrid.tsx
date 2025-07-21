
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Eye, Heart, Clock } from 'lucide-react';

interface SymbolWithImages {
  id: string;
  name: string;
  culture?: string;
  period?: string;
  description?: string;
  created_at?: string;
  symbol_images?: Array<{
    id: string;
    image_url: string;
    is_primary: boolean | null;
  }>;
}

interface AnimatedSymbolGridProps {
  symbols: SymbolWithImages[];
  viewMode: string;
  isVisible: boolean;
}

export function AnimatedSymbolGrid({ symbols, viewMode, isVisible }: AnimatedSymbolGridProps) {
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const getGridClasses = () => {
    switch (viewMode) {
      case 'list':
        return 'grid-cols-1 gap-4';
      case 'mosaic':
        return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2';
      default:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className={`grid ${getGridClasses()}`}
    >
      <AnimatePresence mode="popLayout">
        {symbols.map((symbol, index) => (
          <motion.div
            key={symbol.id}
            variants={itemVariants}
            layout
            whileHover={{ 
              scale: 1.03,
              transition: { duration: 0.2 }
            }}
            onHoverStart={() => setHoveredSymbol(symbol.id)}
            onHoverEnd={() => setHoveredSymbol(null)}
          >
            <Link to={`/symbols/${symbol.id}`}>
              <Card className="group relative overflow-hidden bg-gradient-to-br from-background to-muted/30 border-muted/50 hover:border-primary/20 transition-all duration-300 hover:shadow-xl">
                <CardContent className={viewMode === 'list' ? 'p-4 flex gap-4 items-center' : 'p-3'}>
                  {/* Image container */}
                  <div className={`relative overflow-hidden rounded-lg ${
                    viewMode === 'list' ? 'w-16 h-16 flex-shrink-0' :
                    viewMode === 'mosaic' ? 'aspect-square' :
                    'aspect-square mb-3'
                  }`}>
                    {symbol.symbol_images?.[0]?.image_url ? (
                      <motion.img
                        src={symbol.symbol_images[0].image_url}
                        alt={symbol.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                        <Zap className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    )}
                    
                    {/* Hover overlay */}
                    <AnimatePresence>
                      {hoveredSymbol === symbol.id && viewMode !== 'mosaic' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center"
                        >
                          <div className="flex gap-2">
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
                            >
                              <Eye className="h-4 w-4 text-white" />
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
                            >
                              <Heart className="h-4 w-4 text-white" />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Content */}
                  {viewMode !== 'mosaic' && (
                    <div className="flex-1 min-w-0">
                      <motion.h4 
                        className="font-medium text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {symbol.name}
                      </motion.h4>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {symbol.culture}
                        </Badge>
                        {symbol.period && (
                          <Badge variant="secondary" className="text-xs">
                            {symbol.period}
                          </Badge>
                        )}
                      </div>

                      {viewMode === 'list' && symbol.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {symbol.description}
                        </p>
                      )}

                      {symbol.created_at && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(symbol.created_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>

                {/* Floating number indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-primary/80 text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium backdrop-blur-sm"
                >
                  {index + 1}
                </motion.div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
