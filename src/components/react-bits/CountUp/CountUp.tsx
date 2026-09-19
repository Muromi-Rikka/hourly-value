import { useInView, useMotionValue, useSpring } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

interface CountUpProperties {
  className?: string;
  delay?: number;
  direction?: "down" | "up";
  duration?: number;
  from?: number;
  onEnd?: () => void;
  onStart?: () => void;
  separator?: string;
  startWhen?: boolean;
  to: number;
}

export function CountUp({
  className = "",
  delay = 0,
  direction = "up",
  duration = 2,
  from = 0,
  onEnd,
  onStart,
  separator = "",
  startWhen = true,
  to,
}: CountUpProperties) {
  const reference = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  });

  const isInView = useInView(reference, { margin: "0px", once: true });

  const getDecimalPlaces = (number_: number): number => {
    const string_ = number_.toString();
    if (string_.includes(".")) {
      const decimals = string_.split(".", 2)[1];
      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatValue = useCallback(
    (latest: number) => {
      const hasDecimals = maxDecimals > 0;

      const options: Intl.NumberFormatOptions = {
        maximumFractionDigits: hasDecimals ? maxDecimals : 0,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        useGrouping: !!separator,
      };

      const formattedNumber = new Intl.NumberFormat("en-US", options).format(latest);

      return separator ? formattedNumber.replaceAll(",", separator) : formattedNumber;
    },
    [maxDecimals, separator],
  );

  useEffect(() => {
    if (reference.current) {
      reference.current.textContent = formatValue(direction === "down" ? to : from);
    }
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    if (!(isInView && startWhen)) {
      return;
    }

    if (typeof onStart === "function") {
      onStart();
    }

    const timeoutId = setTimeout(() => {
      motionValue.set(direction === "down" ? from : to);
    }, delay * 1000);

    const durationTimeoutId = setTimeout(
      () => {
        if (typeof onEnd === "function") {
          onEnd();
        }
      },
      delay * 1000 + duration * 1000,
    );

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(durationTimeoutId);
    };
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest: number) => {
      if (reference.current) {
        reference.current.textContent = formatValue(latest);
      }
    });

    return () => unsubscribe();
  }, [springValue, formatValue]);

  return <span className={className} ref={reference} />;
}
