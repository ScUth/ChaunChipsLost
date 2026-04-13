"use client";
import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

export default function MathComponent({ formula }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      katex.render(formula, containerRef.current, {
        throwOnError: false,
      });
    }
  }, [formula]);

  return <span ref={containerRef} />;
}