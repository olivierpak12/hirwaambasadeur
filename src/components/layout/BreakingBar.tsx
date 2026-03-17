'use client';

interface BreakingBarProps {
  text?: string;
}

export default function BreakingBar({ text = 'Historic peace agreement signed — leaders from 12 nations gather in Kigali for landmark summit' }: BreakingBarProps) {
  return (
    <div className="bg-[#c9a84c] py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-3">
        <span className="bg-[#0f2318] text-[#c9a84c] text-xs font-semibold uppercase tracking-wider px-2 py-1 whitespace-nowrap">
          Breaking
        </span>
        <span className="text-[#0f2318] text-sm font-medium">
          {text}
        </span>
      </div>
    </div>
  );
}