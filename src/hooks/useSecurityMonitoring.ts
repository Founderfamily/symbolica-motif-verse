
import { useState, useEffect } from 'react';
import { SecurityUtils } from '@/utils/securityUtils';

interface SecurityEvent {
  type: 'rate_limit' | 'invalid_input' | 'auth_failure' | 'file_upload';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: Date;
}

export const useSecurityMonitoring = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const logSecurityEvent = (event: Omit<SecurityEvent, 'timestamp'>) => {
    const newEvent: SecurityEvent = {
      ...event,
      timestamp: new Date()
    };
    
    setEvents(prev => [newEvent, ...prev.slice(0, 99)]); // Keep last 100 events
    
    // Store in session for analysis
    SecurityUtils.setSecureSessionData('security_events', events, 60);
    
    console.warn(`[SECURITY] ${event.severity.toUpperCase()}: ${event.message}`);
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    
    // Monitor for suspicious activity patterns
    const interval = setInterval(() => {
      const recentEvents = events.filter(
        event => Date.now() - event.timestamp.getTime() < 300000 // Last 5 minutes
      );
      
      // Check for rate limiting patterns
      const rateLimitEvents = recentEvents.filter(e => e.type === 'rate_limit');
      if (rateLimitEvents.length > 5) {
        logSecurityEvent({
          type: 'rate_limit',
          severity: 'high',
          message: 'Multiple rate limit violations detected'
        });
      }
      
      // Check for authentication failures
      const authFailures = recentEvents.filter(e => e.type === 'auth_failure');
      if (authFailures.length > 3) {
        logSecurityEvent({
          type: 'auth_failure',
          severity: 'high',
          message: 'Multiple authentication failures detected'
        });
      }
    }, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
    };
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  const getSecurityMetrics = () => {
    const now = Date.now();
    const lastHour = events.filter(e => now - e.timestamp.getTime() < 3600000);
    const lastDay = events.filter(e => now - e.timestamp.getTime() < 86400000);
    
    return {
      eventsLastHour: lastHour.length,
      eventsLastDay: lastDay.length,
      highSeverityEvents: events.filter(e => e.severity === 'high').length,
      mostCommonType: events.reduce((acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  };

  useEffect(() => {
    // Load previous events from session
    const storedEvents = SecurityUtils.getSecureSessionData('security_events');
    if (storedEvents && Array.isArray(storedEvents)) {
      setEvents(storedEvents);
    }
  }, []);

  return {
    events,
    isMonitoring,
    logSecurityEvent,
    startMonitoring,
    stopMonitoring,
    getSecurityMetrics
  };
};
