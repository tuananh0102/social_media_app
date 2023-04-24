import { useEffect, useState } from "react";

export default function useDebound(value, delay) {
  const [debound, setDebound] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebound(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value]);

  return debound;
}
