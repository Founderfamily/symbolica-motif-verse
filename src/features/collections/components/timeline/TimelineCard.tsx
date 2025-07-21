import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ImageIcon } from "lucide-react";

interface TimelineCardProps {
  id: string;
  title: string;
  description?: string;
  year: number;
  period: string;
  culture?: string;
  image_url?: string;
  position?: number;
  type: 'symbol' | 'event';
  isLeft?: boolean;
}

export function TimelineCard({ 
  title, 
  description, 
  year, 
  period, 
  culture, 
  image_url, 
  position, 
  type,
  isLeft = false 
}: TimelineCardProps) {
  const yearDisplay = year > 0 ? `${year}` : `${Math.abs(year)} av. J.-C.`;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`flex ${isLeft ? 'justify-start' : 'justify-end'} mb-8`}
    >
      <Card className={`
        relative max-w-sm w-full p-4 
        ${type === 'symbol' ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20' : 'bg-gradient-to-br from-muted/30 to-muted/50'}
        hover:shadow-lg transition-all duration-300
        ${isLeft ? 'mr-8' : 'ml-8'}
      `}>
        {/* Type Badge */}
        <Badge 
          variant={type === 'symbol' ? 'default' : 'secondary'} 
          className="absolute -top-2 -right-2 text-xs"
        >
          {type === 'symbol' ? `#${position}` : 'Événement'}
        </Badge>

        <div className="space-y-3">
          {/* Image Header */}
          {image_url && (
            <div className="w-full h-20 rounded-md overflow-hidden bg-muted/50">
              <img 
                src={image_url} 
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Title */}
          <div>
            <h3 className="font-bold text-base leading-tight mb-1 line-clamp-2">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className="space-y-2">
            {/* Year */}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium text-primary">{yearDisplay}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground text-xs">{period}</span>
            </div>
            
            {/* Culture */}
            {culture && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground text-xs line-clamp-1">{culture}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}