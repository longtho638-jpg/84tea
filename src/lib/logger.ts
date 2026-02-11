/**
 * Simple logger utility to centralize logging and allow for future expansion.
 * Currently wraps console methods but can be extended to use a logging service.
 */
export const logger = {
  log: (message: string, ...args: unknown[]) => {
    console.log(message, ...args);
  },
  info: (message: string, ...args: unknown[]) => {
    console.info(message, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(message, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(message, ...args);
  },
};
