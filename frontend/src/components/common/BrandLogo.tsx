import React from "react";
import Link from "next/link";
import { Compass } from "lucide-react";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function BrandLogo({ className = "", size = "md", href = "/dashboard" }: BrandLogoProps) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight text-slate-900 group ${className}`}>
      <div className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
        <Compass className={`${iconSizes[size]} transition-transform duration-300 group-hover:rotate-45`} />
      </div>
      <span className={`${textSizes[size]} bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 bg-clip-text text-transparent`}>
        Globe<span className="text-blue-600">Trotter</span>
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
