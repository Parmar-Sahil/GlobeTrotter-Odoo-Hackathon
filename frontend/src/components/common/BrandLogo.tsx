import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  variant?: "dark" | "light" | "auto";
}

export function BrandLogo({
  className = "",
  size = "md",
  href = "/",
  variant = "auto",
}: BrandLogoProps) {
  const iconSizes = {
    sm: "w-7 h-7 rounded-lg",
    md: "w-9 h-9 rounded-xl",
    lg: "w-11 h-11 rounded-2xl",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const getTextColor = () => {
    if (variant === "light") return "text-white";
    if (variant === "dark") return "text-slate-900";
    return "text-slate-900 dark:text-white";
  };

  const content = (
    <div
      className={`inline-flex items-center gap-2.5 font-extrabold tracking-tight group select-none ${className}`}
    >
      {/* Orange Airplane Icon Badge */}
      <div
        className={`flex items-center justify-center bg-[#F95724] text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform duration-200 p-1.5 shrink-0 ${iconSizes[size]}`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-white"
          fill="currentColor"
        >
          {/* Contrail Swoosh */}
          <path
            d="M14 85C29 82 42 66 46 56C39 68 28 78 14 85Z"
            fill="white"
            opacity="0.95"
          />
          <path
            d="M23 89C31 85 38 75 41 69C36 77 29 84 23 89Z"
            fill="white"
            opacity="0.75"
          />
          {/* Airplane */}
          <path
            d="M74 27C76 29 75 33 71 36L57 46L65 67C66 69 65 70 63 70L56 68L46 53L35 61L37 69C38 71 36 72 35 71L31 70L26 59L15 54L14 50C14 48 15 47 17 48L25 49L33 38L18 28L17 22C16 20 18 19 19 20L41 28L51 15C54 11 58 10 60 12C62 14 61 17 57 20L74 27Z"
            fill="white"
          />
        </svg>
      </div>

      {/* GlobTrottler Wordmark */}
      <span
        className={`${textSizes[size]} ${getTextColor()} font-extrabold tracking-tight transition-colors`}
      >
        Glob<span className="text-[#F95724]">Trottler</span>
      </span>
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex items-center">
      {content}
    </Link>
  );
}
