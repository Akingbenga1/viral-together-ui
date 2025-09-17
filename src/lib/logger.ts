/**
 * Logger utility for UI application
 * Logs API calls, requests, responses, errors, and console logs to app.log file
 */

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  category: 'API' | 'CONSOLE' | 'ERROR' | 'GENERAL';
  message: string;
  data?: any;
  url?: string;
  method?: string;
  status?: number;
  duration?: number;
}

class UILogger {
  private logQueue: LogEntry[] = [];
  private isProcessing = false;
  private maxQueueSize = 100;

  constructor() {
    // Initialize logging
    this.setupConsoleLogging();
    // Only setup error handling in browser environment
    if (typeof window !== 'undefined') {
      this.setupErrorHandling();
    }
    this.startLogProcessor();
  }

  /**
   * Log API request
   */
  logApiRequest(method: string, url: string, data?: any): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      category: 'API',
      message: `API Request: ${method} ${url}`,
      method,
      url,
      data: this.sanitizeData(data)
    };
    this.addToQueue(logEntry);
  }

  /**
   * Log API response
   */
  logApiResponse(method: string, url: string, status: number, data?: any, duration?: number): void {
    const level = status >= 400 ? 'ERROR' : 'INFO';
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category: 'API',
      message: `API Response: ${method} ${url} - ${status}`,
      method,
      url,
      status,
      duration,
      data: this.sanitizeData(data)
    };
    this.addToQueue(logEntry);
  }

  /**
   * Log API error
   */
  logApiError(method: string, url: string, error: any, duration?: number): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      category: 'API',
      message: `API Error: ${method} ${url} - ${error.message || 'Unknown error'}`,
      method,
      url,
      duration,
      data: this.sanitizeData(error)
    };
    this.addToQueue(logEntry);
  }

  /**
   * Log general information
   */
  logInfo(message: string, data?: any): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      category: 'GENERAL',
      message,
      data: this.sanitizeData(data)
    };
    this.addToQueue(logEntry);
  }

  /**
   * Log warning
   */
  logWarn(message: string, data?: any): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'WARN',
      category: 'GENERAL',
      message,
      data: this.sanitizeData(data)
    };
    this.addToQueue(logEntry);
  }

  /**
   * Log error
   */
  logError(message: string, error?: any): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      category: 'ERROR',
      message,
      data: this.sanitizeData(error)
    };
    this.addToQueue(logEntry);
  }

  /**
   * Log debug information
   */
  logDebug(message: string, data?: any): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'DEBUG',
      category: 'GENERAL',
      message,
      data: this.sanitizeData(data)
    };
    this.addToQueue(logEntry);
  }

  /**
   * Setup console logging override
   */
  private setupConsoleLogging(): void {
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug
    };

    // Override console methods
    console.log = (...args: any[]) => {
      originalConsole.log(...args);
      this.logConsole('INFO', args);
    };

    console.warn = (...args: any[]) => {
      originalConsole.warn(...args);
      this.logConsole('WARN', args);
    };

    console.error = (...args: any[]) => {
      originalConsole.error(...args);
      this.logConsole('ERROR', args);
    };

    console.info = (...args: any[]) => {
      originalConsole.info(...args);
      this.logConsole('INFO', args);
    };

    console.debug = (...args: any[]) => {
      originalConsole.debug(...args);
      this.logConsole('DEBUG', args);
    };
  }

  /**
   * Log console output
   */
  private logConsole(level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', args: any[]): void {
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category: 'CONSOLE',
      message: `Console ${level}: ${message}`,
      data: args.length > 1 ? args : undefined
    };
    this.addToQueue(logEntry);
  }

  /**
   * Setup global error handling (browser only)
   */
  private setupErrorHandling(): void {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', event.reason);
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.logError('Global Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });
  }

  /**
   * Add log entry to queue
   */
  private addToQueue(logEntry: LogEntry): void {
    this.logQueue.push(logEntry);
    
    // Prevent queue from growing too large
    if (this.logQueue.length > this.maxQueueSize) {
      this.logQueue.shift();
    }
  }

  /**
   * Start log processor
   */
  private startLogProcessor(): void {
    // Process logs every 2 seconds
    setInterval(() => {
      this.processLogQueue();
    }, 2000);
  }

  /**
   * Process log queue and write to file
   */
  private async processLogQueue(): Promise<void> {
    if (this.isProcessing || this.logQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const logsToProcess = [...this.logQueue];
    this.logQueue = [];

    try {
      await this.writeLogsToFile(logsToProcess);
    } catch (error) {
      // If writing fails, put logs back in queue (except the oldest ones to prevent memory issues)
      this.logQueue.unshift(...logsToProcess.slice(-50));
      console.error('Failed to write logs to file:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Write logs to file via API endpoint
   */
  private async writeLogsToFile(logs: LogEntry[]): Promise<void> {
    try {
      // Send each log entry to the API endpoint
      for (const log of logs) {
        await this.sendLogToFile(log);
      }
    } catch (error) {
      console.error('Failed to write logs to file:', error);
    }
  }

  /**
   * Send log entry to file via API endpoint (browser only)
   */
  private async sendLogToFile(log: LogEntry): Promise<void> {
    // Only send logs in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const response = await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log),
      });

      if (!response.ok) {
        throw new Error(`Failed to write log: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send log to file:', error);
      // Don't throw error to prevent infinite retry loops
    }
  }


  /**
   * Format log entry for file output
   */
  private formatLogEntry(log: LogEntry): string {
    const timestamp = log.timestamp;
    const level = log.level.padEnd(5);
    const category = log.category.padEnd(8);
    const message = log.message;
    
    let formattedLog = `${timestamp} - ${level} - ${category} - ${message}`;
    
    if (log.method && log.url) {
      formattedLog += ` | ${log.method} ${log.url}`;
    }
    
    if (log.status) {
      formattedLog += ` | Status: ${log.status}`;
    }
    
    if (log.duration) {
      formattedLog += ` | Duration: ${log.duration}ms`;
    }
    
    if (log.data) {
      formattedLog += ` | Data: ${JSON.stringify(log.data, null, 2)}`;
    }
    
    return formattedLog;
  }

  /**
   * Sanitize data to remove sensitive information
   */
  private sanitizeData(data: any): any {
    if (!data) return data;
    
    const sensitiveKeys = ['password', 'token', 'authorization', 'secret', 'key', 'auth'];
    const sanitized = JSON.parse(JSON.stringify(data));
    
    const sanitizeObject = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      }
      
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
          result[key] = '[REDACTED]';
        } else {
          result[key] = sanitizeObject(value);
        }
      }
      return result;
    };
    
    return sanitizeObject(sanitized);
  }

  /**
   * Get current logs from file (placeholder - would need server-side implementation)
   */
  getLogs(): string {
    return 'Logs are now streamed directly to app.log file. Use the log manager script to view logs.';
  }

  /**
   * Clear logs from file (placeholder - would need server-side implementation)
   */
  clearLogs(): void {
    console.log('Use the log manager script to clear logs: node scripts/log-manager.js clear');
  }
}

// Create singleton instance
export const uiLogger = new UILogger();

// Export for use in other modules
export default uiLogger;
