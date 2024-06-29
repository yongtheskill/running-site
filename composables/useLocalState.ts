import { useState } from '#app';

/**
 * A wrapper for Nuxt3 `useState` which allows the data
 * to be saved in browser's `localStorage` as JSON.
 * The API is the same as `useState`.
 *
 * @param key A string key
 * @param defaultValue Optional default value of the key
 */
export default function <T>(key: string, defaultValue?: () => T): Ref<T> {
  const state = useState<T>(key, defaultValue);

  // Keep the keys so there are no duplicate watch-ers.
  // The keys also should be only on the client side.
  let keys = ref<string[]>([]);
  if (process.client && localStorage) {
    keys = useState<Array<string>>('useLocalState-watch-keys', () => []);
    const localItem = localStorage.getItem(key);
    if (localItem !== null) {
      state.value = JSON.parse(localItem);
    }
  }

  // Watch only if there are no other watchers
  if (!keys.value.includes(key)) {
    watch(
      () => state.value,
      (newValue) => {
        if (process.client && localStorage) {
          if (newValue === undefined) {
            // clear the state
            keys.value = keys.value.filter((v) => v !== key);
            try {
              localStorage.removeItem(key);
            } catch (e) {}
          } else {
            // set state
            keys.value.push(key);
            try {
              localStorage.setItem(key, JSON.stringify(state.value));
            } catch (e) {}
          }
        }
      }
    );
  }

  return state;
}
