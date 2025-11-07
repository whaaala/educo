"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: string;
  children: ReactNode;
  delay?: number;
}

export default function Tooltip({ content, children, delay = 300 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;

      // Show below if not enough space above
      const newPosition = spaceAbove < 80 && spaceBelow > 80 ? 'bottom' : 'top';
      setPosition(newPosition);

      // Calculate tooltip position
      const left = rect.left + rect.width / 2;
      const top = newPosition === 'top'
        ? rect.top - 8  // 8px offset from top
        : rect.bottom + 8; // 8px offset from bottom

      setCoords({ top, left });
    }
  };

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      updatePosition();
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

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible]);

  return (
    <>
      <div
        ref={triggerRef}
        className="relative inline-block"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>
      {mounted && isVisible && createPortal(
        <div
          ref={tooltipRef}
          className={`
            fixed z-[100000] px-3 py-2
            bg-gray-900 dark:bg-gray-950 midnight:bg-gray-950 purple:bg-gray-950
            text-white text-sm font-medium rounded-lg shadow-2xl
            whitespace-nowrap pointer-events-none
            border border-gray-700 dark:border-gray-800 midnight:border-cyan-500/30 purple:border-pink-500/30
            backdrop-blur-sm
            animate-in fade-in zoom-in-95 duration-200
            ${position === 'top'
              ? 'slide-in-from-bottom-2'
              : 'slide-in-from-top-2'
            }
          `}
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            transform: position === 'top'
              ? 'translate(-50%, -100%)'
              : 'translate(-50%, 0)',
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
        </div>,
        document.body
      )}
    </>
  );
}
