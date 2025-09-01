import { injectable } from 'tsyringe';
import pino from 'pino';
import type { LoggerPort } from '../../shared/ports/LoggerPort';

@injectable()
export class PinoLogger implements LoggerPort {
  private readonly logger: pino.Logger;

  constructor() {
    this.logger = pino({
      level: process.env['LOG_LEVEL'] || 'info',
      formatters: {
        level: (label) => {
          return { level: label.toUpperCase() };
        },
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    });
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(meta, message);
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(meta, message);
  }

  public error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    const errorMeta = error ? { error: error.message, stack: error.stack } : {};
    this.logger.error({ ...meta, ...errorMeta }, message);
  }

  public debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(meta, message);
  }
}
