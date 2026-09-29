import { useInView, useMotionValue, useSpring } from "motion/react";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { shouldReduceMotion } from "@/lib/reduced-motion";

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

  /*
   * 护栏：精度由传入值推导，但不给裸浮点数（如 45 / 3.96 = 11.363636363636363）
   * 留出十几位小数的余地。调用方仍应先按 @/lib/format 舍入到自己要的口径，
   * 这里只保证最坏情况下也不会把长尾整个画出来。
   */
  const MAX_DECIMALS = 2;
  const maxDecimals = Math.min(MAX_DECIMALS, Math.max(getDecimalPlaces(from), getDecimalPlaces(to)));

  /*
   * Intl.NumberFormat 的构造开销远大于 format()：springValue 的 change 回调
   * 每帧都会走一次 formatValue，逐帧 new 就是把构造成本乘上帧数
   * （首页三个 CountUp 并发、duration=2 时一秒内约 360 次）。
   * maxDecimals 与 separator 在组件生命周期内都是常量，按它俩缓存即可。
   */
  const formatter = useMemo(
    () => {
      const hasDecimals = maxDecimals > 0;

      return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: hasDecimals ? maxDecimals : 0,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        useGrouping: !!separator,
      });
    },
    [maxDecimals, separator],
  );

  const formatValue = useCallback(
    (latest: number) => {
      const formattedNumber = formatter.format(latest);

      return separator ? formattedNumber.replaceAll(",", separator) : formattedNumber;
    },
    [formatter, separator],
  );

  useEffect(() => {
    if (!reference.current) {
      return;
    }
    // 减少动态效果：初始即显示终值，不等待进入视口
    reference.current.textContent = shouldReduceMotion()
      ? formatValue(direction === "down" ? from : to)
      : formatValue(direction === "down" ? to : from);
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    if (!(isInView && startWhen)) {
      return;
    }

    if (shouldReduceMotion()) {
      // 减少动态效果：直接显示终值，不跑数字滚动
      if (reference.current) {
        reference.current.textContent = formatValue(direction === "down" ? from : to);
      }
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
