import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as React from "react";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

interface FadeContentProperties extends React.HTMLAttributes<HTMLDivElement> {
  blur?: boolean;
  children: React.ReactNode;
  container?: Element | null | string;
  delay?: number;
  disappearAfter?: number;
  disappearDuration?: number;
  disappearEase?: string;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  onComplete?: () => void;
  onDisappearanceComplete?: () => void;
  threshold?: number;
}

const FadeContent: React.FC<FadeContentProperties> = ({
  blur = false,
  children,
  className = "",
  container,
  delay = 0,
  disappearAfter = 0,
  disappearDuration = 0.5,
  disappearEase = "power2.in",
  duration = 1000,
  ease = "power2.out",
  initialOpacity = 0,
  onComplete,
  onDisappearanceComplete,
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

    const startPct = (1 - threshold) * 100;
    const getSeconds = (value: number) => (value > 10 ? value / 1000 : value);

    gsap.set(element, {
      autoAlpha: initialOpacity,
      filter: blur ? "blur(10px)" : "blur(0px)",
      willChange: "opacity, filter, transform",
    });

    const tl = gsap.timeline({
      delay: getSeconds(delay),
      onComplete: () => {
        if (onComplete)
          onComplete();
        if (disappearAfter > 0) {
          gsap.to(element, {
            autoAlpha: initialOpacity,
            delay: getSeconds(disappearAfter),
            duration: getSeconds(disappearDuration),
            ease: disappearEase,
            filter: blur ? "blur(10px)" : "blur(0px)",
            onComplete: () => onDisappearanceComplete?.(),
          });
        }
      },
      paused: true,
    });

    tl.to(element, {
      autoAlpha: 1,
      duration: getSeconds(duration),
      ease,
      filter: "blur(0px)",
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
      gsap.killTweensOf(element);
    };
  }, []);

  return (
    <div className={className} ref={reference} {...properties}>
      {children}
    </div>
  );
};

export { FadeContent };
