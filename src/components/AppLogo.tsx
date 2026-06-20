import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function AppLogo({ className = '', size = 'md', showText = true }: AppLogoProps) {
  // Determine sizing class
  let containerSize = 'h-20 w-20 rounded-2xl';
  let iconSize = 'h-10 w-10';
  let textSizeClass = 'text-xs tracking-widest';
  let spacingClass = 'space-y-4';

  if (size === 'sm') {
    containerSize = 'h-12 w-12 rounded-xl';
    iconSize = 'h-6 w-6';
    textSizeClass = 'text-[8px] tracking-[0.2em]';
    spacingClass = 'space-y-2';
  } else if (size === 'lg') {
    containerSize = 'h-24 w-24 rounded-3xl';
    iconSize = 'h-12 w-12';
    textSizeClass = 'text-[11px] tracking-[0.25em]';
    spacingClass = 'space-y-5';
  } else if (size === 'xl') {
    containerSize = 'h-32 w-32 rounded-[2rem]';
    iconSize = 'h-16 w-16';
    textSizeClass = 'text-xs tracking-[0.25em]';
    spacingClass = 'space-y-6';
  }

  return (
    <div className={`flex flex-col items-center justify-center ${spacingClass} ${className}`}>
      {/* Icon Frame exactly replicating the user's attachment */}
      <div 
        className={`${containerSize} bg-[#1D2B44] flex items-center justify-center border border-slate-700/60 shadow-xl overflow-hidden relative select-none`}
        style={{
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 10px 25px -5px rgba(2, 6, 17, 0.5)'
        }}
      >
        {/* SVG Drawing of the White Rocket with Light Blue Accents */}
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={iconSize}
        >
          {/* Exhaust Plume / Flame (Bottom-Left) */}
          <path 
            d="M25.5 81.5C27 75 32 64.5 40 58.5C34.5 50.5 25 51.5 19.5 44C16.5 50.5 13.5 61 14.5 69.5C15 74 18 78 25.5 81.5Z" 
            fill="#90A2BE" 
            opacity="0.95"
          />
          <path 
            d="M31 77C32 72 35 64.5 40 58.5C36 54.5 30 54 26 51C24 55 22.5 61.5 23 67C23.5 70.5 26 74.5 31 77Z" 
            fill="#D0DCEE" 
          />
          
          {/* Main Rocket Body Fins (wings) */}
          <path 
            d="M34.5 38L37.5 50L53.5 56.5C53.5 56.5 45 61.5 41 68C36 63 33.5 55.5 34.5 38Z" 
            fill="#FFFFFF" 
          />
          <path 
            d="M62.5 66.5C45.5 65.5 37 57 32 52L44 49.5L56 52.5L62.5 66.5Z" 
            fill="#FFFFFF" 
          />

          {/* Core Fuselage */}
          <path 
            d="M37 62.5C41 53.5 49.5 41 71.5 28.5C69 50.5 56.5 59 47.5 63C44.5 64.3 40.5 65.5 37 62.5Z" 
            fill="#FFFFFF" 
          />
          
          {/* Shadow Details on Rocket Body */}
          <path 
            d="M47.5 63C42 61 38 61 37 62.5C40.5 54.5 48 44 65.5 33.5C53.5 44 48 57 47.5 63Z" 
            fill="#E0E7F1" 
          />

          {/* Window Rim */}
          <circle cx="61.5" cy="38.5" r="7.5" fill="#4B5E7D" />
          {/* Window Glass */}
          <circle cx="61.5" cy="38.5" r="5" fill="#90A2BE" />

          {/* Main engine dark burner at tail */}
          <path d="M41 58.5L44 61.5L42.5 63L39.5 60L41 58.5Z" fill="#243C5A" />
        </svg>

        {/* Glossy light effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
      </div>

      {/* Typography: "ROCKET" and "NEWS" */}
      {showText && (
        <div className="text-center font-display select-none">
          <div className={`${textSizeClass} font-extrabold text-[#FFFFFF] tracking-[0.2em] leading-tight block uppercase`}>
            Rocket
          </div>
          <div className={`${textSizeClass} font-extrabold text-[#FFFFFF] tracking-[0.2em] leading-normal block uppercase mt-0.5`}>
            News
          </div>
        </div>
      )}
    </div>
  );
}
