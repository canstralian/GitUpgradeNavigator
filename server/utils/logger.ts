
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: Record<string, any>;
}

class Logger {
  private logLevel: LogLevel;

  constructor() {
    this.logLevel = process.env.LOG_LEVEL as LogLevel || LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    return levels.indexOf(level) <= levels.indexOf(this.logLevel);
  }

  private formatLog(level: LogLevel, message: string, meta?: Record<string, any>): string {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(meta && { meta })
    };

    return JSON.stringify(entry);
  }

  error(message: string, meta?: Record<string, any>) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatLog(LogLevel.ERROR, message, meta));
    }
  }

  warn(message: string, meta?: Record<string, any>) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatLog(LogLevel.WARN, message, meta));
    }
  }

  info(message: string, meta?: Record<string, any>) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.formatLog(LogLevel.INFO, message, meta));
    }
  }

  debug(message: string, meta?: Record<string, any>) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatLog(LogLevel.DEBUG, message, meta));
    }
  }
}

export const logger = new Logger();
