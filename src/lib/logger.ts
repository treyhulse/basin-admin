export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  userId?: string;
  tenantId?: string;
  sessionId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  userAgent?: string;
  ip?: string;
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
  data?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logLevel: LogLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'info';

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return levels[level] >= levels[this.logLevel];
  }

  private formatLog(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const level = entry.level.toUpperCase().padEnd(5);
    const contextStr = entry.context ? ` [${JSON.stringify(entry.context)}]` : '';
    const errorStr = entry.error ? `\nError: ${entry.error.stack || entry.error.message}` : '';
    const dataStr = entry.data ? `\nData: ${JSON.stringify(entry.data, null, 2)}` : '';
    
    return `${timestamp} ${level} ${entry.message}${contextStr}${errorStr}${dataStr}`;
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error, data?: any) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
      data,
    };

    const formattedLog = this.formatLog(entry);

    // In development, log to console with colors
    if (this.isDevelopment) {
      const colors = {
        debug: 'color: #6B7280',
        info: 'color: #3B82F6',
        warn: 'color: #F59E0B',
        error: 'color: #EF4444',
      };
      
      console.log(`%c${formattedLog}`, colors[level]);
    } else {
      // In production, you might want to send to a logging service
      console.log(formattedLog);
    }

    // Store logs in localStorage for debugging (limited to last 100 entries)
    this.storeLog(entry);
  }

  private storeLog(entry: LogEntry) {
    try {
      const logs = this.getStoredLogs();
      logs.push(entry);
      
      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (error) {
      // Silently fail if localStorage is not available
    }
  }

  public getStoredLogs(): LogEntry[] {
    try {
      const logs = localStorage.getItem('app_logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  public clearStoredLogs() {
    try {
      localStorage.removeItem('app_logs');
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  public debug(message: string, context?: LogContext, data?: any) {
    this.log('debug', message, context, undefined, data);
  }

  public info(message: string, context?: LogContext, data?: any) {
    this.log('info', message, context, undefined, data);
  }

  public warn(message: string, context?: LogContext, error?: Error, data?: any) {
    this.log('warn', message, context, error, data);
  }

  public error(message: string, context?: LogContext, error?: Error, data?: any) {
    this.log('error', message, context, error, data);
  }

  // Specialized logging methods
  public auth(message: string, context?: LogContext, data?: any) {
    this.info(`[AUTH] ${message}`, context, data);
  }

  public api(message: string, context?: LogContext, data?: any) {
    this.info(`[API] ${message}`, context, data);
  }

  public database(message: string, context?: LogContext, data?: any) {
    this.info(`[DB] ${message}`, context, data);
  }

  public security(message: string, context?: LogContext, data?: any) {
    this.warn(`[SECURITY] ${message}`, undefined, undefined, data);
  }

  public performance(message: string, context?: LogContext, data?: any) {
    this.info(`[PERF] ${message}`, context, data);
  }
}

// Create a singleton instance
export const logger = new Logger();

// Helper functions for common logging patterns
export const logAuth = (message: string, context?: LogContext, data?: any) => {
  logger.auth(message, context, data);
};

export const logApi = (message: string, context?: LogContext, data?: any) => {
  logger.api(message, context, data);
};

export const logDatabase = (message: string, context?: LogContext, data?: any) => {
  logger.database(message, context, data);
};

export const logSecurity = (message: string, context?: LogContext, data?: any) => {
  logger.security(message, context, data);
};

export const logPerformance = (message: string, context?: LogContext, data?: any) => {
  logger.performance(message, context, data);
};

export default logger;
