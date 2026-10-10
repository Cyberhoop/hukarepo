import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const iconSizeClasses =
    size === 'sm'
      ? 'w-7 h-7 sm:w-9 sm:h-9'
      : size === 'lg'
      ? 'w-10 h-10 sm:w-14 sm:h-14'
      : 'w-8 h-8 sm:w-11 sm:h-11';

  const textSizeClasses =
    size === 'sm'
      ? 'text-sm sm:text-lg'
      : size === 'lg'
      ? 'text-xl sm:text-3xl'
      : 'text-base sm:text-2xl';

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-3 bg-black px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl select-none shrink-0 ${className}`}
    >
      {/* Red Circle with White Hookah Silhouette (Exact match to provided logo) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 240"
        fill="none"
        className={`${iconSizeClasses} shrink-0`}
        aria-hidden="true"
      >
        {/* Outer Red Ring */}
        <circle
          cx="120"
          cy="120"
          r="104"
          stroke="#E60000"
          strokeWidth="16"
          fill="#000000"
        />

        {/* White Hookah Body */}
        <g fill="#FFFFFF">
          {/* Top Bowl (Chilam) */}
          <path d="M93 42 C102 47 114 47 123 42 L119 60 C116 66 100 66 97 60 Z" />
          {/* Neck Below Bowl */}
          <rect x="104" y="60" width="8" height="10" rx="2" />
          {/* Ash Tray / Plate */}
          <path d="M89 70 H127 L119 77 H97 Z" />
          {/* Upper Stem Bulb */}
          <ellipse cx="108" cy="87" rx="10" ry="8" />
          {/* Middle Stem Body */}
          <path d="M98 94 C98 94 123 98 123 114 C123 122 116 126 108 126 C98 126 92 120 92 111 Z" />
          {/* Lower Stem / Heart */}
          <ellipse cx="108" cy="137" rx="14" ry="9" />
          {/* Bell Base (Pot) */}
          <path d="M96 143 H120 C129 156 140 170 139 185 C138 193 131 196 108 196 C85 196 78 193 77 185 C76 170 87 156 96 143 Z" />
        </g>

        {/* Curved S-Loop Hose with Black Stroke Separation and White Inner Core */}
        <path
          d="M117 102 C137 88 160 84 164 108 C168 132 147 138 128 126 C110 115 91 98 74 101 C59 104 60 122 65 136"
          stroke="#000000"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M117 102 C137 88 160 84 164 108 C168 132 147 138 128 126 C110 115 91 98 74 101 C59 104 60 122 65 136"
          stroke="#FFFFFF"
          strokeWidth="7.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Hose Mouthpiece Tip */}
        <polygon points="60,132 69,131 68,147" fill="#FFFFFF" />
      </svg>

      {/* Bold Serif Wordmark: SHISHA (White) + RENT (Red) with guaranteed flex gap */}
      <div
        className={`flex items-baseline gap-1.5 sm:gap-2.5 font-luxury font-extrabold tracking-wider leading-none whitespace-nowrap ${textSizeClasses}`}
      >
        <span className="text-white">SHISHA</span>
        <span className="text-[#E60000]">RENT</span>
      </div>
    </div>
  );
};
