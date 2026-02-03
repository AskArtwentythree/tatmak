"use client";

import { useEffect, useState } from "react";

/**
 * Hook that returns false on server-side and true after mount.
 * Required for Telegram Mini App where SDK is client-only.
 */
export function useDidMount(): boolean {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  return didMount;
}
