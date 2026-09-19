import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedContentProperties extends React.HTMLAttributes<HTMLDivElement> {
  animateOpacity?: boolean;
  children: React.ReactNode;
  container?: Element | null | string;
  delay?: number;
  direction?: "horizontal" | "vertical";
  disappearAfter?: number;
  disappearDuration?: number;
  disappearEase?: string;
  distance?: number;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  onComplete?: () => void;
  onDisappearanceComplete?: () => void;
  reverse?: boolean;
  scale?: number;
  threshold?: number;
}

const AnimatedContent: React.FC<AnimatedContentProperties> = ({
  animateOpacity = true,
  children,
  className = "",
  container,
  delay = 0,
  direction = "vertical",
  disappearAfter = 0,
  disappearDuration = 0.5,
  disappearEase = "power3.in",
  distance = 100,
  duration = 0.8,
  ease = "power3.out",
  initialOpacity = 0,
  onComplete,
  onDisappearanceComplete,
  reverse = false,
  scale = 1,
  threshold = 0.1,
  ...properties
}) => {
  const reference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = reference.current;
    if (!element)
      return;

    let scrollerTarget: Element | null | string = container || document.querySelector("#snap-main-container") || null;

    if (typeof scrollerTarget === "string") {
      scrollerTarget = document.querySelector(scrollerTarget);
    }

    const axis = direction === "horizontal" ? "x" : "y";
    const offset = reverse ? -distance : distance;
    const startPct = (1 - threshold) * 100;

    gsap.set(element, {
      [axis]: offset,
      opacity: animateOpacity ? initialOpacity : 1,
      scale,
      visibility: "visible",
    });

    const tl = gsap.timeline({
      delay,
      onComplete: () => {
        if (onComplete)
          onComplete();
        if (disappearAfter > 0) {
          gsap.to(element, {
            [axis]: reverse ? distance : -distance,
            delay: disappearAfter,
            duration: disappearDuration,
            ease: disappearEase,
            onComplete: () => onDisappearanceComplete?.(),
            opacity: animateOpacity ? initialOpacity : 0,
            scale: 0.8,
          });
        }
      },
      paused: true,
    });

    tl.to(element, {
      [axis]: 0,
      duration,
      ease,
      opacity: 1,
      scale: 1,
    });

    const st = ScrollTrigger.create({
      once: true,
      onEnter: () => tl.play(),
      scroller: scrollerTarget || globalThis,
      start: `top ${startPct}%`,
      trigger: element,
    });

    return () => {
      st.kill();
      tl.kill();
    };
  }, [
    container,
    distance,
    direction,
    reverse,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    threshold,
    delay,
    disappearAfter,
    disappearDuration,
    disappearEase,
    onComplete,
    onDisappearanceComplete,
  ]);

  return (
    <div className={`invisible ${className}`} ref={reference} {...properties}>
      {children}
    </div>
  );
};

export { AnimatedContent };
