import { useState, useEffect } from 'react';
import './GridOverlay.css';

function GridOverlay() {
  const devGrid = import.meta.env.VITE_DEV_GRID === 'true';
  const [showGrid, setShowGrid] = useState(true);
  const [breakpoint, setBreakpoint] = useState('');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1024) setBreakpoint('Desktop');
      else if (width >= 768) setBreakpoint('Tablet');
      else setBreakpoint('Mobile');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  if (!devGrid || !showGrid) return null;

  return (
    <div className="grid-overlay">
      <div className="grid-info">
        {breakpoint} | {window.innerWidth}x{window.innerHeight}
      </div>
      <div className="grid-lines-x">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="grid-line-x" style={{ left: `${i * 5}%` }}>
            <span>{i * 5}%</span>
          </div>
        ))}
      </div>
      <div className="grid-lines-y">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="grid-line-y" style={{ top: `${i * 5}%` }}>
            <span>{i * 5}%</span>
          </div>
        ))}
      </div>
      <button className="grid-toggle" onClick={() => setShowGrid(false)}>
        Hide Grid
      </button>
    </div>
  );
}

export default GridOverlay;
