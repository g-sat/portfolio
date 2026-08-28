'use client'

import { useState, type FormEvent } from 'react'
import { CONTACT, CONTACT_CHANNELS } from '@/src/contact/links'
import { ContactMarquee } from '@/src/contact/marquee'

export function Contact() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(
      name.trim() ? `Portfolio — from ${name.trim()}` : 'Portfolio inquiry'
    )
    const body = encodeURIComponent(message.trim() || 'Hi Sathwik,')
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden border-t border-white/10 bg-black text-white"
    >
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 15% 20%, rgba(29,232,29,0.12), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(255,249,71,0.08), transparent 50%), linear-gradient(180deg, #000 0%, #050505 50%, #000 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%)',
        }}
      />

      <div className="relative z-10 px-5 pt-24 pb-8 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="relative">
            <p className="font-bitcount text-[10px] uppercase tracking-[0.45em] text-white/35">
              Contact / 003
            </p>

            <div className="relative mt-6">
              <span
                aria-hidden
                className="contact-splash pointer-events-none absolute -top-6 right-0 hidden select-none font-splash text-[clamp(4rem,18vw,11rem)] leading-none sm:block lg:-top-10"
              >
                Hello
              </span>

              <h2 className="bento-title relative z-10 max-w-[14ch] text-[clamp(3.5rem,12vw,9rem)] leading-[0.82] tracking-[-0.06em]">
                Let’s
                <br />
                <span className="text-[#1de81d]">talk.</span>
              </h2>
            </div>

            <p className="mt-8 max-w-lg text-sm uppercase tracking-[0.2em] text-white/45 sm:text-base">
              {CONTACT.availability}. Drop a line — design, AI systems, or something weird.
            </p>
          </div>
        </div>
      </div>

      <ContactMarquee />

      <div className="relative z-10 px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {CONTACT_CHANNELS.map((channel) => (
              <li key={channel.id}>
                <a
                  href={channel.href}
                  target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={
                    channel.href.startsWith('mailto:') ? undefined : 'noreferrer'
                  }
                  className="contact-row group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-7 sm:gap-8 sm:py-9 lg:grid-cols-[4rem_12rem_1fr_auto]"
                >
                  <span className="font-bitcount text-[10px] tracking-[0.35em] text-white/30 transition-colors group-hover:text-[#1de81d]">
                    {channel.id}
                  </span>
                  <span className="bento-title text-xl tracking-wide text-white transition-colors group-hover:text-[#fff947] sm:text-2xl lg:text-3xl">
                    {channel.title}
                  </span>
                  <span className="col-span-2 truncate font-bitcount text-xs uppercase tracking-[0.28em] text-white/50 transition-colors group-hover:text-white sm:text-sm lg:col-span-1">
                    {channel.value}
                  </span>
                  <span className="hidden items-center gap-2 font-bitcount text-[10px] uppercase tracking-[0.35em] text-white/35 transition-all group-hover:translate-x-1 group-hover:text-[#1de81d] lg:inline-flex">
                    {channel.hint}
                    <span aria-hidden>↗</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-16 grid gap-12 border-t border-white/10 pt-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <div>
              <p className="font-bitcount text-[10px] uppercase tracking-[0.45em] text-white/35">
                Direct line
              </p>
              <p className="bento-title mt-4 text-[clamp(1.75rem,4vw,2.75rem)] leading-[0.95]">
                Start a conversation
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/45">
                Tell me what you’re building. I’ll reply as soon as I can.
              </p>
              <p className="mt-8 font-bitcount text-[10px] uppercase tracking-[0.35em] text-[#1de81d]/70">
                {CONTACT.location}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <label className="block">
                <span className="font-bitcount text-[10px] uppercase tracking-[0.35em] text-white/40">
                  Name
                </span>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="Who’s writing?"
                  className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-base text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#1de81d]"
                />
              </label>

              <label className="block">
                <span className="font-bitcount text-[10px] uppercase tracking-[0.35em] text-white/40">
                  Message
                </span>
                <textarea
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  required
                  placeholder="What’s the idea?"
                  className="mt-2 w-full resize-none border-b border-white/20 bg-transparent py-3 text-base text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#1de81d]"
                />
              </label>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="group inline-flex items-center gap-3 border border-[#1de81d]/60 bg-[#1de81d]/10 px-8 py-4 font-bitcount text-[11px] uppercase tracking-[0.4em] text-[#1de81d] transition-colors hover:bg-[#1de81d] hover:text-black"
                >
                  Send
                  <span
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </button>
                {sent ? (
                  <p className="font-bitcount text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Opening your mail app…
                  </p>
                ) : null}
              </div>
            </form>
          </div>

          <footer className="mt-20 flex flex-col justify-between gap-4 border-t border-white/10 pt-8 pb-4 sm:flex-row sm:items-end">
            <p className="font-splash text-3xl text-[#fff947] sm:text-4xl">
              Sathwik G
            </p>
            <p className="font-bitcount text-[10px] uppercase tracking-[0.4em] text-white/30">
              © {new Date().getFullYear()} — Design. Build. Intelligence.
            </p>
          </footer>
        </div>
      </div>
    </section>
  )
}
