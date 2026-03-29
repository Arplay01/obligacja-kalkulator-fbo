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
  animateOnMount?: boolean;
};

export function AnimatedNumberText({
  tag = "p",
  value,
  format,
  animateOnMount = false,
  ...elementProps
}: AnimatedNumberTextProps) {
  // Bugfix: render the final amount first so slow hydration never leaves the hero at 0,00 zl.
  const [displayValue, setDisplayValue] = useState(value);
  const hasAnimatedRef = useRef(false);
  const displayValueRef = useRef(value);
  const animationFrameRef = useRef<number | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);
  const [isInViewport, setIsInViewport] = useState(!animateOnMount);

  useEffect(() => {
    if (!animateOnMount) {
      return undefined;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const element = elementRef.current;

    if (!element) {
      return undefined;
    }

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry?.isIntersecting ?? false);
      },
      {
        threshold: 0.2,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [animateOnMount]);

  useEffect(() => {
    const scheduleDisplayValueUpdate = (nextValue: number) => {
      animationFrameRef.current = window.requestAnimationFrame(() => {
        displayValueRef.current = nextValue;
        setDisplayValue(nextValue);
        animationFrameRef.current = null;
      });

      return () => {
        if (animationFrameRef.current) {
          window.cancelAnimationFrame(animationFrameRef.current);
        }
      };
    };

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
      return scheduleDisplayValueUpdate(value);
    }

    if (
      (animateOnMount && !isInViewport) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return scheduleDisplayValueUpdate(value);
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
  }, [animateOnMount, isInViewport, value]);

  const content = format(displayValue);

  if (tag === "strong") {
    return (
      <strong
        {...elementProps}
        ref={(node) => {
          elementRef.current = node;
        }}
      >
        {content}
      </strong>
    );
  }

  if (tag === "span") {
    return (
      <span
        {...elementProps}
        ref={(node) => {
          elementRef.current = node;
        }}
      >
        {content}
      </span>
    );
  }

  return (
    <p
      {...elementProps}
      ref={(node) => {
        elementRef.current = node;
      }}
    >
      {content}
    </p>
  );
}
