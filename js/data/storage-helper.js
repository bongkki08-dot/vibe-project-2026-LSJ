const STORAGE_DELAY_MS = 100;

function delay() {
  return new Promise((resolve) => window.setTimeout(resolve, STORAGE_DELAY_MS));
}

export const storageHelper = {
  get: async (key, defaultValue) => {
    await delay();
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) return defaultValue;

    try {
      return JSON.parse(storedValue);
    } catch (error) {
      throw new Error(`Unable to parse local data for "${key}".`, { cause: error });
    }
  },

  has: async (key) => {
    await delay();
    return window.localStorage.getItem(key) !== null;
  },

  set: async (key, value) => {
    await delay();
    window.localStorage.setItem(key, JSON.stringify(value));
  },
};
