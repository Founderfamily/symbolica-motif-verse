type LogLevel = 'info' | 'warning' | 'error' | 'debug';

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

class LogService {
  private static instance: LogService;
  private logs: LogEntry[] = [];
  private consoleEnabled = process.env.NODE_ENV === 'development';
  private persistenceEnabled = true;
  
  private constructor() {
    // Singleton pattern
  }
  
  public static getInstance(): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService();
    }
    return LogService.instance;
  }
  
  public info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }
  
  public warning(message: string, context?: Record<string, any>): void {
    this.log('warning', message, context);
  }
  
  public error(message: string, context?: Record<string, any>): void {
    this.log('error', message, context);
  }
  
  public debug(message: string, context?: Record<string, any>): void {
    if (process.env.NODE_ENV !== 'production') {
      this.log('debug', message, context);
    }
  }
  
  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context
    };
    
    this.logs.push(entry);
    
    if (this.consoleEnabled) {
      this.outputToConsole(entry);
    }
    
    if (this.persistenceEnabled) {
      this.persistToStorage(entry);
    }
  }
  
  private outputToConsole(entry: LogEntry): void {
    const formattedMessage = `[${entry.timestamp.toISOString()}] [${entry.level.toUpperCase()}] ${entry.message}`;
    
    switch (entry.level) {
      case 'info':
        console.info(formattedMessage, entry.context || '');
        break;
      case 'warning':
        console.warn(formattedMessage, entry.context || '');
        break;
      case 'error':
        console.error(formattedMessage, entry.context || '');
        break;
      case 'debug':
        console.debug(formattedMessage, entry.context || '');
        break;
    }
  }
  
  private persistToStorage(entry: LogEntry): void {
    // Keep only the latest 1000 logs to prevent memory issues
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
  }
  
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  public clearLogs(): void {
    this.logs = [];
  }
  
  public enableConsole(): void {
    this.consoleEnabled = true;
  }
  
  public disableConsole(): void {
    this.consoleEnabled = false;
  }
}

export const logger = LogService.getInstance();
