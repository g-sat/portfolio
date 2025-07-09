import React, { useMemo } from 'react';

const GLITCH_LINE_COUNT = 15;
const GLITCH_COLORS = [
  'linear-gradient(90deg, #fff 0 30%, #00ffe7 30% 60%, #fff 60% 100%)',
  'linear-gradient(90deg, #ff00ea 0 50%, #fff 50% 100%)',
  'linear-gradient(90deg, #00ffe7 0 50%, #ff00ea 50% 100%)',
  'linear-gradient(90deg, #ff00ea 0 30%, #fff 30% 70%, #00ffe7 70% 100%)',
  'linear-gradient(90deg, #fff 0 40%, #ff00ea 40% 80%, #00ffe7 80% 100%)',
  'linear-gradient(90deg, #00ffe7 0 100%)',
  'linear-gradient(90deg, #ff00ea 0 100%)',
  'linear-gradient(90deg, #fff 0 100%)',
];

const GlitchLines: React.FC = React.memo(() => {
  const lines = useMemo(() => Array.from({ length: GLITCH_LINE_COUNT }, () => {
    const color = GLITCH_COLORS[Math.floor(Math.random() * GLITCH_COLORS.length)] || 'linear-gradient(90deg, #fff 0 100%)';
    return {
      top: Math.random() * 90 + 2 + '%',
      left: Math.random() * 60 + '%',
      width: Math.random() * 15 + 5 + '%',
      height: Math.random() * 2 + 2,
      color,
    };
  }), []);

  return (
    <>
      {lines.map((line, i) => (
        <div
          key={i}
          className="absolute glitch-line z-20"
          style={{
            top: line.top,
            left: line.left,
            width: line.width,
            height: line.height,
            background: line.color,
          }}
        />
      ))}
    </>
  );
});

export default GlitchLines; 