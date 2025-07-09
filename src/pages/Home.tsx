import Hero from '../sections/Hero';
import About from '../sections/About';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <>
      <Navbar />
      
      {/* Main Content with Sidebar Spacing */}
      <div className="lg:ml-56 bg-black">
        {/* Hero Section */}
        <section id="home" className="min-h-screen">
          <Hero />
        </section>

        {/* About Section */}
        <About />

        {/* Projects Section */}
        <Projects />

        {/* Contact Section */}
        <Contact />
      </div>
    </>
  );
};

export default Home; 