"use client";

import { useState, useRef, useEffect, ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  delay?: number;
}

export default function Tooltip({ content, children, delay = 300 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      // Calculate position
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceAbove = rect.top;
        const spaceBelow = window.innerHeight - rect.bottom;

        // Show below if not enough space above
        setPosition(spaceAbove < 80 && spaceBelow > 80 ? 'bottom' : 'top');
      }
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute left-1/2 -translate-x-1/2 z-[100000] px-3 py-2
            bg-gray-900 dark:bg-gray-950 midnight:bg-gray-950 purple:bg-gray-950
            text-white text-sm font-medium rounded-lg shadow-2xl
            whitespace-nowrap pointer-events-none
            border border-gray-700 dark:border-gray-800 midnight:border-cyan-500/30 purple:border-pink-500/30
            backdrop-blur-sm
            animate-in fade-in zoom-in-95 duration-200
            ${position === 'top'
              ? 'bottom-full mb-2 slide-in-from-bottom-2'
              : 'top-full mt-2 slide-in-from-top-2'
            }
          `}
          style={{
            maxWidth: '300px',
            wordWrap: 'break-word',
            whiteSpace: 'normal',
          }}
        >
          {/* Tooltip arrow */}
          <div
            className={`
              absolute left-1/2 -translate-x-1/2 w-2 h-2 rotate-45
              bg-gray-900 dark:bg-gray-950 midnight:bg-gray-950 purple:bg-gray-950
              border-gray-700 dark:border-gray-800 midnight:border-cyan-500/30 purple:border-pink-500/30
              ${position === 'top'
                ? 'bottom-[-4px] border-r border-b'
                : 'top-[-4px] border-l border-t'
              }
            `}
          />
          <span className="relative z-10">{content}</span>
        </div>
      )}
    </div>
  );
}
