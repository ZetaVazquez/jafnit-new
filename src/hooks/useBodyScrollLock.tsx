import { useEffect } from 'react';

/** Bloquea el scroll de la página de fondo mientras `locked` sea true. */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const body = document.body;
    const prev = [html.style.overflow, body.style.overflow];
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev[0];
      body.style.overflow = prev[1];
    };
  }, [locked]);
}

export const ScrollLock = () => {
  useBodyScrollLock(true);
  return null;
};
