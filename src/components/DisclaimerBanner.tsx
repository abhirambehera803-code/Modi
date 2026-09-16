import React from 'react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <header className="w-full bg-amber-950/95 border-b border-amber-800/80 px-4 py-1.5 flex items-center justify-center text-center text-xs text-amber-300 font-medium tracking-wide shadow-sm z-30 select-none">
      <span className="flex items-center gap-1.5 flex-wrap justify-center">
        <span className="bg-amber-800/60 text-amber-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
          Parody
        </span>
        <span>Fictional Parody Game – For Entertainment Only</span>
        <span className="hidden sm:inline text-amber-600">•</span>
        <span className="hidden sm:inline text-amber-400/90">Not an official government product</span>
      </span>
    </header>
  );
};
