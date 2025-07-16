import * as React from "react";
import { Shield, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type VerificationStatus } from "@/hooks/useSymbolVerification";

interface VerificationBadgeProps {
  status: VerificationStatus;
  confidence?: number;
  verificationCount?: number;
  className?: string;
  showText?: boolean;
}

const statusConfig = {
  verified: {
    icon: ShieldCheck,
    color: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
    darkColor: "dark:bg-green-900 dark:text-green-300 dark:border-green-800",
    label: "Vérifié par IA",
    description: "Ce symbole a été vérifié par plusieurs IA avec une confiance élevée"
  },
  uncertain: {
    icon: ShieldAlert,
    color: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
    darkColor: "dark:bg-orange-900 dark:text-orange-300 dark:border-orange-800",
    label: "Incertain",
    description: "Les vérifications IA montrent des résultats mitigés ou une confiance modérée"
  },
  unverified: {
    icon: ShieldX,
    color: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
    darkColor: "dark:bg-red-900 dark:text-red-300 dark:border-red-800",
    label: "Non vérifié",
    description: "Ce symbole n'a pas été vérifié ou les IA ont une faible confiance"
  }
};

export function VerificationBadge({
  status,
  confidence,
  verificationCount = 0,
  className,
  showText = false
}: VerificationBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const tooltipContent = (
    <div className="text-center">
      <div className="font-semibold">{config.label}</div>
      <div className="text-sm opacity-90 mt-1">{config.description}</div>
      {confidence !== undefined && (
        <div className="text-xs mt-2">
          Confiance moyenne: {confidence}%
        </div>
      )}
      {verificationCount > 0 && (
        <div className="text-xs">
          {verificationCount} vérification{verificationCount > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );

  const badge = (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1 text-xs transition-colors",
        config.color,
        config.darkColor,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {showText && <span>{config.label}</span>}
    </Badge>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}