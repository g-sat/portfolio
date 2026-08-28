import { About } from '@/src/about/about'
import { Contact } from '@/src/contact/contact'
import { Hero } from '@/src/hero/hero'
import { Projects } from '@/src/projects/projects'
import Navbar from '@/src/overalls/navbar'

export default function Home() {
  return (
    <main className="min-h-dvh bg-black">
      <Navbar />

      <div id="home" className="scroll-mt-20">
        <Hero />
      </div>

      <About />

      <Projects />

      <Contact />
    </main>
  )
}
