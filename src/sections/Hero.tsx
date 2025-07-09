import { useRef } from 'react';
import HeroImage from '../components/HeroImage';
import HeroText from '../components/HeroText';
import Marquee from '../components/Marquee';

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section ref={heroRef} className="relative flex items-center justify-center h-screen top-0 w-full bg-black overflow-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0">
          {/* Primary Grid - Cyan */}
          <div
            className="absolute inset-0 opacity-45"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 255, 0.25) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.25) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
              animation: "gridPulse 4s ease-in-out infinite",
            }}
          />

          {/* Secondary Grid - Magenta */}
          <div
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 0, 255, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 0, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
              animation: "gridPulse 6s ease-in-out infinite reverse",
            }}
          />

          {/* Tertiary Grid - Neon Green */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 0, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 0, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
              animation: "gridPulse 3s ease-in-out infinite",
            }}
          />

          {/* Quaternary Grid - Electric Blue */}
          <div
            className="absolute inset-0 opacity-28"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 150, 255, 0.25) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 150, 255, 0.25) 1px, transparent 1px)
              `,
              backgroundSize: "120px 120px",
              animation: "gridPulse 8s ease-in-out infinite reverse",
            }}
          />

          {/* Scan Lines - Enhanced */}
          <div className="absolute inset-0 opacity-60">
            <div className="scan-lines-enhanced" />
          </div>

          {/* Digital Noise - Enhanced */}
          <div className="absolute inset-0 opacity-10">
            <div className="digital-noise-enhanced" />
          </div>

          {/* Holographic Overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="holographic-overlay" />
          </div>
        </div>


      {/* Cyberpunk SVG Background - Subtle Watermark */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none opacity-30">
        <svg viewBox="0 0 375 375" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <filter id="black-glow" x="-50" y="-50" width="475" height="475" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="20" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#black-glow)">
            <path d="M 371.097656 67.074219 L 371.097656 67.023438 C 371.097656 36.707031 346.640625 12.078125 316.332031 12.078125 L 130.511719 12.078125 L 130.511719 116.742188 L 364.21875 350.449219 L 364.21875 105.671875 L 250.773438 105.671875 L 309.226562 164.230469 L 309.226562 217.894531 L 185.507812 94.019531 L 185.507812 67.074219 Z" fill="#00ffff" fillOpacity="0.3"/>
            <path d="M 58.335938 67.074219 L 94.027344 67.074219 L 94.027344 12.078125 L 58.378906 12.078125 C 28.070312 12.078125 3.613281 36.652344 3.613281 66.964844 L 3.613281 114.003906 L 197.257812 307.921875 L 58.335938 307.921875 L 58.335938 268 L 97.007812 268 L 38.0625 208.929688 L 3.613281 174.363281 L 3.613281 307.839844 C 3.613281 338.144531 28.070312 362.632812 58.378906 362.632812 L 329.710938 362.632812 L 58.335938 91.273438 Z" fill="#00ffff" fillOpacity="0.25"/>
            <path d="M -108.886719 371.335938 L 3.613281 371.335938 L 3.613281 483.835938 L -108.886719 483.835938 Z" fill="#00ffff" fillOpacity="0.2"/>
          </g>
        </svg>
      </div>
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full h-full max-w-6xl gap-6 lg:gap-10 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 animate-pulse" />
        <div className="w-full flex flex-col items-center absolute top-10 left-0 z-20">
          <h1 className="font-m1 italic text-7xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-500 drop-shadow-lg text-center">
            Sathwik Garikapati
          </h1>
        </div>
        <HeroImage />
        <HeroText />
      </div>
      {/* Marquee at the bottom */}
      <Marquee />
    </section>
  );
};

export default Hero; 