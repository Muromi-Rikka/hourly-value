import type { Easing, Transition } from "motion/react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

interface BlurTextProperties {
  animateBy?: "letters" | "words";
  animationFrom?: Record<string, number | string>;
  animationTo?: Array<Record<string, number | string>>;
  className?: string;
  delay?: number;
  direction?: "bottom" | "top";
  easing?: Easing | Easing[];
  onAnimationComplete?: () => void;
  rootMargin?: string;
  stepDuration?: number;
  text?: string;
  threshold?: number;
}

function buildKeyframes(from: Record<string, number | string>, steps: Array<Record<string, number | string>>): Record<string, Array<number | string>> {
  const keys = new Set<string>([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);

  const keyframes: Record<string, Array<number | string>> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map(s => s[k])];
  });
  return keyframes;
}

const BlurText: React.FC<BlurTextProperties> = ({
  animateBy = "words",
  animationFrom,
  animationTo,
  className = "",
  delay = 200,
  direction = "top",
  easing = (t: number) => t,
  onAnimationComplete,
  rootMargin = "0px",
  stepDuration = 0.35,
  text = "",
  threshold = 0.1,
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const reference = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!reference.current)
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setInView(true);
        observer.unobserve(reference.current as Element);
      },
      { rootMargin, threshold },
    );
    observer.observe(reference.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === "top" ? { filter: "blur(10px)", opacity: 0, y: -50 } : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction],
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction],
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, index) => (stepCount === 1 ? 0 : index / (stepCount - 1)));

  return (
    <p className={`blur-text ${className} flex flex-wrap`} ref={reference}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        const spanTransition: Transition = {
          delay: (index * delay) / 1000,
          duration: totalDuration,
          ease: easing,
          times,
        };

        return (
          <motion.span
            animate={inView ? animateKeyframes : fromSnapshot}
            initial={fromSnapshot}
            key={index}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
            style={{
              display: "inline-block",
              willChange: "transform, filter, opacity",
            }}
            transition={spanTransition}
          >
            {segment === " " ? "\u{A0}" : segment}
            {animateBy === "words" && index < elements.length - 1 && "\u{A0}"}
          </motion.span>
        );
      })}
    </p>
  );
};

export { BlurText };
