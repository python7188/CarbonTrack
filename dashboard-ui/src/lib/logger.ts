export const logger = {
  error: (...args: any[]) => {
    if (!import.meta.env.PROD) {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (!import.meta.env.PROD) {
      console.warn(...args);
    }
  },
  info: (...args: any[]) => {
    if (!import.meta.env.PROD) {
      console.info(...args);
    }
  },
  log: (...args: any[]) => {
    if (!import.meta.env.PROD) {
      console.log(...args);
    }
  }
};
