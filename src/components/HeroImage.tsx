import React, { useState, useCallback, useRef, useEffect } from 'react';
import meLeft from '/assets/me[normal]_editted.png';
import GlitchLines from "./GlitchLines";

const GLITCH_DURATION = 400;
const NEGATIVE_DURATION = 2000; // 2 seconds

const HeroImage: React.FC = React.memo(() => {
  const [showGlitchLine, setShowGlitchLine] = useState(false);
  const [isNegative, setIsNegative] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const glitchTimeoutRef = useRef<number | null>(null);
  const [glitchActive, setGlitchActive] = useState(false)


  useEffect(() => {
    // Random glitch activation
    const glitchInterval = setInterval(
      () => {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 200)
      },
      3000 + Math.random() * 2000,
    )

    return () => clearInterval(glitchInterval)
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (glitchTimeoutRef.current) {
      clearTimeout(glitchTimeoutRef.current);
      glitchTimeoutRef.current = null;
    }
    setShowGlitchLine(true);
    setIsNegative(false); // Always start with original image
    glitchTimeoutRef.current = window.setTimeout(() => {
      setIsNegative(true);
      setShowGlitchLine(false);
    }, GLITCH_DURATION);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowGlitchLine(false);
    // Keep negative for 2s, then glitch back
    timeoutRef.current = window.setTimeout(() => {
      setShowGlitchLine(true);
      setTimeout(() => {
        setIsNegative(false);
        setShowGlitchLine(false);
      }, GLITCH_DURATION);
    }, NEGATIVE_DURATION);
  }, []);

  const handleTouchStart = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (glitchTimeoutRef.current) {
      clearTimeout(glitchTimeoutRef.current);
      glitchTimeoutRef.current = null;
    }
    setShowGlitchLine(true);
    setIsNegative(false); // Always start with original image
    glitchTimeoutRef.current = window.setTimeout(() => {
      setIsNegative(true);
      setShowGlitchLine(false);
    }, GLITCH_DURATION);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setShowGlitchLine(false);
    // Keep negative for 2s, then glitch back
    timeoutRef.current = window.setTimeout(() => {
      setShowGlitchLine(true);
      setTimeout(() => {
        setIsNegative(false);
        setShowGlitchLine(false);
      }, GLITCH_DURATION);
    }, NEGATIVE_DURATION);
  }, []);

  return (
    <div className="flex-shrink-0 flex items-end justify-center w-full sm:w-4/5 md:w-3/5 lg:w-5/10 h-full p-0 m-0 relative" style={{ marginLeft: '12px', marginBottom: '-100px' }}>
      <img
        src={meLeft}
        alt="Me"
        className={`w-full h-auto max-w-full max-h-full object-contain object-center m-0 p-0 transition duration-200 ${showGlitchLine ? 'glitch' : ''} ${isNegative ? 'negative' : ''} ${glitchActive ? "glitch-image" : ""}`}
        style={{
          borderRadius: 0,
          background: 'none',
          border: 'none'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
      {showGlitchLine && <GlitchLines />}
    </div>
  );
});

export default HeroImage; 