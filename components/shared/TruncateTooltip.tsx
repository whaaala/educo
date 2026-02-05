"use client";

import { useState, useRef, useEffect, cloneElement, ReactElement } from "react";
import { createPortal } from "react-dom";

interface TruncateTooltipProps {
  content: string;
  children: ReactElement<{
    onMouseEnter?: (e: React.MouseEvent) => void;
    onMouseLeave?: (e: React.MouseEvent) => void;
  }>;
  delay?: number;
}

export default function TruncateTooltip({ content, children, delay = 300 }: TruncateTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = () => {
    if (triggerRef.current && tooltipRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;

      // Show below if not enough space above
      const newPosition = spaceAbove < 80 && spaceBelow > 80 ? 'bottom' : 'top';
      setPosition(newPosition);

      // Get tooltip width (estimate if not rendered yet)
      const tooltipWidth = tooltipRef.current.offsetWidth || 200;

      // Calculate initial centered position
      let left = rect.left + rect.width / 2;

      // Check if tooltip would overflow on the left
      const tooltipLeft = left - tooltipWidth / 2;
      if (tooltipLeft < 8) {
        // Align to left edge with padding
        left = tooltipWidth / 2 + 8;
      }

      // Check if tooltip would overflow on the right
      const tooltipRight = left + tooltipWidth / 2;
      if (tooltipRight > window.innerWidth - 8) {
        // Align to right edge with padding
        left = window.innerWidth - tooltipWidth / 2 - 8;
      }

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

  // Clone the child element and add event handlers without wrapping in a div
  const clonedChild = cloneElement(children, {
    ...children.props,
    ref: (node: HTMLElement) => {
      triggerRef.current = node;
      // Preserve original ref if it exists
      const { ref } = children as any;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && typeof ref === 'object') {
        ref.current = node;
      }
    },
    onMouseEnter: (e: React.MouseEvent) => {
      showTooltip();
      // Call original onMouseEnter if it exists
      if (children.props.onMouseEnter) {
        children.props.onMouseEnter(e);
      }
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hideTooltip();
      // Call original onMouseLeave if it exists
      if (children.props.onMouseLeave) {
        children.props.onMouseLeave(e);
      }
    },
  } as any);

  return (
    <>
      {clonedChild}
      {mounted && isVisible && createPortal(
        <div
          ref={tooltipRef}
          className="
            fixed z-[100000] px-3 py-2
            bg-gray-900 dark:bg-gray-950 midnight:bg-gray-950 purple:bg-gray-950
            text-white text-sm font-medium rounded-lg shadow-2xl
            whitespace-nowrap pointer-events-none
            border border-gray-700 dark:border-gray-800 midnight:border-cyan-500/30 purple:border-pink-500/30
            backdrop-blur-sm
            transition-opacity duration-200
          "
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
