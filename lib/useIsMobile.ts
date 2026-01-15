import { useEffect, useState } from "react";

const DEFAULT_MOBILE_BREAKPOINT_PX = 640;

export function useIsMobile(breakpointPx: number = DEFAULT_MOBILE_BREAKPOINT_PX) {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${breakpointPx - 1}px)`).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${breakpointPx - 1}px)`
    );

    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    }

    mediaQuery.addListener(onChange);
    return () => mediaQuery.removeListener(onChange);
  }, [breakpointPx]);

  return isMobile;
}
