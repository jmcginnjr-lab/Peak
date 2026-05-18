// IntersectionObserver-driven reveal. Wrap any block and it fades +
// slides up the first time it enters the viewport. Stays revealed on
// subsequent intersections (read-once feel — no jitter on scroll-up).
//
// Use `as` to pick the element tag; defaults to <div>. Extra className
// is appended after `cs-reveal`.

import React from 'react';

const Reveal = ({ as: Tag = 'div', children, className = '', delay = 0, ...rest }) => {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`cs-reveal ${visible ? 'is-in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
