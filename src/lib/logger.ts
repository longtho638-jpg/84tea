/**
 * Simple logger utility to centralize logging and allow for future expansion.
 * Currently wraps console methods but can be extended to use a logging service.
 * In production, debug/info output is suppressed to avoid leaking internals.
 */
const isProd = process.env.NODE_ENV === 'production';

export const logger = {
  log: (message: string, ...args: unknown[]) => {
    if (!isProd) console.log(message, ...args);
  },
  info: (message: string, ...args: unknown[]) => {
    if (!isProd) console.info(message, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(message, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(message, ...args);
  },
};
