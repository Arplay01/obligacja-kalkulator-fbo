"use client";

import {
  type HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";

type AnimatedTag = "p" | "span" | "strong";

type AnimatedNumberTextProps = HTMLAttributes<HTMLElement> & {
  tag?: AnimatedTag;
  value: number;
  format: (value: number) => string;
};

export function AnimatedNumberText({
  tag = "p",
  value,
  format,
  ...elementProps
}: AnimatedNumberTextProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const hasAnimatedRef = useRef(false);
  const displayValueRef = useRef(value);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }

    if (!hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      displayValueRef.current = value;
      return undefined;
    }

    const startValue = displayValueRef.current;

    if (Math.abs(startValue - value) < 0.0001) {
      animationFrameRef.current = window.requestAnimationFrame(() => {
        displayValueRef.current = value;
        setDisplayValue(value);
        animationFrameRef.current = null;
      });
      return () => {
        if (animationFrameRef.current) {
          window.cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animationFrameRef.current = window.requestAnimationFrame(() => {
        displayValueRef.current = value;
        setDisplayValue(value);
        animationFrameRef.current = null;
      });
      return () => {
        if (animationFrameRef.current) {
          window.cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }

    const startTime = performance.now();
    const duration = 320;

    const tick = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + (value - startValue) * eased;
      displayValueRef.current = nextValue;
      setDisplayValue(nextValue);

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      displayValueRef.current = value;
      setDisplayValue(value);
      animationFrameRef.current = null;
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value]);

  const content = format(displayValue);

  if (tag === "strong") {
    return <strong {...elementProps}>{content}</strong>;
  }

  if (tag === "span") {
    return <span {...elementProps}>{content}</span>;
  }

  return <p {...elementProps}>{content}</p>;
}
