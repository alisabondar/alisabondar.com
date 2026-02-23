'use client';

import { useRef, useCallback, useEffect } from 'react';

const MOUSE_TILT_MULTIPLE = 40;
const MAX_TILT_DEG = 5;

export function useTilt(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const x = -(e.clientY - box.y - box.height / 2) / MOUSE_TILT_MULTIPLE;
    const y = (e.clientX - box.x - box.width / 2) / MOUSE_TILT_MULTIPLE;
    const tx = Math.max(-MAX_TILT_DEG, Math.min(MAX_TILT_DEG, x));
    const ty = Math.max(-MAX_TILT_DEG, Math.min(MAX_TILT_DEG, y));
    el.style.transform = `rotateX(${tx}deg) rotateY(${ty}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'rotateX(0) rotateY(0)';
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, handleMouseMove, handleMouseLeave]);

  return {
    ref,
    style: enabled ? { transition: 'transform 0.2s ease-out', willChange: 'transform' as const } : undefined,
  };
}
