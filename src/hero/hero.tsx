import SceneLoader from '@/src/hero/model/scene-loader'
import CircularText from '@/src/hero/circular_text'
import HeroBeams from '@/src/hero/hero-beams'

export function Hero() {
  return (
    <section className="relative min-h-dvh overflow-x-hidden bg-black text-white">
      <div className="relative z-10 grid min-h-dvh grid-cols-1 lg:grid-cols-2">
        <div className="order-2 flex flex-col justify-center gap-4 px-5 pt-24 pb-8 sm:gap-5 sm:px-8 sm:pt-28 sm:pb-12 lg:order-1 lg:gap-6 lg:px-16 lg:py-16 lg:pt-28">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 sm:text-sm">
            Sathwik Garikapati
          </p>
          <h1 className="hero-heading max-w-4xl text-4xl leading-tight sm:text-6xl lg:text-7xl xl:text-8xl">
            Design. Build. Intelligence
          </h1>
          <p className="max-w-md text-base uppercase text-neutral-400 sm:text-lg">
            Web design meets AI/ML engineering.
          </p>
        </div>

        <div className="relative order-1 h-[58vh] min-h-80 w-full overflow-hidden bg-black sm:h-[62vh] sm:min-h-95 lg:order-2 lg:h-dvh lg:min-h-screen">
          <HeroBeams />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-1 flex items-center justify-center"
          >
            <span className="hero-name-bg -translate-y-10 font-splash text-[clamp(2.75rem,16vw,9rem)] leading-none opacity-90 sm:-translate-y-16 md:-translate-y-24 lg:-translate-y-40">
              Sathwik G
            </span>
          </div>

          <div className="absolute inset-0 z-2 flex items-center justify-center">
            <CircularText
              text="PORTFOLIO • CREATIVE • DEVELOPER • "
              spinDuration={24}
              className="-translate-y-10 h-44 w-44 text-[#dce800] sm:-translate-y-20 sm:h-56 sm:w-56 md:-translate-y-36 md:h-72 md:w-72 lg:-translate-x-13 lg:-translate-y-65 lg:h-80 lg:w-80"
            />
          </div>

          <div className="absolute inset-0 z-10">
            <SceneLoader />
          </div>
        </div>
      </div>
    </section>
  )
}
