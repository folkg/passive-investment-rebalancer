import { useState, useEffect } from "react";

function useLocalStorageToggleState(key, initialValue = false) {
  // Retrieve the existing property from local storage if it exists
  // otherwise, use the provided initialValue
  const [value, setValue] = useState(
    JSON.parse(window.localStorage.getItem(key)) || initialValue
  );

  const toggle = () => {
    setValue(!value);
  };

  // update local storage anytime the 'state' changes
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, toggle];
}

export default useLocalStorageToggleState;
