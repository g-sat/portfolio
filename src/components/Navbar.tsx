import { useState, useEffect } from 'react';

const navItems = [
  { name: 'HOME', href: '#home' },
  { name: 'ABOUT', href: '#about' },
  { name: 'PROJECTS', href: '#projects' },
  { name: 'CONTACT', href: '#contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);


  // Handle scroll events for navbar background and active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = navItems.map(item => item.href.substring(1));
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:block fixed left-0 top-0 h-full w-56 bg-black/80 backdrop-blur-xl border-r border-cyan-400/30 z-50 shadow-2xl">
        {/* Glass Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-transparent to-pink-400/5"></div>
        {/* Cyberpunk Grid Background */}
        <div className="absolute inset-0">
          {/* Primary Grid - Cyan */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />

          {/* Secondary Grid - Pink */}
          <div
            className="absolute inset-0 opacity-8"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 0, 234, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 0, 234, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Scan Lines */}
          <div className="absolute inset-0 opacity-15">
            <div className="scan-lines-enhanced" />
          </div>

          {/* Digital Noise */}
          <div className="absolute inset-0 opacity-3">
            <div className="digital-noise-enhanced" />
          </div>

          {/* Glass Reflection Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
        </div>
        
        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col backdrop-blur-sm">
          {/* Logo/Brand */}
          <div className="p-4 border-b border-cyan-400/20">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse drop-shadow-[0_0_6px_#00ffe7]"></div>
              <h1 className="text-2xl font-bold text-cyan-400 font-cyber tracking-wider drop-shadow-[0_0_6px_#00ffe7] truncate">
                PORTFOLIO
              </h1>
            </div>
            <div className="w-14 h-1 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full drop-shadow-[0_0_3px_#00ffe7]"></div>
            <p className="text-gray-400 text-xs mt-2 font-mono truncate">Developer & Designer</p>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-3">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className={`block w-full text-left px-3 py-2 transition-all duration-300 group relative overflow-hidden text-sm rounded-md ${
                      activeSection === item.href.substring(1)
                        ? 'bg-black/80 text-cyan-400 drop-shadow-[0_0_6px_#00ffe7] backdrop-blur-sm'
                        : 'text-gray-300 hover:text-cyan-400 hover:bg-black/60 backdrop-blur-sm'
                    }`}
                  >
                    {activeSection === item.href.substring(1) && (
                      <div className="absolute inset-0 border border-cyan-400/50 transform rotate-45 scale-90 pointer-events-none drop-shadow-[0_0_3px_#00ffe7]"></div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-medium tracking-wider truncate">{item.name}</span>
                      {activeSection === item.href.substring(1) && (
                        <div className="w-2 h-2 bg-cyan-400 transform rotate-45 animate-pulse drop-shadow-[0_0_3px_#00ffe7]"></div>
                      )}
                    </div>
                    {/* Hover Glitch Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="p-3 border-t border-cyan-400/20">
            <h3 className="text-xs font-semibold text-gray-400 mb-2 font-mono tracking-wider">CONNECT</h3>
            <div className="space-y-2">
              {[
                { name: 'GitHub', icon: '🐙', url: 'https://github.com/g-sat' },
                { name: 'LinkedIn', icon: '💼', url: 'https://www.linkedin.com/in/sathwik-garikapati-9937b1337/' },
                { name: 'Email', icon: '📧', url: 'mailto:g.satl0107@email.com' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-all duration-300 group text-xs"
                >
                  <span className="text-base group-hover:scale-110 transition-transform duration-300">{social.icon}</span>
                  <span className="font-mono truncate">{social.name}</span>
                  <div className="ml-auto w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-[0_0_2px_#00ffe7]"></div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Navbar */}
      <nav className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur-xl shadow-lg' : 'bg-black/80 backdrop-blur-lg'
      }`}>
        <div className="relative z-10 flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse drop-shadow-[0_0_5px_#00ffe7]"></div>
            <h1 className="text-lg font-bold text-cyan-400 font-cyber drop-shadow-[0_0_5px_#00ffe7]">PORTFOLIO</h1>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 bg-black/60 backdrop-blur-sm border border-cyan-400/30 rounded-lg hover:bg-cyan-400/10 transition-all duration-300 hover:border-cyan-400/50"
          >
            <div className={`w-5 h-0.5 bg-cyan-400 mb-1 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-cyan-400 mb-1 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-cyan-400 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/98 backdrop-blur-xl border-t border-cyan-400/30 shadow-2xl">
            <div className="px-4 py-6">
              {/* Navigation Items */}
              <div className="space-y-2 mb-6">
                {navItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(item.href)}
                    className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-between ${
                      activeSection === item.href.substring(1)
                        ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                        : 'text-gray-300 hover:text-cyan-400 hover:bg-black/40'
                    }`}
                  >
                    <span className="font-mono font-medium text-sm tracking-wider">{item.name}</span>
                    {activeSection === item.href.substring(1) && (
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse drop-shadow-[0_0_5px_#00ffe7]"></div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Mobile Social Links */}
              <div className="border-t border-cyan-400/20 pt-4">
                <h3 className="text-xs font-semibold text-gray-400 mb-3 font-mono tracking-wider">CONNECT</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'GitHub', icon: '🐙', url: 'https://github.com/yourusername' },
                    { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com/in/yourprofile' },
                    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com/yourhandle' },
                    { name: 'Email', icon: '📧', url: 'mailto:your@email.com' },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-black/40"
                    >
                      <span className="text-base">{social.icon}</span>
                      <span className="text-xs font-mono">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar; 