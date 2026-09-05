import SceneLoader from '@/src/hero/model/scene-loader'
import CircularText from '@/src/hero/circular_text'
import HeroBeams from '@/src/hero/hero-beams'

export function Hero() {
  return (
    <section className="relative min-h-dvh overflow-x-hidden bg-black text-white">
      <div className="relative min-h-dvh lg:grid lg:grid-cols-2">
        {/* Copy: overlays the visual on small screens; left column on desktop */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-5 pb-10 pt-24 sm:px-8 sm:pb-12 lg:pointer-events-auto lg:relative lg:inset-auto lg:flex lg:flex-col lg:justify-center lg:gap-4 lg:px-16 lg:py-16 lg:pt-28 lg:pb-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[min(55%,28rem)] bg-gradient-to-t from-black via-black/75 to-transparent lg:hidden"
          />

          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 sm:text-sm">
            Sathwik Garikapati
          </p>
          <h1 className="hero-heading mt-3 max-w-4xl text-4xl leading-tight sm:mt-4 sm:text-6xl lg:mt-0 lg:text-7xl xl:text-8xl">
            Design. Build. Intelligence
          </h1>
          <p className="mt-3 max-w-md text-base uppercase text-neutral-400 sm:mt-4 sm:text-lg lg:mt-0">
            Web design meets AI/ML engineering.
          </p>
        </div>

        {/* Full-viewport visual stage */}
        <div className="relative h-dvh min-h-dvh w-full overflow-hidden bg-black">
          <HeroBeams />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-1 flex items-center justify-center"
          >
            <span className="hero-name-bg -translate-y-16 font-splash text-[clamp(2.75rem,16vw,9rem)] leading-none opacity-90 sm:-translate-y-20 lg:-translate-y-40">
              Sathwik G
            </span>
          </div>

          <div className="absolute inset-0 z-2 flex items-center justify-center pb-[22vh] lg:pb-0">
            <CircularText
              text="PORTFOLIO • CREATIVE • DEVELOPER • "
              spinDuration={24}
              className="h-52 w-52 text-[#dce800] sm:h-64 sm:w-64 md:h-72 md:w-72 lg:-translate-x-13 lg:-translate-y-65 lg:h-80 lg:w-80"
            />
          </div>

          <div className="absolute inset-0 z-10 pb-[22vh] lg:pb-0">
            <SceneLoader />
          </div>
        </div>
      </div>
    </section>
  )
}
