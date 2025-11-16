
const isDevelopment = import.meta.env.DEV;

interface LogData {
  level: 'error' | 'warn' | 'info';
  message: string;
  context?: Record<string, any>;
  error?: Error;
  timestamp: string;
}

class ClientLogger {
  private queue: LogData[] = [];
  private flushInterval: number | null = null;

  constructor() {
    // In production, flush logs every 10 seconds
    if (!isDevelopment) {
      this.flushInterval = window.setInterval(() => this.flush(), 10000);
    }

    // Flush logs before page unload
    window.addEventListener('beforeunload', () => this.flush());
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    const logData: LogData = {
      level: 'error',
      message,
      context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } as any : undefined,
      timestamp: new Date().toISOString(),
    };

    if (isDevelopment) {
      console.error(`[${logData.timestamp}]`, message, error, context);
    } else {
      this.queue.push(logData);
      // Flush immediately for errors
      this.flush();
    }
  }

  warn(message: string, context?: Record<string, any>) {
    const logData: LogData = {
      level: 'warn',
      message,
      context,
      timestamp: new Date().toISOString(),
    };

    if (isDevelopment) {
      console.warn(`[${logData.timestamp}]`, message, context);
    } else {
      this.queue.push(logData);
    }
  }

  info(message: string, context?: Record<string, any>) {
    const logData: LogData = {
      level: 'info',
      message,
      context,
      timestamp: new Date().toISOString(),
    };

    if (isDevelopment) {
      console.log(`[${logData.timestamp}]`, message, context);
    }
    // Don't send info logs to server
  }

  private async flush() {
    if (this.queue.length === 0) return;

    const logs = [...this.queue];
    this.queue = [];

    try {
      await fetch('/api/logs/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs }),
        credentials: 'include',
      });
    } catch (error) {
      // Failed to send logs, re-queue them
      this.queue.unshift(...logs);
      console.error('Failed to send client logs:', error);
    }
  }
}

export const logger = new ClientLogger();

// Global error handler
window.addEventListener('error', (event) => {
  logger.error('Uncaught error', event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection', event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
});
