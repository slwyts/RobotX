'use client';

import { useState, useEffect } from 'react';

interface CountUpProps {
  target: number;
  prefix?: string;
  suffix?: string;
  active: boolean;
}

export default function CountUp({ target, prefix = '', suffix = '', active }: CountUpProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [active, target]);

  return (
    <span>
      {prefix}
      {(active ? count : 0).toLocaleString()}
      {suffix}
    </span>
  );
}
