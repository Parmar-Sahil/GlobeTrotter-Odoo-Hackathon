"use client";

import React, { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  threshold?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  className = "",
}: FadeInProps) {
  return (
    <div className={`transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delay?: number;
}

export function StaggerContainer({
  children,
  className = "",
}: StaggerContainerProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export const staggerItem = {
  hidden: { opacity: 1, y: 0 },
  show: {
    opacity: 1,
    y: 0,
  },
};
