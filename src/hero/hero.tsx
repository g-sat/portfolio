import SceneLoader from '@/src/hero/model/scene-loader'
import CircularText from '@/src/hero/circular_text'

export function Hero() {
  return (
    <section className="grid min-h-dvh grid-cols-1 overflow-x-hidden lg:grid-cols-2">
      <div className="order-2 flex flex-col justify-center gap-4 px-5 py-8 sm:gap-5 sm:px-8 sm:py-12 lg:order-1 lg:gap-6 lg:px-16 lg:py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 sm:text-sm">
          Portfolio
        </p>
        <h1 className="max-w-xl text-3xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
          Hello There!
        </h1>
        <p className="max-w-md text-base text-neutral-600 sm:text-lg dark:text-neutral-400">
          Add your intro, role, or a short description here.
        </p>
      </div>

      <div className="relative order-1 h-[58vh] min-h-[320px] w-full overflow-hidden sm:h-[62vh] sm:min-h-[380px] lg:order-2 lg:h-dvh lg:min-h-screen">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
        >
          <span className="hero-name-bg -translate-y-10 font-splash text-[clamp(2.75rem,16vw,9rem)] leading-none opacity-90 sm:-translate-y-16 md:-translate-y-24 lg:-translate-y-40">
            Sathwik G
          </span>
        </div>

        <div className="absolute inset-0 z-[2] flex items-center justify-center">
          <CircularText
            text="PORTFOLIO • CREATIVE • DEVELOPER • "
            spinDuration={24}
            className="-translate-y-10 h-44 w-44 text-[#1de81d] sm:-translate-y-20 sm:h-56 sm:w-56 md:-translate-y-36 md:h-72 md:w-72 lg:-translate-x-13 lg:-translate-y-65 lg:h-80 lg:w-80"
          />
        </div>

        <div className="absolute inset-0 z-10">
          <SceneLoader />
        </div>
      </div>
    </section>
  )
}
