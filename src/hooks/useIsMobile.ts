import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT_PX = 768;

const detect = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    window.innerWidth < MOBILE_BREAKPOINT_PX
    || window.matchMedia('(pointer: coarse)').matches
  );
};

/**
 * True when the viewport is below 768px OR the primary input is a coarse
 * pointer (touch). Used to gate R3F off mobile per CLAUDE.md §5.
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(detect);

  useEffect(() => {
    const update = () => setIsMobile(detect());
    window.addEventListener('resize', update);
    const mql = window.matchMedia('(pointer: coarse)');
    mql.addEventListener('change', update);
    return () => {
      window.removeEventListener('resize', update);
      mql.removeEventListener('change', update);
    };
  }, []);

  return isMobile;
};
