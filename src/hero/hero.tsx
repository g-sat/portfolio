import SceneLoader from '@/src/hero/model/scene-loader'
import CircularText from '@/src/hero/circular_text'

export function Hero() {
  return (
    <section className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center gap-6 px-8 py-12 lg:px-16">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Portfolio</p>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
          Hello There!
        </h1>
        <p className="max-w-md text-lg text-neutral-600 dark:text-neutral-400">
          Add your intro, role, or a short description here.
        </p>
      </div>

      <div className="relative min-h-[420px] w-full lg:min-h-screen">
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <CircularText
            text="PORTFOLIO • CREATIVE • DEVELOPER • "
            spinDuration={24}
            className="h-[320px] w-[320px] text-neutral-900 dark:text-white"
          />
        </div>
        <div className="relative z-10 h-full w-full">
          <SceneLoader />
        </div>
      </div>
    </section>
  )
}
