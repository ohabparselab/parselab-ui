import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "parseui-docs-install-method";
const EVENT = "parseui-docs-install-method";

/**
 * The reader's chosen install flavour ("CDN (JS)" or "npm"), shared by every
 * code-tab group on the site — pick npm once and every example switches.
 * Starts null so the server render and first client render match.
 */
export function useInstallMethod(): [string | null, (label: string) => void] {
  const [method, setMethod] = useState<string | null>(null);

  useEffect(() => {
    try {
      setMethod(localStorage.getItem(STORAGE_KEY));
    } catch {
      /* storage unavailable — keep the default tab */
    }
    const onChange = (event: Event) => setMethod((event as CustomEvent<string>).detail);
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  const choose = useCallback((label: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, label);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent(EVENT, { detail: label }));
  }, []);

  return [method, choose];
}
