import { motion } from "framer-motion";
import type { MotionStyle } from "framer-motion";
import React from "react";

type CardProps = {
    style?: MotionStyle;
    text?: string;
    image?: string;
    containerRef?: React.RefObject<HTMLDivElement | null>;
    backgroundStyle?: React.CSSProperties;
  };

const Card = ({ style, text, image, containerRef, backgroundStyle }: CardProps) => {
  if (image && !text) {
    if (backgroundStyle) {
      // Render with background wrapper
      return (
        <motion.div
          className="absolute flex items-center justify-center"
          style={style}
          drag
          dragConstraints={containerRef}
          dragElastic={1}
          whileHover={{ scale: 1.05 }}
        >
          <div
            style={{
              width: backgroundStyle.width || "3.5rem",
              height: backgroundStyle.height || "3.5rem",
              background: backgroundStyle.background || "#fff",
              borderRadius: backgroundStyle.borderRadius || "9999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: backgroundStyle.boxShadow,
            }}
          >
            <img
              src={image}
              style={{ width: "8rem", objectFit: "contain" }}
              className="pointer-events-none"
            />
          </div>
        </motion.div>
      );
    } else {
      // Render image only, no background
      return (
        <motion.img
          className="absolute cursor-grab"
          src={image}
          style={{ ...style, width: style?.width ?? "3.5rem", objectFit: "contain" }}
          whileHover={{ scale: 1.05 }}
          drag
          dragConstraints={containerRef}
          dragElastic={1}
        />
      );
    }
  }
  // Text card
  return (
    <motion.div
      className="absolute px-1 py-4 text-xl text-center rounded-full ring ring-gray-700 font-extralight bg-storm w-[12rem] cursor-grab"
      style={style}
      whileHover={{ scale: 1.05 }}
      drag
      dragConstraints={containerRef}
      dragElastic={1}
    >
      {text}
    </motion.div>
  );
};

export default Card;