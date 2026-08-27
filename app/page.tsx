import { About } from '@/src/about/about'
import { Hero } from '@/src/hero/hero'
import Navbar from '@/src/overalls/navbar'

export default function Home() {
  return (
    <main className="min-h-dvh bg-black">
      <Navbar />

      <div id="home" className="scroll-mt-20">
        <Hero />
      </div>

      <About />

      <section
        id="projects"
        className="scroll-mt-20 border-t border-white/10 px-5 py-24 sm:px-8 lg:px-16"
      >
        <div className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Work</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Projects</h2>
          <p className="mt-4 max-w-xl text-neutral-400">
            Project cards and case studies will live in this section.
          </p>
        </div>
      </section>

      <section
        id="contact"
        className="scroll-mt-20 border-t border-white/10 px-5 py-24 sm:px-8 lg:px-16"
      >
        <div className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Contact</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Get in touch</h2>
          <p className="mt-4 max-w-xl text-neutral-400">
            Email, social links, or a contact form can go here.
          </p>
        </div>
      </section>
    </main>
  )
}
