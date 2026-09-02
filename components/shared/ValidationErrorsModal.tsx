"use client";

import { AlertCircle, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { ValidationErrors } from "@/lib/validation";
import { getFieldLabel } from "@/lib/fieldLabels";
import { getFieldSection } from "@/lib/fieldSections";

interface ValidationErrorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: ValidationErrors;
  title?: string;
  message?: string;
  onScrollToField?: (fieldName: string) => void;
}

export default function ValidationErrorsModal({
  isOpen,
  onClose,
  errors,
  title = "Please Complete Required Fields",
  message = "Please fill in the following required fields before submitting the form:",
  onScrollToField,
}: ValidationErrorsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Scroll modal into view when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      setTimeout(() => {
        modalRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle empty or invalid errors object
  if (!errors || typeof errors !== 'object') {
    return null;
  }

  const errorEntries = Object.entries(errors);
  const errorCount = errorEntries.length;
  
  // Don't render if there are no errors
  if (errorCount === 0) {
    return null;
  }

  // Function to scroll to a field
  const handleScrollToField = (fieldName: string) => {
    // Close modal first
    onClose();
    
    // Use custom scroll handler if provided, otherwise use default
    if (onScrollToField) {
      // Delay to allow modal to close smoothly
      setTimeout(() => {
        onScrollToField(fieldName);
      }, 300);
           } else {
         // Default scroll behavior with improved visibility
         setTimeout(() => {
         // Try to find the error field using multiple strategies
         // First, try to find by data-field attribute
         let errorElement: HTMLElement | null = document.querySelector(`[data-field="${fieldName}"]`);
         
         if (!errorElement) {
           // Look for the actual form input/select/button element
           // For dropdowns, find the button that triggers the dropdown
           errorElement = document.querySelector(
             `button[data-dropdown-trigger="${fieldName}"], 
              button[id*="${fieldName}"], 
              input[name="${fieldName}"], 
              select[name="${fieldName}"], 
              textarea[name="${fieldName}"], 
              [name="${fieldName}"]`
           );
         }
         
         // If still not found, try to find the parent container of the field
         if (!errorElement) {
           // Look for label containing the field name, then find associated input
           const labels = Array.from(document.querySelectorAll('label'));
           const matchingLabel = labels.find(label => {
             const text = label.textContent?.toLowerCase() || '';
             const fieldLabel = getFieldLabel(fieldName)?.toLowerCase() || fieldName.toLowerCase();
             return text.includes(fieldLabel);
           });
           
           if (matchingLabel) {
             // Try to find the input/select/button associated with this label
             const labelFor = matchingLabel.getAttribute('for');
             if (labelFor) {
               errorElement = document.querySelector(`#${labelFor}`) as HTMLElement;
             }
             
             // If not found by ID, look for input/select/button within the label or right after it
             if (!errorElement) {
               const parent = matchingLabel.closest('.relative, .flex, .grid, .form-group, fieldset');
               if (parent) {
                 errorElement = parent.querySelector(
                   'input, select, textarea, button[data-dropdown-trigger], button[role="combobox"]'
                 ) as HTMLElement;
               }
             }
             
             // Last resort: find the next sibling input/select/button
             if (!errorElement) {
               let nextSibling = matchingLabel.nextElementSibling;
               while (nextSibling && !errorElement) {
                 if (nextSibling.matches('input, select, textarea, button')) {
                   errorElement = nextSibling as HTMLElement;
                 } else {
                   errorElement = nextSibling.querySelector('input, select, textarea, button') as HTMLElement;
                 }
                 nextSibling = nextSibling.nextElementSibling;
               }
             }
           }
         }
         
         // If still not found, look for the form section containing this field
         if (!errorElement) {
           errorElement = document.querySelector(`[id*="${fieldName}"]`);
         }
         
         // Last resort: try to find by section
         if (!errorElement) {
           const sectionName = getFieldSection(fieldName);
           // Look for section headers that might contain the section name
           const sectionHeaders = Array.from(document.querySelectorAll('h2, h3, button'));
           const sectionHeader = sectionHeaders.find(el => 
             el.textContent?.toLowerCase().includes(sectionName.toLowerCase())
           ) as HTMLElement | undefined;
           if (sectionHeader) {
             errorElement = sectionHeader.closest('section') as HTMLElement || sectionHeader;
           }
         }
        
        if (errorElement) {
          // Find the scrollable parent container (usually the main content area)
          const findScrollableParent = (element: HTMLElement): HTMLElement | null => {
            let parent = element.parentElement;
            while (parent && parent !== document.body) {
              const style = window.getComputedStyle(parent);
              if (
                style.overflowY === 'auto' ||
                style.overflowY === 'scroll' ||
                style.overflow === 'auto' ||
                style.overflow === 'scroll'
              ) {
                return parent;
              }
              parent = parent.parentElement;
            }
            return null;
          };

          const scrollableParent = findScrollableParent(errorElement);
          const headerOffset = 120; // Account for fixed header (adjust based on your header height)
          const topPadding = 20; // Space from header
          const bottomPadding = 40; // Space at the bottom
          
          // Function to scroll with proper offset ensuring entire field is visible and stays in viewport
          const scrollToElement = () => {
            const elementRect = errorElement!.getBoundingClientRect();
            const elementHeight = elementRect.height;
            
            // Get viewport dimensions
            const viewportHeight = scrollableParent 
              ? scrollableParent.clientHeight 
              : window.innerHeight || document.documentElement.clientHeight;

            if (scrollableParent) {
              // Scroll within the scrollable parent
              const parentRect = scrollableParent.getBoundingClientRect();
              const parentScrollTop = scrollableParent.scrollTop;
              
              // Calculate the element's position relative to the scrollable parent
              const elementTopRelativeToParent = elementRect.top - parentRect.top + parentScrollTop;
              
              // Get the total scrollable height
              const scrollHeight = scrollableParent.scrollHeight;
              
              // Calculate ideal scroll position to show element with proper spacing
              // Priority: Keep element fully visible with spacing, position it below header with padding
              const targetScrollTop = elementTopRelativeToParent - headerOffset - topPadding;
              
              // Ensure we don't scroll past boundaries
              const maxScrollTop = Math.max(0, scrollHeight - viewportHeight);
              const finalScrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop));
              
              scrollableParent.scrollTo({
                top: finalScrollTop,
                behavior: "smooth"
              });
            } else {
              // Scroll the window
              const absoluteElementTop = elementRect.top + (window.pageYOffset || document.documentElement.scrollTop);
              
              // Get document height
              const documentHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
              );
              
              // Calculate ideal scroll position - position element below header with padding
              const targetScrollTop = absoluteElementTop - headerOffset - topPadding;
              
              // Ensure we don't scroll past boundaries
              const maxScrollTop = Math.max(0, documentHeight - viewportHeight);
              const finalScrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop));
              
              window.scrollTo({
                top: finalScrollTop,
                behavior: "smooth"
              });
                         }

             // Focus the element after scrolling (for accessibility and to open dropdowns)
             // Use a longer delay to ensure scroll animation completes first
             setTimeout(() => {
               // Prevent browser's default scroll behavior when focusing
               const preventScrollOnFocus = (e: FocusEvent) => {
                 e.preventDefault();
                 // Restore scroll position if browser tried to scroll
                 if (scrollableParent) {
                   scrollableParent.scrollTop = scrollableParent.scrollTop;
                 } else {
                   window.scrollTo({
                     top: window.pageYOffset || document.documentElement.scrollTop,
                     behavior: 'instant'
                   });
                 }
               };

               // Add temporary listener to prevent scroll on focus
               errorElement!.addEventListener('focus', preventScrollOnFocus, { once: true, passive: false });
               
               // Try to focus the element or click it to open dropdown
               if (errorElement instanceof HTMLButtonElement || errorElement.getAttribute('role') === 'combobox') {
                 // For dropdowns, click to open without triggering scroll
                 errorElement.click();
               } else if (errorElement instanceof HTMLElement && (errorElement.tagName === 'INPUT' || errorElement.tagName === 'SELECT' || errorElement.tagName === 'TEXTAREA')) {
                 // For inputs, focus them
                 errorElement.focus({ preventScroll: true });
               }
               
               // Remove the listener after a short delay
               setTimeout(() => {
                 errorElement!.removeEventListener('focus', preventScrollOnFocus);
               }, 100);
             }, 600);

             // Single verification after scroll completes - only adjust if element is actually cut off
             // Use a longer delay to allow dropdown to open and layout to stabilize
             setTimeout(() => {
               const rect = errorElement!.getBoundingClientRect();
               const currentViewportHeight = scrollableParent 
                 ? scrollableParent.clientHeight 
                 : window.innerHeight || document.documentElement.clientHeight;
               
               const elementTop = rect.top;
               const elementBottom = rect.bottom;
               
               // Only adjust if element is actually not fully visible (with tolerance)
               const tolerance = 5; // Small tolerance to avoid minor adjustments
               const needsTopAdjustment = elementTop < (headerOffset - tolerance);
               const needsBottomAdjustment = elementBottom > (currentViewportHeight - bottomPadding + tolerance);
               
               if (needsTopAdjustment) {
                 // Element top is cut off by header - scroll up just enough to reveal it
                 const adjustment = elementTop - headerOffset - topPadding;
                 
                 if (scrollableParent) {
                   const currentScroll = scrollableParent.scrollTop;
                   scrollableParent.scrollTo({
                     top: currentScroll + adjustment,
                     behavior: "smooth"
                   });
                 } else {
                   window.scrollTo({
                     top: (window.pageYOffset || document.documentElement.scrollTop) + adjustment,
                     behavior: "smooth"
                   });
                 }
               } else if (needsBottomAdjustment && !needsTopAdjustment) {
                 // Only adjust bottom if top is already visible (to prevent conflicts)
                 const adjustment = elementBottom - (currentViewportHeight - bottomPadding);
                 
                 if (scrollableParent) {
                   const currentScroll = scrollableParent.scrollTop;
                   scrollableParent.scrollTo({
                     top: currentScroll + adjustment,
                     behavior: "smooth"
                   });
                 } else {
                   window.scrollTo({
                     top: (window.pageYOffset || document.documentElement.scrollTop) + adjustment,
                     behavior: "smooth"
                   });
                 }
               }
             }, 1000); // Longer delay to allow dropdown to open and layout to stabilize
          };

          scrollToElement();

          // Highlight the element briefly with a subtle, elegant animation
          setTimeout(() => {
            // Add subtle ring with smooth animation
            errorElement?.classList.add(
              'ring-2', 
              'ring-blue-400/40', 
              'dark:ring-blue-500/40',
              'midnight:ring-cyan-400/40',
              'purple:ring-pink-400/40',
              'shadow-lg',
              'shadow-blue-200/20',
              'dark:shadow-blue-500/10',
              'transition-all',
              'duration-500',
              'ease-out'
            );
            
            // Remove highlight after delay with smooth fade out
            setTimeout(() => {
              errorElement?.classList.add('transition-all', 'duration-500', 'ease-in');
              errorElement?.classList.remove(
                'ring-2', 
                'ring-blue-400/40',
                'dark:ring-blue-500/40',
                'midnight:ring-cyan-400/40',
                'purple:ring-pink-400/40',
                'shadow-lg',
                'shadow-blue-200/20',
                'dark:shadow-blue-500/10'
              );
              // Clean up transition classes after animation completes
              setTimeout(() => {
                errorElement?.classList.remove('transition-all', 'duration-500', 'ease-out', 'ease-in');
              }, 500);
            }, 2500);
          }, 600);
        }
      }, 300);
    }
  };

     return (
     <div
       className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
       onClick={onClose}
     >
       {/* Modal Content */}
              <div
         ref={modalRef}
         className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] mb-4 flex flex-col animate-in zoom-in-95 duration-200"
         onClick={(e) => e.stopPropagation()}
       >
        {/* Header */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 midnight:bg-yellow-900/20 purple:bg-yellow-900/20 px-6 pt-3 pb-2 rounded-t-2xl border-b border-yellow-100 dark:border-yellow-800/30 midnight:border-yellow-700/30 purple:border-yellow-700/30 flex-shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-3 flex-1">
              {/* Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500 dark:bg-yellow-400 rounded-full opacity-20 animate-ping"></div>
                <div className="relative w-9 h-9 bg-yellow-500 dark:bg-yellow-600 midnight:bg-yellow-600 purple:bg-yellow-600 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 midnight:hover:bg-yellow-900/30 purple:hover:bg-yellow-900/30 transition-colors duration-200 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 ml-12">
            {errorCount} {errorCount === 1 ? 'field' : 'fields'} {errorCount === 1 ? 'needs' : 'need'} to be completed
          </p>
        </div>

                 {/* Content */}
         <div className="px-6 pt-3 pb-4 flex-1 overflow-hidden flex flex-col min-h-0">
           {/* Message */}
           <div className="mb-3 p-2.5 bg-yellow-50 dark:bg-yellow-900/10 midnight:bg-yellow-900/10 purple:bg-yellow-900/10 border-l-4 border-yellow-500 dark:border-yellow-600 midnight:border-yellow-600 purple:border-yellow-600 rounded flex-shrink-0">
             <p className="text-xs text-yellow-800 dark:text-yellow-300 midnight:text-yellow-300 purple:text-yellow-300">
               {message}
             </p>
           </div>

           {/* Errors List */}
           <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto">
            {errorEntries.map(([fieldName, errorMessage], index) => {
              if (!fieldName) return null;
              const fieldLabel = getFieldLabel(fieldName) || fieldName;
              const sectionName = getFieldSection(fieldName);
              return (
                                 <div
                   key={fieldName}
                   onClick={() => handleScrollToField(fieldName)}
                   className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-[#22262e]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors duration-200 cursor-pointer group"
                 >
                   <div className="flex-shrink-0 w-5 h-5 bg-yellow-500 dark:bg-yellow-600 midnight:bg-yellow-600 purple:bg-yellow-600 rounded-full flex items-center justify-center text-white text-xs font-semibold mt-0.5">
                     {index + 1}
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-1.5 mb-0.5">
                       <p className="font-semibold text-xs text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                         {fieldLabel}
                       </p>
                       <span className="text-[0.625rem] font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 px-1.5 py-0.5 rounded">
                         {sectionName}
                       </span>
                     </div>
                     <p className="text-[0.6875rem] text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 leading-tight">
                       {errorMessage}
                     </p>
                   </div>
                 </div>
              );
            })}
          </div>

                     {/* Button */}
           <div className="mt-4 flex items-center justify-end flex-shrink-0">
             <button
               onClick={onClose}
               className="px-5 py-2 rounded-lg font-semibold text-xs text-white bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 hover:bg-blue-700 dark:hover:bg-blue-600 midnight:hover:bg-cyan-700 purple:hover:bg-pink-700 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer"
             >
               I'll Complete These Fields
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
