/**
 * Logger utility to manage console logs in production
 * Follows V3 audit recommendations to reduce production noise
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  warn: (...args: unknown[]) => {
    console.warn(...args); // Warnings are always shown
  },
  
  error: (...args: unknown[]) => {
    console.error(...args); // Errors are always shown
  },
  
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
};