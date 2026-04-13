"use client";
import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

export default function MathAlign({ formula, display = false }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      katex.render(formula, containerRef.current, {
        throwOnError: false,
        displayMode: display, // Must be true for 'align'
      });
    }
  }, [formula, display]);

  // Use a div if it's display mode to avoid HTML validation nesting errors
  return display ? <div ref={containerRef} /> : <span ref={containerRef} />;
}
