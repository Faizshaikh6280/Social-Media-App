import { useEffect, useState } from "react";

export function useDebounce(query: string, delay: number) {
  const [debounceValue, setDebounceValue] = useState("");
  useEffect(
    function () {
      const handler = setTimeout(function () {
        setDebounceValue(query);
      }, delay);
      () => clearTimeout(handler);
    },
    [query, delay]
  );
  return debounceValue;
}
