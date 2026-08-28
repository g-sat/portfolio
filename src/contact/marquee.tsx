'use client'

const PHRASE =
  'AVAILABLE FOR PROJECTS  ·  DESIGN  ·  BUILD  ·  INTELLIGENCE  ·  LET’S COLLABORATE  ·  '

export function ContactMarquee() {
  return (
    <div
      className="contact-marquee relative overflow-hidden border-y border-white/10 bg-[#0a0a0a] py-4"
      aria-hidden
    >
      <div className="contact-marquee__track flex w-max">
        {[0, 1].map((copy) => (
          <p
            key={copy}
            className="font-bitcount whitespace-nowrap px-4 text-[clamp(0.85rem,2.2vw,1.15rem)] uppercase tracking-[0.42em] text-[#1de81d]/80"
          >
            {PHRASE.repeat(3)}
          </p>
        ))}
      </div>
    </div>
  )
}
