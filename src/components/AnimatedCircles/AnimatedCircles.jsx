// src/components/AnimatedCircles/AnimatedCircles.jsx
import { motion } from "framer-motion";


const circleVariants = {
  animate: (i) => ({
    y: [0, -30, 0],
    x: [0, 20, -20, 0],
    scale: [1, 1.2, 0.9, 1],
    opacity: [0.4, 0.8, 0.4],
    transition: {
      duration: 5 + i * 1.5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i * 0.6,
    },
  }),
};


const circlePulseVariants = {
  animate: (i) => ({
    scale: [1, 1.6, 1],
    opacity: [0.5, 0.1, 0.5],
    transition: {
      duration: 4 + i,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i * 0.4,
    },
  }),
};


const borderCircleVariants = {
  animate: (i) => ({
    scale: [1, 1.4, 1],
    opacity: [0.5, 0.9, 0.5],
    rotate: [0, 180, 360],
    transition: {
      duration: 8 + i * 1.2,
      repeat: Infinity,
      ease: "linear",
      delay: i * 0.5,
    },
  }),
};


export const AnimatedCircles = ({ count = 6, baseSize = 60 }) => {
  const circles = Array.from({ length: count }, (_, i) => i);
  const colors = ["rgb(84, 194, 195)", "rgb(0, 184, 219)", "rgb(92, 128, 255)"];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {circles.map((i) => {
        const size = baseSize + Math.random() * 50;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const blur = Math.random() * 8 + 3;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const opacity = 0.15 + Math.random() * 0.25;

        return (
          <motion.div
            key={i}
            custom={i}
            variants={circleVariants}
            animate="animate"
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              background: `radial-gradient(circle, ${color}${Math.round(
                opacity * 100,
              )
                .toString()
                .padStart(2, "0")} 0%, ${color}${Math.round(opacity * 0.4 * 100)
                .toString()
                .padStart(2, "0")} 60%, transparent 100%)`,
              filter: `blur(${blur}px)`,
              boxShadow: `0 0 60px ${color}${Math.round(opacity * 0.5 * 100)
                .toString()
                .padStart(2, "0")}`,
            }}
          />
        );
      })}
    </div>
  );
};


export const BorderCircles = ({ count = 8 }) => {
  const circles = Array.from({ length: count }, (_, i) => i);
  const colors = [
    "rgba(79, 70, 229, 0.5)",
    "rgba(6, 182, 212, 0.5)",
    "rgba(84, 194, 195, 0.5)",
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {circles.map((i) => {
        const size = 70 + Math.random() * 120;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const colorIndex = i % colors.length;

        return (
          <motion.div
            key={`border-${i}`}
            custom={i}
            variants={borderCircleVariants}
            animate="animate"
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              border: `${2 + Math.random() * 2}px solid ${colors[colorIndex]}`,
              boxShadow: `0 0 50px ${colors[colorIndex]}`,
            }}
          />
        );
      })}
    </div>
  );
};


export const PulsingCircles = ({ count = 6 }) => {
  const circles = Array.from({ length: count }, (_, i) => i);
  const colors = ["rgb(84, 194, 195)", "rgb(0, 184, 219)", "rgb(92, 128, 255)"];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {circles.map((i) => {
        const size = 80 + Math.random() * 100;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const opacity = 0.15 + Math.random() * 0.2;

        return (
          <motion.div
            key={`pulse-${i}`}
            custom={i}
            variants={circlePulseVariants}
            animate="animate"
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              border: `${2 + Math.random() * 2}px solid ${color}${Math.round(
                opacity * 100,
              )
                .toString()
                .padStart(2, "0")}`,
              boxShadow: `0 0 60px ${color}${Math.round(opacity * 0.2 * 100)
                .toString()
                .padStart(2, "0")}`,
            }}
          />
        );
      })}
    </div>
  );
};
