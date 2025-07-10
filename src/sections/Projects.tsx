import { useState, useEffect, useRef } from "react";
import ProjectDetails from "../components/ProjectDetails";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- Project (singular) component ---
type ProjectProps = {
  title: string;
  description: string;
  subDescription: string;
  href: string;
  image: string;
  tags: { id: string; name: string }[];
  setPreview: (image: string | null) => void;
};

export const Project = ({
  title,
  description,
  subDescription,
  href,
  image,
  tags = [], // Default tags to an empty array
  setPreview,
}: ProjectProps) => {
  const [isHidden, setIsHidden] = useState(false);
  return (
    <section id = "projects">
      <div
        className="flex-wrap items-center justify-between py-10 space-y-14 sm:flex sm:space-y-0 max-w-6xl w-full mx-auto"
        onMouseEnter={() => setPreview(image)}
        onMouseLeave={() => setPreview(null)}
      >
        <div>
          <p className="text-2xl">{title}</p>
          <div className="flex gap-5 mt-2 text-sand">
            {tags.map((tag) => (
              <span key={tag.id}>{tag.name}</span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setIsHidden(true)}
          className="flex items-center gap-1 cursor-pointer hover-animation"
        >
          Read More
          <img src="assets/assets/arrow-right.svg" className="w-5" />
        </button>
      </div>
      <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent h-[1px] w-full" />
      {isHidden && (
        <ProjectDetails
          title={title}
          description={description}
          subDescription={[subDescription]}
          image={image}
          tags={(tags || []).map(tag => ({
            ...tag,
            path: `assets/assets/logos/${tag.name.toLowerCase()}.svg`
          }))}
          href={href}
          closeModal={() => setIsHidden(false)}
        />
      )}
    </section>
  );
};

// --- Projects (plural) component ---
const projects = [
  {
    title: "Apple Clone",
    description: " a small website that i built to learn and explore about Three.js",
    subDescription: "Subdesc 1",
    href: "https://apple-sats.vercel.app/",
    image: "assets/assets/projects/apple.png",
    tags: [
      { id: "react", name: "React" },
      { id: "ts", name: "TypeScript" },
      { id: "three.js", name: "Three JS" }
    ]
  },
  {
    title: "IELTS Platform",
    description: "A website built to test my fullstack limits",
    subDescription: "",
    href: "#",
    image: "assets/assets/projects/Screenshot 2025-07-06 144019.png",
    tags: [
      { id: "nextjs", name: "NextJS" },
      { id: "tailwind", name: "TailwindCSS" }
    ]
  },
  {
    title: "Movie Recomendation",
    description: "A website built to test my API integration skills",
    subDescription: "",
    href: "#",
    image: "",
    tags: [
      { id: "venilla js", name: "NextJS" },
      { id: "tailwind", name: "TailwindCSS" }
    ]
  },
  // Add more projects as needed
];

// Badass marquee text
const BADASS_TEXT = "UNSTOPPABLE • RELENTLESS • CODE WARRIOR • DIGITAL MAVERICK • PUSHING LIMITS • ";

const Projects = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (marqueeRef.current) {
      gsap.to(marqueeRef.current, {
        x: '-5%', // less distance for slower effect
        ease: 'power1.inOut', // smoother
        scrollTrigger: {
          trigger: marqueeRef.current,
          start: 'top 90%',
          end: 'bottom 10%',
          scrub: 1.5, // more smoothing
        },
      });
    }
  }, []);

  gsap.registerPlugin(ScrollTrigger);

  return (
    <section className="relative">
      {/* GSAP Marquee Scroll Animation */}
      <div className="overflow-hidden w-full py-6 select-none">
        <div
          ref={marqueeRef}
          className="whitespace-nowrap font-bebas text-5xl md:text-7xl font-extrabold tracking-widest text-cyan-400 uppercase"
          style={{ willChange: 'transform', display: 'inline-block' }}
        >
          {BADASS_TEXT.repeat(6)}
        </div>
      </div>
      {/* Preview image overlay */}
      {preview && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <img
            src={preview}
            alt="Project Preview"
            className="max-w-xl max-h-[80vh] rounded-xl shadow-2xl border-4 border-white/20 bg-black/80"
            style={{ objectFit: "contain" }}
          />
        </div>
      )}
      {projects.map((project) => (
        <Project
          key={project.title}
          {...project}
          setPreview={setPreview}
        />
      ))}
    </section>
  );
};

export default Projects;