import { motion } from "framer-motion";
import { TimelineCard } from "./TimelineCard";

interface TimelineItemProps {
  id: string;
  title: string;
  description?: string;
  year: number;
  period: string;
  culture?: string;
  image_url?: string;
  position?: number;
  type: 'symbol' | 'event';
  index: number;
}

export function TimelineItem(props: TimelineItemProps) {
  const isLeft = props.index % 2 === 0;
  const yearDisplay = props.year > 0 ? `${props.year}` : `${Math.abs(props.year)} av. J.-C.`;

  return (
    <div className="relative flex items-center justify-center">
      {/* Timeline Point */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: props.index * 0.05 }}
        className="absolute z-10 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg"
      />
      
      {/* Year Label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: props.index * 0.05 }}
        className="absolute z-20 -bottom-8 bg-background border border-muted rounded-full px-3 py-1 text-xs font-medium text-primary shadow-sm"
      >
        {yearDisplay}
      </motion.div>

      {/* Connection Line */}
      <div 
        className={`absolute w-16 h-0.5 bg-primary/30 ${
          isLeft ? '-left-16' : '-right-16'
        }`}
      />

      {/* Card */}
      <div className={`${isLeft ? '-ml-16' : '-mr-16'} w-full max-w-xs`}>
        <TimelineCard {...props} isLeft={isLeft} />
      </div>
    </div>
  );
}