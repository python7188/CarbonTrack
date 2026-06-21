export const logger = {
  error: (...args: unknown[]) => {
    if (!import.meta.env.PROD) {
      console.error(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (!import.meta.env.PROD) {
      console.warn(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (!import.meta.env.PROD) {
      console.info(...args);
    }
  },
  log: (...args: unknown[]) => {
    if (!import.meta.env.PROD) {
      console.log(...args);
    }
  }
};
