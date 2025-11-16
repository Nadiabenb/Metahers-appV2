
import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(isDevelopment
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
            singleLine: false,
          },
        },
      }
    : {
        // Production: JSON format for log aggregation
        formatters: {
          bindings: (bindings) => {
            return {
              pid: bindings.pid,
              host: bindings.hostname,
            };
          },
        },
      }),
});

// Child logger for specific contexts
export function createChildLogger(context: string | Record<string, any>) {
  if (typeof context === 'string') {
    return logger.child({ context });
  }
  return logger.child(context);
}

// Helper for logging with duration
export function logWithDuration(
  startTime: number,
  level: 'info' | 'warn' | 'error',
  message: string,
  metadata?: Record<string, any>
) {
  const duration = Date.now() - startTime;
  logger[level]({ ...metadata, duration: `${duration}ms` }, message);
}
