// TopBar — hair-thin scroll progress bar pinned at the top of the
// viewport. No chrome, no logo, no jump links: the case study reads
// top-to-bottom and the progress bar is the only reading-flow cue.

import React from 'react';

const TopBar = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const compute = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, []);

  return (
    <div
      className="cs-progress"
      style={{ '--p': progress }}
      aria-hidden="true"
    />
  );
};

export default TopBar;
