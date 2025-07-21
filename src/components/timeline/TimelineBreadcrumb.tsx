
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  id: string;
  name: string;
  onClick: () => void;
}

interface TimelineBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function TimelineBreadcrumb({ items }: TimelineBreadcrumbProps) {
  if (items.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 mb-6 p-3 bg-muted/50 rounded-lg">
      <Home className="h-4 w-4 text-muted-foreground" />
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          <Button
            variant={index === items.length - 1 ? "default" : "ghost"}
            size="sm"
            onClick={item.onClick}
            disabled={index === items.length - 1}
          >
            {item.name}
          </Button>
        </React.Fragment>
      ))}
    </div>
  );
}
