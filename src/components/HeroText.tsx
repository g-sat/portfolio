// import { useEffect, useState } from "react"


const HeroText = () => {
  // const [glitchActive, setGlitchActive] = useState(false)


  // useEffect(() => {
  //   // Random glitch activation
  //   const glitchInterval = setInterval(
  //     () => {
  //       setGlitchActive(true)
  //       setTimeout(() => setGlitchActive(false), 200)
  //     },
  //     3000 + Math.random() * 2000,
  //   )

  //   return () => clearInterval(glitchInterval)
  // }, [])
  return (
    <div className={`flex flex-col items-center lg:items-start justify-center w-full lg:w-1/2 text-center lg:text-left space-y-6 lg:space-y-8 relative`}>
      <div className="relative w-full flex flex-col items-center justify-center min-h-[150px] sm:min-h-[200px] lg:min-h-[300px] pt-6 lg:pt-100">
        
        <p className="text-lg sm:text-xl lg:text-2xl text-pink-400 text-center w-full mt-4 font-semibold drop-shadow-[0_0_10px_#ff00ea]">
          Crafting digital dreams in neon and code.
        </p>
      </div>
      <p className="text-base sm:text-lg lg:text-2xl text-cyan-200 max-w-2xl drop-shadow-[0_0_10px_#00ffe7]">
        Dive into a world of black, neon, and digital dreams. Explore my work where technology meets art.
      </p>
      <button className="px-6 sm:px-8 py-3 sm:py-4 bg-black bg-opacity-80 border-2 border-cyan-400 text-cyan-200 font-bold text-base sm:text-lg rounded-full shadow-lg hover:shadow-cyan-400/80 hover:scale-105 transition-all duration-300 neon-btn relative overflow-hidden">
        <span className="relative z-10">Explore Now</span>
        <span className="absolute inset-0 pointer-events-none animate-neon-btn-glow" />
      </button>
      <style>{`
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            opacity: 1;
            filter: drop-shadow(0 0 16px #ff00ea) drop-shadow(0 0 32px #00f0ff);
          }
          20%, 22%, 24%, 55% {
            opacity: 0.7;
            filter: drop-shadow(0 0 8px #ff00ea) drop-shadow(0 0 16px #00f0ff);
          }
        }
        .cyberpunk-hero {
          letter-spacing: 0.05em;
        }
        .neon-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          box-shadow: 0 0 24px 8px #00ffe7, 0 0 48px 16px #ff00ea;
          opacity: 0.5;
          z-index: 1;
          pointer-events: none;
        }
        .animate-neon-btn-glow {
          animation: neonBtnGlow 2s linear infinite;
        }
        @keyframes neonBtnGlow {
          0%, 100% { box-shadow: 0 0 16px 4px #00ffe7, 0 0 32px 8px #ff00ea; }
          50% { box-shadow: 0 0 32px 8px #ffd700, 0 0 64px 16px #00f0ff; }
        }
      `}</style>
      
    </div>
  );
}

export default HeroText;
