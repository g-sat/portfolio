import { useState } from "react";
import ProjectDetails from "../components/ProjectDetails";

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
    subDescription: "Subdesc 2",
    href: "#",
    image: "assets/assets/projects/Screenshot 2025-07-06 144019.png",
    tags: [
      { id: "nextjs", name: "NextJS" },
      { id: "tailwind", name: "TailwindCSS" }
    ]
  },
  // Add more projects as needed
];

const Projects = () => {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <section className="relative">
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