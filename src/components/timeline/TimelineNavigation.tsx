
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimelinePeriod {
  id: string;
  name: string;
  dateRange: string;
  color: string;
  subPeriods: any[];
}

interface TimelineNavigationProps {
  periods: TimelinePeriod[];
  selectedPeriod: number;
  onPeriodChange: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function TimelineNavigation({ 
  periods, 
  selectedPeriod, 
  onPeriodChange, 
  onNext, 
  onPrev 
}: TimelineNavigationProps) {
  return (
    <div className="relative mb-8">
      <div className="flex items-center justify-between">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" size="icon" onClick={onPrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </motion.div>
        
        <div className="flex-1 mx-4">
          <div className="flex justify-between items-center relative">
            {periods.map((period, index) => (
              <motion.button
                key={period.id}
                className={`flex flex-col items-center p-4 rounded-xl transition-all relative ${
                  index === selectedPeriod 
                    ? 'bg-primary/10 text-primary shadow-lg' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                onClick={() => onPeriodChange(index)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Progress indicator */}
                <motion.div 
                  className={`w-5 h-5 rounded-full mb-3 relative ${
                    index === selectedPeriod ? 'bg-primary' : 'bg-muted'
                  }`}
                  whileHover={{ scale: 1.2 }}
                >
                  {index === selectedPeriod && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary"
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  {/* Pulse effect for current period */}
                  {index === selectedPeriod && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary/30"
                      animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                <span className="text-sm font-medium mb-1">{period.name}</span>
                <span className="text-xs text-muted-foreground mb-2">{period.dateRange}</span>
                
                {/* Sub-periods indicator */}
                {period.subPeriods.length > 0 && (
                  <motion.div
                    className="flex items-center gap-1"
                    whileHover={{ scale: 1.1 }}
                  >
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {period.subPeriods.length} sous-périodes
                    </span>
                  </motion.div>
                )}

                {/* Connecting line */}
                {index < periods.length - 1 && (
                  <div className="absolute top-6 left-full w-full h-0.5 bg-muted -z-10" />
                )}
              </motion.button>
            ))}
            
            {/* Animated progress line */}
            <motion.div 
              className="absolute top-8 left-0 w-full h-1 bg-muted -z-10 rounded-full overflow-hidden"
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${((selectedPeriod + 1) / periods.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </motion.div>
          </div>
        </div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" size="icon" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
