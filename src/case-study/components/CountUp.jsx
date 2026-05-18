// Scroll-triggered count-up. The number ticks from 0 → target on the
// first time the element enters view, then stays. Format with a custom
// `format` fn or the built-in `prefix` / `suffix` strings.

import React from 'react';

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

const CountUp = ({
  value,
  duration = 1400,
  format,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) => {
  const ref = React.useRef(null);
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    let started = false;
    const tick = (t0) => {
      const run = (now) => {
        const t = Math.min(1, (now - t0) / duration);
        setDisplay(value * easeOut(t));
        if (t < 1) raf = requestAnimationFrame(run);
      };
      raf = requestAnimationFrame(run);
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            tick(performance.now());
            io.disconnect();
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.2 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  const out = format
    ? format(display)
    : `${prefix}${display.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

  return (
    <span ref={ref} className={className}>
      {out}
    </span>
  );
};

export default CountUp;
