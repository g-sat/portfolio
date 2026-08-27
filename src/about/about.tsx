'use client';
import MergedShape from '@/src/about/bento'

export function About() {
  return (
    <section
      id="about"
      className="
        relative
        min-h-dvh
        overflow-hidden
        bg-white
        px-5
        py-20
        text-black
        sm:px-8
        lg:px-10
      "
    >
      <div className="
        mx-auto
        flex
        min-h-[80vh]
        w-full
        max-w-[1800px]
        flex-col
        justify-between
      ">

        {/* Massive editorial heading */}
        <div className="relative z-10">

          <p className="
            mb-6
            text-xs
            uppercase
            tracking-[0.45em]
            text-neutral-400
          ">
            About / 001
          </p>

          <h2
            className="
              bento-title
              max-w-[1100px]
              text-[clamp(5rem,14vw,13rem)]
              leading-[0.82]
              tracking-[-0.08em]
              text-black
            "
          >
            Quick Intro
          </h2>

        </div>


        {/* Bento visual */}
        <div
          className="
            relative
            mt-10
            ml-auto
            w-full
            max-w-[1100px]
            lg:-mt-20
          "
        >
          <MergedShape fill="#111111" />
        </div>


        {/* Bottom statement */}
        <div
          className="
            mt-10
            flex
            flex-col
            justify-between
            gap-6
            border-t
            border-neutral-200
            pt-6
            sm:flex-row
          "
        >

          <p
            className="
              max-w-xl
              font-bitcount
              text-xs
              uppercase
              leading-loose
              tracking-[0.22em]
              text-neutral-500
            "
          >
            Website designer & AI/ML developer crafting
            digital products where human experience
            meets machine intelligence.
          </p>


          <p
            className="
              text-xs
              uppercase
              tracking-[0.35em]
              text-neutral-400
            "
          >
            2026 — Portfolio
          </p>

        </div>

      </div>
    </section>
  )
}