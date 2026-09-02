"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { flushSync, createPortal } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ModernCalendarProps {
  value: string;
  onChange: (date: string) => void;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export default function ModernCalendar({ value, onChange, onClose, triggerRef }: ModernCalendarProps) {
  const [currentDate, setCurrentDate] = useState(
    value ? new Date(value) : new Date()
  );
  const [displayMonth, setDisplayMonth] = useState(() => {
    const date = value ? new Date(value) : new Date();
    return date.getMonth();
  });
  const [displayYear, setDisplayYear] = useState(() => {
    const date = value ? new Date(value) : new Date();
    return date.getFullYear();
  });
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [calendarStyle, setCalendarStyle] = useState<React.CSSProperties>({});
  const calendarRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const monthGridRef = useRef<HTMLDivElement>(null);
  const yearGridRef = useRef<HTMLDivElement>(null);
  const isSelectingRef = useRef(false); // Track if user is selecting a date
  const isNavigatingRef = useRef(false); // Track if user is navigating (changing month/year)
  const prevValueRef = useRef<string | undefined>(value); // Track previous value prop
  const isProcessingMonthYearClickRef = useRef(false); // Track if we're processing a month/year selection

  // Track if component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync currentDate with value prop when it changes externally (not during navigation)
  useEffect(() => {
    // Only sync if value actually changed (external change) and not during navigation
    if (prevValueRef.current === value || isNavigatingRef.current) {
      prevValueRef.current = value;
      return;
    }

    prevValueRef.current = value;

    if (value) {
      const dateFromValue = new Date(value);
      if (!isNaN(dateFromValue.getTime())) {
        setCurrentDate((prevDate) => {
          // Only update if the year or month actually changed
          if (
            dateFromValue.getFullYear() !== prevDate.getFullYear() ||
            dateFromValue.getMonth() !== prevDate.getMonth()
          ) {
            setDisplayMonth(dateFromValue.getMonth());
            setDisplayYear(dateFromValue.getFullYear());
            return dateFromValue;
          }
          return prevDate;
        });
      }
    } else {
      // If value is cleared, reset to today
      setCurrentDate((prevDate) => {
        const today = new Date();
        // Only reset if not already today
        if (
          today.getFullYear() !== prevDate.getFullYear() ||
          today.getMonth() !== prevDate.getMonth()
        ) {
          setDisplayMonth(today.getMonth());
          setDisplayYear(today.getFullYear());
          return today;
        }
        return prevDate;
      });
    }
  }, [value]);

  // Calculate calendar position
  const updateCalendarPosition = useCallback(() => {
    if (!triggerRef?.current || typeof window === 'undefined') return;

    const rect = triggerRef.current.getBoundingClientRect();
    const calendarWidth = 320; // min-w-[320px]
    const calendarHeight = calendarRef.current?.offsetHeight || 400; // Use actual height if available
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = window.innerWidth - rect.left;
    const marginFromEdge = 16;

    // Position below by default
    let top = rect.bottom + 8; // mt-2 = 8px
    let left = rect.left;
    let maxHeight = spaceBelow - marginFromEdge;

    // If not enough space below, position above
    if (spaceBelow < calendarHeight && spaceAbove > calendarHeight) {
      top = rect.top - calendarHeight - 8;
      maxHeight = spaceAbove - marginFromEdge;
    } else if (spaceBelow < calendarHeight && spaceAbove < calendarHeight) {
      // If not enough space above or below, use the side with more space
      if (spaceBelow > spaceAbove) {
        top = rect.bottom + 8;
        maxHeight = spaceBelow - marginFromEdge;
      } else {
        // Position at top of viewport with max available height
        top = marginFromEdge;
        maxHeight = rect.top - marginFromEdge - 8;
      }
    }

    // If not enough space on right, align to right edge
    if (spaceRight < calendarWidth) {
      left = window.innerWidth - calendarWidth - marginFromEdge;
    }

    // Ensure calendar doesn't go off left edge
    if (left < marginFromEdge) {
      left = marginFromEdge;
    }

    // Ensure calendar stays within viewport vertically
    const maxTop = window.innerHeight - Math.min(calendarHeight, maxHeight) - marginFromEdge;
    top = Math.max(marginFromEdge, Math.min(top, maxTop));

    setCalendarStyle({
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${calendarWidth}px`,
      maxHeight: `${maxHeight}px`,
      zIndex: 10000, // Higher than modal z-index (9999) to appear above modals
    });
  }, [triggerRef]);

  // Update position when calendar opens or when month/year dropdowns change
  useEffect(() => {
    if (isMounted && triggerRef?.current) {
      // Initial position update - only if dropdowns are not open
      if (!isMonthDropdownOpen && !isYearDropdownOpen) {
        updateCalendarPosition();
      }
      
      // Find all scrollable parent elements
      const findScrollableParents = (element: HTMLElement | null): HTMLElement[] => {
        const scrollableParents: HTMLElement[] = [];
        let current: HTMLElement | null = element;
        
        while (current && current !== document.body && current !== document.documentElement) {
          const style = window.getComputedStyle(current);
          const overflowY = style.overflowY;
          const overflowX = style.overflowX;
          
          if (
            overflowY === 'auto' || overflowY === 'scroll' ||
            overflowX === 'auto' || overflowX === 'scroll' ||
            current.scrollHeight > current.clientHeight ||
            current.scrollWidth > current.clientWidth
          ) {
            scrollableParents.push(current);
          }
          
          current = current.parentElement;
        }
        
        return scrollableParents;
      };
      
      const handleResize = () => {
        // Don't update position if dropdowns are open
        if (!isMonthDropdownOpen && !isYearDropdownOpen) {
          updateCalendarPosition();
        }
      };
      
      const handleScroll = (event: Event) => {
        // Don't update position if user is actively selecting a date
        if (isSelectingRef.current) {
          return;
        }
        
        // Check if scroll event is from within calendar's internal elements
        const target = event.target as HTMLElement;
        if (target && calendarRef.current) {
          // Check if the scroll is happening inside the calendar or its scrollable children
          if (
            calendarRef.current.contains(target) ||
            monthDropdownRef.current?.contains(target) ||
            yearDropdownRef.current?.contains(target) ||
            monthGridRef.current?.contains(target) ||
            yearGridRef.current?.contains(target)
          ) {
            // Scroll is within calendar, don't update position
            return;
          }
        }
        
        // Update calendar position immediately on every scroll event (real-time following)
        // Don't update if dropdowns are open to prevent jumping
        if (!isMonthDropdownOpen && !isYearDropdownOpen) {
          // Update position immediately for real-time following
          updateCalendarPosition();
        }
      };
      
      // Listen to scroll on window, document, and body
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      document.addEventListener('scroll', handleScroll, true);
      if (document.body) {
        document.body.addEventListener('scroll', handleScroll, true);
      }
      
      // Listen to scroll on all scrollable parent containers
      const scrollableParents = findScrollableParents(triggerRef.current);
      scrollableParents.forEach(parent => {
        parent.addEventListener('scroll', handleScroll, true);
      });
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
        document.removeEventListener('scroll', handleScroll, true);
        if (document.body) {
          document.body.removeEventListener('scroll', handleScroll, true);
        }
        scrollableParents.forEach(parent => {
          parent.removeEventListener('scroll', handleScroll, true);
        });
      };
         }
   }, [isMounted, updateCalendarPosition, triggerRef, onClose, isMonthDropdownOpen, isYearDropdownOpen]);

  // Track previous dropdown state to only update position when closing (not opening)
  const prevMonthDropdownRef = useRef(false);
  const prevYearDropdownRef = useRef(false);

  // Update position when dropdowns close (but not when they open)
  useEffect(() => {
    if (isMounted && triggerRef?.current) {
      const wasDropdownOpen = prevMonthDropdownRef.current || prevYearDropdownRef.current;
      const isDropdownOpen = isMonthDropdownOpen || isYearDropdownOpen;
      
      // Only update position when transitioning from open to closed
      if (wasDropdownOpen && !isDropdownOpen) {
        // Small delay to ensure dropdown has fully closed before recalculating
        const timeoutId = setTimeout(() => {
          updateCalendarPosition();
        }, 100);
        
        prevMonthDropdownRef.current = isMonthDropdownOpen;
        prevYearDropdownRef.current = isYearDropdownOpen;
        
        return () => clearTimeout(timeoutId);
      }
      
      // Update refs for next comparison
      prevMonthDropdownRef.current = isMonthDropdownOpen;
      prevYearDropdownRef.current = isYearDropdownOpen;
    }
  }, [isMounted, isMonthDropdownOpen, isYearDropdownOpen, updateCalendarPosition, triggerRef]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // Generate year range (current year - 100 to current year + 10)
  const todayYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 111 }, (_, i) => todayYear - 100 + i);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    // Adjust firstDay to start from Monday (0 = Monday)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Convert Sunday (0) to 6, others shift by -1
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, daysInPrevMonth - i),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    // Next month days to complete the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    isNavigatingRef.current = true;
    // Calculate new date based on current date
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    const newMonth = newDate.getMonth();
    const newYear = newDate.getFullYear();
    // Update all states separately
    flushSync(() => {
      setCurrentDate(newDate);
      setDisplayMonth(newMonth);
      setDisplayYear(newYear);
    });
    // Reset flag after React has processed the state update
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 10);
      });
    });
  };

  const handleNextMonth = () => {
    isNavigatingRef.current = true;
    // Calculate new date based on current date
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    const newMonth = newDate.getMonth();
    const newYear = newDate.getFullYear();
    // Update all states separately
    flushSync(() => {
      setCurrentDate(newDate);
      setDisplayMonth(newMonth);
      setDisplayYear(newYear);
    });
    // Reset flag after React has processed the state update
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 10);
      });
    });
  };

  const handleYearChange = (year: number) => {
    isNavigatingRef.current = true;
    const newDate = new Date(year, currentDate.getMonth(), 1);
    const newMonth = newDate.getMonth();
    // Close dropdown first, then update states
    setIsYearDropdownOpen(false);
    // Update all states together
    flushSync(() => {
      setCurrentDate(newDate);
      setDisplayYear(year);
      setDisplayMonth(newMonth);
    });
    // Reset flag after React has processed the state update
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 10);
      });
    });
  };

  const handleMonthChange = (month: number) => {
    isNavigatingRef.current = true;
    const newDate = new Date(currentDate.getFullYear(), month, 1);
    const newYear = newDate.getFullYear();
    // Close dropdown first, then update states
    setIsMonthDropdownOpen(false);
    // Update all states together
    flushSync(() => {
      setCurrentDate(newDate);
      setDisplayMonth(month);
      setDisplayYear(newYear);
    });
    // Reset flag after React has processed the state update
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 10);
      });
    });
  };

  const handleDateSelect = (date: Date) => {
    isSelectingRef.current = true; // Mark that we're selecting a date
    const formattedDate = date.toISOString().split("T")[0];
    
    // Immediately update the value
    onChange(formattedDate);
    
    // Close calendar after a delay to ensure React state updates are flushed
    // Use double requestAnimationFrame to ensure state has been processed
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          isSelectingRef.current = false; // Reset flag
          onClose();
        }, 100);
      });
    });
  };

  // Handle click outside to close dropdowns and calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if user is actively selecting a date or month/year
      if (isSelectingRef.current || isProcessingMonthYearClickRef.current) {
        return;
      }
      
      const target = event.target as Node;
      
      // Close month/year dropdowns if clicking outside (but check month/year grids too)
      if (isMonthDropdownOpen && monthDropdownRef.current && !monthDropdownRef.current.contains(target)) {
        // Also check if click is in the month grid
        if (!monthGridRef.current?.contains(target)) {
          setIsMonthDropdownOpen(false);
        }
      }
      if (isYearDropdownOpen && yearDropdownRef.current && !yearDropdownRef.current.contains(target)) {
        // Also check if click is in the year grid
        if (!yearGridRef.current?.contains(target)) {
          setIsYearDropdownOpen(false);
        }
      }
      
      // Close calendar if clicking outside both calendar and trigger
      if (calendarRef.current && !calendarRef.current.contains(target)) {
        if (triggerRef?.current && !triggerRef.current.contains(target)) {
          onClose();
        }
      }
    };

    // Use click instead of mousedown to allow button clicks to fire first
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClose, triggerRef, isMonthDropdownOpen, isYearDropdownOpen]);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!value) return false;
    const selected = new Date(value);
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    );
  };

  const days = getDaysInMonth(currentDate);

  const calendarContent = (
    <div
      ref={calendarRef}
      style={calendarStyle}
      className="fixed bg-surface rounded-xl shadow-2xl border border-line p-4 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-line">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
        </button>

        <div className="flex items-center gap-2">
          <div className="relative" ref={monthDropdownRef}>
                         <button
               type="button"
               onClick={() => {
                 setIsMonthDropdownOpen(!isMonthDropdownOpen);
                 setIsYearDropdownOpen(false);
               }}
                                                               className={`appearance-none text-base font-bold text-ink bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-gray-700 dark:to-gray-700/50 midnight:from-cyan-900/30 midnight:to-cyan-800/20 purple:from-pink-900/30 purple:to-pink-800/20 hover:from-blue-100 hover:to-blue-100 dark:hover:from-gray-600 dark:hover:to-gray-600 midnight:hover:from-cyan-900/40 midnight:hover:to-cyan-800/30 purple:hover:from-pink-900/40 purple:hover:to-pink-800/30 rounded-lg px-3 py-1.5 pr-8 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-400/40 midnight:focus:ring-cyan-500/40 purple:focus:ring-pink-500/40 transition-all shadow-sm border border-blue-200/50 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 ${isMonthDropdownOpen ? 'ring-2 ring-blue-500/50 dark:ring-blue-400/50' : ''}`}
                 key={`month-${displayMonth}-${displayYear}`}
               >
                 {monthNames[displayMonth]}
               </button>
            <ChevronRight className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 pointer-events-none transition-transform ${isMonthDropdownOpen ? 'rotate-[-90deg]' : 'rotate-90'}`} />

            {/* Month dropdown removed - will be shown as a grid view instead */}
          </div>
          <div className="relative" ref={yearDropdownRef}>
                         <button
               type="button"
               onClick={() => {
                 setIsYearDropdownOpen(!isYearDropdownOpen);
                 setIsMonthDropdownOpen(false);
               }}
                                                               className={`appearance-none text-base font-bold text-ink bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-gray-700 dark:to-gray-700/50 midnight:from-purple-900/30 midnight:to-purple-800/20 purple:from-pink-900/30 purple:to-pink-800/20 hover:from-purple-100 hover:to-purple-100 dark:hover:from-gray-600 dark:hover:to-gray-600 midnight:hover:from-purple-900/40 midnight:hover:to-purple-800/30 purple:hover:from-pink-900/40 purple:hover:to-pink-800/30 rounded-lg px-3 py-1.5 pr-8 cursor-pointer outline-none focus:ring-2 focus:ring-purple-500/40 dark:focus:ring-purple-400/40 midnight:focus:ring-cyan-500/40 purple:focus:ring-pink-500/40 transition-all shadow-sm border border-purple-200/50 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 ${isYearDropdownOpen ? 'ring-2 ring-purple-500/50 dark:ring-purple-400/50' : ''}`}
                 key={`year-${displayYear}-${displayMonth}`}
               >
                 {displayYear}
               </button>
            <ChevronRight className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 pointer-events-none transition-transform ${isYearDropdownOpen ? 'rotate-[-90deg]' : 'rotate-90'}`} />
          </div>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
        </button>
      </div>

      {/* Month Selection View */}
      {isMonthDropdownOpen ? (
        <div ref={monthGridRef} className="max-h-64 overflow-y-auto py-2">
          <div className="grid grid-cols-3 gap-2">
                                                                                                                                                                                                               {monthNames.map((month, index) => (
                  <button
                    key={month}
                    type="button"
                                      onClick={(e) => {
                       e.stopPropagation();
                       isProcessingMonthYearClickRef.current = true;
                       handleMonthChange(index);
                       // Reset flag after a delay to allow click outside handler to skip
                       setTimeout(() => {
                         isProcessingMonthYearClickRef.current = false;
                       }, 100);
                     }}
                className={`h-12 w-full flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer ${
                  currentDate.getMonth() === index
                    ? 'bg-blue-500 dark:bg-blue-600 midnight:bg-blue-600 purple:bg-blue-500 text-white font-semibold shadow-md'
                    : 'text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20'
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      ) : isYearDropdownOpen ? (
        /* Year Selection View */
        <div ref={yearGridRef} className="max-h-64 overflow-y-auto py-2">
          <div className="grid grid-cols-4 gap-1">
                                                                                                                                                                                                               {yearRange.map((year) => (
                  <button
                    key={year}
                    type="button"
                                      onClick={(e) => {
                       e.stopPropagation();
                       isProcessingMonthYearClickRef.current = true;
                       handleYearChange(year);
                       // Reset flag after a delay to allow click outside handler to skip
                       setTimeout(() => {
                         isProcessingMonthYearClickRef.current = false;
                       }, 100);
                     }}
                className={`h-10 w-full flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer ${
                  currentDate.getFullYear() === year
                    ? 'bg-purple-500 dark:bg-purple-600 midnight:bg-purple-600 purple:bg-pink-500 text-white font-semibold shadow-md'
                    : 'text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 py-1.5"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((dayInfo, index) => {
              const selected = isSelected(dayInfo.date);
              const today = isToday(dayInfo.date);

              return (
                                 <button
                   key={index}
                   type="button"
                   onClick={(e) => {
                     e.stopPropagation();
                     handleDateSelect(dayInfo.date);
                   }}
                   className={`
                    relative h-9 w-full flex items-center justify-center text-sm font-medium rounded-full transition-all duration-150 cursor-pointer
                    ${!dayInfo.isCurrentMonth
                      ? "text-gray-300 dark:text-gray-600 midnight:text-cyan-300/30 purple:text-pink-300/30 hover:bg-gray-50 dark:hover:bg-[#22262e]"
                      : "text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100"
                    }
                    ${selected
                      ? "bg-blue-500 dark:bg-blue-600 midnight:bg-cyan-500 purple:bg-pink-500 text-white font-semibold shadow-md hover:bg-blue-600 dark:hover:bg-blue-700"
                      : "hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20"
                    }
                    ${today && !selected
                      ? "ring-1 ring-blue-500 dark:ring-blue-400 midnight:ring-cyan-400 purple:ring-pink-400"
                      : ""
                    }
                  `}
                >
                  {dayInfo.day}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Quick actions */}
      <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-line">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            isSelectingRef.current = true;
            const today = new Date();
            const formattedDate = today.toISOString().split("T")[0];
            onChange(formattedDate);
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setTimeout(() => {
                  isSelectingRef.current = false;
                  onClose();
                }, 100);
              });
            });
          }}
          className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 rounded-lg transition-colors cursor-pointer"
        >
          Today
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange(""); // Clear the date value
            onClose(); // Close the calendar
          }}
          className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded-lg transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>
  );

  if (!isMounted) return null;

  return createPortal(calendarContent, document.body);
}
