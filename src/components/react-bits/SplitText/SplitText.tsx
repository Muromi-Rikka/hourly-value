import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import React, { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

export interface SplitTextProps {
  className?: string;
  delay?: number;
  duration?: number;
  ease?: ((t: number) => number) | string;
  from?: gsap.TweenVars;
  onLetterAnimationComplete?: () => void;
  rootMargin?: string;
  splitType?: "chars" | "lines" | "words" | "words, chars";
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  text: string;
  textAlign?: React.CSSProperties["textAlign"];
  threshold?: number;
  to?: gsap.TweenVars;
}

const SplitText: React.FC<SplitTextProps> = ({
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  from = { opacity: 0, y: 40 },
  onLetterAnimationComplete,
  rootMargin = "-100px",
  splitType = "chars",
  tag = "p",
  text,
  textAlign = "center",
  threshold = 0.1,
  to = { opacity: 1, y: 0 },
}) => {
  const reference = useRef<HTMLParagraphElement>(null);
  const animationCompletedReference = useRef(false);
  const onCompleteReference = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  // Keep callback ref updated
  useEffect(() => {
    onCompleteReference.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    }
    else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useGSAP(
    () => {
      if (!reference.current || !text || !fontsLoaded)
        return;
      // Prevent re-animation if already completed
      if (animationCompletedReference.current)
        return;
      const element = reference.current as HTMLElement & {
        _rbsplitInstance?: GSAPSplitText;
      };

      if (element._rbsplitInstance) {
        try {
          element._rbsplitInstance.revert();
        }
        catch {}
        element._rbsplitInstance = undefined;
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? Number.parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
      const sign
        = marginValue === 0
          ? ""
          : (marginValue < 0
              ? `-=${Math.abs(marginValue)}${marginUnit}`
              : `+=${marginValue}${marginUnit}`);
      const start = `top ${startPct}%${sign}`;
      let targets: Element[] = [];
      const assignTargets = (self: GSAPSplitText) => {
        if (splitType.includes("chars") && (self as GSAPSplitText).chars?.length)
          targets = (self as GSAPSplitText).chars;
        if (targets.length === 0 && splitType.includes("words") && self.words.length > 0)
          targets = self.words;
        if (targets.length === 0 && splitType.includes("lines") && self.lines.length > 0)
          targets = self.lines;
        if (targets.length === 0)
          targets = self.chars || self.words || self.lines;
      };
      const splitInstance = new GSAPSplitText(element, {
        autoSplit: splitType === "lines",
        charsClass: "split-char",
        linesClass: "split-line",
        onSplit: (self: GSAPSplitText) => {
          assignTargets(self);
          return gsap.fromTo(
            targets,
            { ...from },
            {
              ...to,
              duration,
              ease,
              force3D: true,
              onComplete: () => {
                animationCompletedReference.current = true;
                onCompleteReference.current?.();
              },
              scrollTrigger: {
                anticipatePin: 0.4,
                fastScrollEnd: true,
                once: true,
                start,
                trigger: element,
              },
              stagger: delay / 1000,
              willChange: "transform, opacity",
            },
          );
        },
        reduceWhiteSpace: false,
        smartWrap: true,
        type: splitType,
        wordsClass: "split-word",
      });
      element._rbsplitInstance = splitInstance;
      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === element)
            st.kill();
        });
        try {
          splitInstance.revert();
        }
        catch {}
        element._rbsplitInstance = undefined;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
      ],
      scope: reference,
    },
  );

  const renderTag = () => {
    const style: React.CSSProperties = {
      textAlign,
      willChange: "transform, opacity",
      wordWrap: "break-word",
    };
    const classes = `split-parent overflow-hidden inline-block whitespace-normal ${className}`;
    const Tag = tag || "p";

    return (
      <Tag className={classes} ref={reference} style={style}>
        {text}
      </Tag>
    );
  };

  return renderTag();
};

export { SplitText };
