import { useEffect, useRef } from "react"

const Marquee = () => {
  const scrollRef1 = useRef<HTMLDivElement>(null)
  const scrollRef2 = useRef<HTMLDivElement>(null)
  const scrollRef3 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollElements = [scrollRef1.current, scrollRef2.current, scrollRef3.current]

    scrollElements.forEach((element, index) => {
      if (element) {
        const speed = 30 + index * 20 // Faster speeds for immediate effect
        element.style.animationDuration = `${speed}s`
      }
    })
  }, [])

  const scrollingTexts = [
    "CREATIVE DEVELOPER • DIGITAL ARTIST • UI/UX DESIGNER • BRAND STRATEGIST • ",
    "INNOVATION • CREATIVITY • TECHNOLOGY • DESIGN • FUTURE • VISION • ",
    "PORTFOLIO • PROJECTS • EXPERIENCE • SKILLS • CONTACT • ABOUT • ",
  ]
  return(
    <div>
      <div className="absolute inset-0 flex flex-col justify-center space-y-8 h-4/5 pointer-events-none">
        {scrollingTexts.map((text, index) => (
          <div key={index} className="overflow-hidden whitespace-nowrap">
            <div
              ref={index === 0 ? scrollRef1 : index === 1 ? scrollRef2 : scrollRef3}
              className={`inline-block animate-scroll-left text-2xl md:text-4xl font-bold tracking-wider ${
                index === 0 ? "text-teal-400" : index === 1 ? "text-gray-400" : "text-teal-600"
              }`}
            >
              {text.repeat(3)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};

export default Marquee; 