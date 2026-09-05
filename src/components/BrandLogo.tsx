import React from 'react';

interface BrandLogoProps {
  collapsed?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * CLARIVO Wordmark & Geometric Symbol
 * Based on two intersecting paths converging into one clear path.
 * No robot, brain, sparkle, or AI icons.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({ collapsed = false, className = '', size = 'md' }) => {
  const iconSize = size === 'sm' ? 20 : size === 'lg' ? 28 : 24;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Two intersecting paths becoming one clear path */}
      <div 
        className="relative flex items-center justify-center rounded bg-[#0F4C5C] text-white shrink-0 shadow-sm"
        style={{ width: iconSize + 6, height: iconSize + 6 }}
        title="Clarivo — Clarity before resolution"
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#FAF9F5]"
        >
          {/* Path 1: Upper-left diagonal converging into center horizontal line */}
          <path
            d="M4 6L11 12H20"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Path 2: Lower-left diagonal converging into center horizontal line */}
          <path
            d="M4 18L11 12"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Forward convergence focal point */}
          <circle cx="11" cy="12" r="1.5" fill="#F59E0B" />
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold tracking-[0.08em] text-[15px] text-[#18181B] dark:text-slate-100 font-['IBM_Plex_Sans',sans-serif]">
              CLARIVO
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0F4C5C] dark:bg-[#14B8A6]" />
          </div>
          <span className="text-[9.5px] uppercase font-semibold tracking-wider text-[#64748B] dark:text-slate-400">
            Resolution Copilot
          </span>
        </div>
      )}
    </div>
  );
};
