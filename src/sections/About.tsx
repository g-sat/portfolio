import { useRef } from "react";
import Card from "../components/Card"
import { Globe } from "../components/globe";
import CopyEmailButton from "../components/CopyEmailButton";
import { Frameworks } from "../components/Frameworks";

const About = () => {
  const grid2Container = useRef<HTMLDivElement>(null);
  return (
    <section
      id="about"
      className="relative flex flex-col items-center justify-center min-h-screen w-full max-w-6xl mx-auto px-4 pt-12 pb-7 bg-black"
    >
      <h2 className="text-heading z-10">About me</h2>
      <div className="grid grid-cols-1 md:grid-cols-6 md:auto-rows-[12rem] mt-12 gap-4 w-full z-10">
        {/* grid-1 */}
        <div className="flex items-end grid-default-color grid-1 md:col-span-4 md:row-span-2">
          <img 
            src="assets/assets/coding-pov.png"
            className="absolute scale-[1.75] -right-[5rem] -top-[1rem] md:scale-[3] md:left-50 md:inset-y-10 lg:scale-[2.5]"
          />
          <div className="z-10">
            <p className="headtext">Hi, I'm Sathwik Garikapati</p>
            <p className="subtext text-amber-50">
              Over the last 2 years, I developed my frontend and backend dev
              skills to deliver dynamic and software and web applications.
            </p>
          </div>
          <div className="absolute inset-x-0 pointer-evets-none -bottom-4 h-1/2 sm:h-1/3 bg-gradient-to-t from-indigo" />
        </div>
        {/* grid-2 */}
        <div className="grid-default-color grid-2 md:col-span-2 md:row-span-1">
        <div
            ref={grid2Container}
            className="flex items-center justify-center w-full h-full"
          >
            <p className="flex items-end text-5xl text-gray-500">
              CODE IS CRAFT
            </p>
            <Card
              style={{ width: "8rem", rotate: "75deg", top: "30%", left: "20%" }}
              image="assets/assets/logos/1.png"
              containerRef={grid2Container}
            />
            <Card
              style={{width: "6rem", rotate: "-30deg", top: "60%", left: "45%" }}
              image="assets/assets/logos/2.png"
              containerRef={grid2Container}
            />
            <Card
              style={{width: "6rem", rotate: "90deg", bottom: "30%", left: "70%" }}
              image="assets/assets/logos/3.png"
              containerRef={grid2Container}
            />
            <Card
              style={{width: "6rem", rotate: "-45deg", top: "55%", left: "0%" }}
              image="assets/assets/logos/4.png"
              containerRef={grid2Container}
            />
            <Card
              style={{width: "6rem", rotate: "20deg", top: "10%", left: "38%", background: "#fff",borderRadius: "9999px" }}
              image="assets/assets/logos/5.png"
              containerRef={grid2Container}
            />
            <Card
              style={{ rotate: "30deg", top: "70%", left: "70%" }}
              image="assets/assets/logos/csharp-pink.png"
              containerRef={grid2Container}
            />
            <Card
              style={{ rotate: "-45deg", top: "70%", left: "25%" }}
              image="assets/assets/logos/dotnet-pink.png"
              containerRef={grid2Container}
            />
            <Card
              style={{ rotate: "-45deg", top: "5%", left: "10%" }}
              image="assets/assets/logos/blazor-pink.png"
              containerRef={grid2Container}
            />
          </div>
        </div>
        {/* grid-3 */}
        <div className="grid-black-color grid-3 md:col-span-2 md:row-span-2">
          <div className="z-10 w-[50%]">
            <p className="headtext">Time Zone</p>
            <p className="subtext">
              I'm based in India, and open to remote work worldwide
            </p>
          </div>
          <figure className="absolute left-[30%] top-[10%]">
            <Globe />
          </figure>
        </div>
        {/* grid-4 */}
        <div className="grid-special-color grid-4">
          <div className="flex flex-col items-center justify-center gap-4 size-full">
            <p className="text-center headtext">
              Do you want to start a project together?
            </p>
            <CopyEmailButton />
          </div>
        </div>
        {/* grid-5 */}
        <div className="grid-default-color grid-5">
          <div className="z-10 w-[50%]">
            <p className="headText">Teck Stack</p>
            <p className="subtext">
              I specialize in a variety of languages, frameworks, and tools taht
              allow me to build robust and scalable applications
            </p>
          </div>
          <div className="absolute inset-y-0 md:inset-y-9 w-full h-full start-[50%] md:scale-125">
            <Frameworks />
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
