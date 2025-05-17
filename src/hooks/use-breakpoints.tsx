
import * as React from "react"

// Define standard breakpoints
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Hook to check if the current viewport is smaller than a specific breakpoint
 */
export function useBreakpoint(breakpoint: Breakpoint) {
  const [isBelow, setIsBelow] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS[breakpoint] - 1}px)`);
    const onChange = () => {
      setIsBelow(window.innerWidth < BREAKPOINTS[breakpoint]);
    };
    mql.addEventListener("change", onChange);
    setIsBelow(window.innerWidth < BREAKPOINTS[breakpoint]);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return !!isBelow;
}

/**
 * Legacy hook for backward compatibility
 */
export function useIsMobile() {
  return useBreakpoint('md');
}
