import { useState } from 'react';
import IntroAnimation from "./components/IntroAnimation"
import Home from "./pages/Home"

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <IntroAnimation onComplete={handleIntroComplete} />;
  }

  return <Home />;
}

export default App
