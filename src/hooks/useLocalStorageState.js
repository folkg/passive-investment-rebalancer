import { useState, useEffect } from "react";

function useLocalStorageState(key, defaultValue) {
  // This function will intercept the 'key' and sync it to local storage anytime 'value' is changed
  // Set initial 'value' to what we retrieve from local storage @key, or use 'defaultValue' if nothing there
  const [value, setValue] = useState(() => {
    let value;
    try {
      value = JSON.parse(
        window.localStorage.getItem(key) || String(defaultValue)
      );
    } catch (e) {
      value = defaultValue;
    }
    return value;
  });

  // update local storage anytime the 'value' changes
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}

export { useLocalStorageState };
