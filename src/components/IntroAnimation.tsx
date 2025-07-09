import { useState, useEffect } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);
  const [progressComplete, setProgressComplete] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const steps = [
    { text: "INITIALIZING", delay: 500 },
    { text: "LOADING SYSTEMS", delay: 800 },
    { text: "CONNECTING TO GRID", delay: 600 },
    { text: "SYNCHRONIZING", delay: 700 },
    { text: "ACCESS GRANTED", delay: 1000 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Final step - show glitch effect then show button
        setShowGlitch(true);
        setTimeout(() => {
          setProgressComplete(true);
        }, 1500);
      }
    }, steps[currentStep]?.delay || 500);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete, steps]);

  const handleEnterClick = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-30 text-center">
        {/* Logo/Title */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-cyan-400 font-cyber mb-4 animate-pulse">
            PORTFOLIO
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto"></div>
        </div>

        {/* Loading Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`text-lg md:text-xl font-mono transition-all duration-500 ${
                index <= currentStep
                  ? 'text-cyan-400 opacity-100'
                  : 'text-gray-600 opacity-50'
              }`}
            >
              {index <= currentStep ? (
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-400">{'>'}</span>
                  <span>{step.text}</span>
                  <span className="animate-pulse">_</span>
                </div>
              ) : (
                <span>{step.text}</span>
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="bg-gray-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-purple-400 h-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i <= currentStep % 3 ? 'bg-cyan-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Enter Button - Only show when progress is complete */}
        {progressComplete && (
          <div className="mt-8 animate-fade-in relative z-40">
            <button
              onClick={handleEnterClick}
              className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-bold text-xl font-mono border-2 border-cyan-400 hover:from-cyan-300 hover:to-purple-300 hover:border-cyan-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 cursor-pointer"
            >
              ENTER PORTFOLIO
            </button>
          </div>
        )}
      </div>

      {/* Glitch Effect */}
      {showGlitch && (
        <div className={`absolute inset-0 z-20 ${progressComplete ? 'pointer-events-none' : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-transparent to-purple-400/20 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
          
          {/* Glitch Lines */}
          <div className="absolute inset-0">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute h-px bg-cyan-400/60 animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: '0',
                  right: '0',
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${0.5 + Math.random()}s`
                }}
              />
            ))}
          </div>

          {/* Final Flash */}
          <div className="absolute inset-0 bg-white/20 animate-ping" style={{ animationDuration: '0.3s' }} />
        </div>
      )}

      {/* Scan Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scan-lines-intro" />
      </div>
    </div>
  );
};

export default IntroAnimation; 