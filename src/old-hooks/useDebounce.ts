"use client";

import { useEffect } from "react";

const useDebounce = (effect: any, delay: number, deps: any) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
};

export default useDebounce;
