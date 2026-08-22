import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const BrandPlaneIcon: React.FC<{ className?: string; size?: number }> = ({
  className = "w-9 h-9",
  size
}) => {
  return (
    <div
      style={size ? { width: size, height: size } : undefined}
      className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden shadow-sm flex-shrink-0 ${className}`}
    >
      {/* Exact SVG matching the user's uploaded orange squircle + plane & vapor trail */}
      <svg
        viewBox="0 0 224 224"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Rounded Orange Squircle Base */}
        <rect width="224" height="224" rx="56" fill="#F2541B" />

        {/* Trail Curve */}
        <path
          d="M 28 196 C 60 188 88 160 108 128 C 96 150 72 178 28 196 Z"
          fill="#FFFFFF"
        />
        <path
          d="M 52 208 C 72 196 86 178 94 162 C 86 176 70 196 52 208 Z"
          fill="#FFFFFF"
          opacity="0.9"
        />

        {/* Airplane Silhouette */}
        <g transform="translate(4, 0)">
          {/* Main Fuselage & Wings */}
          <path
            d="M 174 54 
               C 168 48 158 48 148 58 
               L 112 94 
               L 48 64 
               L 38 74 
               L 86 116 
               L 62 140 
               L 44 134 
               L 36 142 
               L 58 164 
               L 66 156 
               L 60 138 
               L 84 114 
               L 126 162 
               L 136 152 
               L 106 88 
               L 142 52 
               C 152 42 166 46 174 54 Z"
            fill="#FFFFFF"
          />
        </g>
      </svg>
    </div>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  size = 'md',
  showText = true
}) => {
  const sizeClasses = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
    xl: 'h-16'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <BrandPlaneIcon className={sizeClasses[size]} />
      {showText && (
        <span className={`font-display font-extrabold tracking-tight text-slate-900 dark:text-white ${textSizes[size]}`}>
          Glob<span className="text-[#F2541B]">Trottler</span>
        </span>
      )}
    </div>
  );
};
