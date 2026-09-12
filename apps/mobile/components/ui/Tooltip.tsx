import { useState, useEffect, useRef, ReactNode } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

type TooltipPosition = 'top' | 'bottom' | 'auto';

interface TooltipProps {
  /** The content to show in the tooltip */
  content: string;
  /** The element that triggers the tooltip */
  children: ReactNode;
  /** Position of tooltip relative to trigger element */
  position?: TooltipPosition;
  /** Auto-hide delay in ms (default: 2000, set to 0 to disable) */
  autoHideDelay?: number;
  /** Background color of the tooltip */
  backgroundColor?: string;
  /** Text color of the tooltip */
  textColor?: string;
  /** Whether the tooltip is visible (controlled mode) */
  visible?: boolean;
  /** Callback when visibility changes (controlled mode) */
  onVisibilityChange?: (visible: boolean) => void;
}

export default function Tooltip({
  content,
  children,
  position = 'auto',
  autoHideDelay = 2000,
  backgroundColor = '#1f2937',
  textColor = '#ffffff',
  visible: controlledVisible,
  onVisibilityChange,
}: TooltipProps) {
  const [internalVisible, setInternalVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>('top');
  const [triggerLayout, setTriggerLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });
  const triggerRef = useRef<View>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Use controlled or uncontrolled visibility
  const isVisible = controlledVisible !== undefined ? controlledVisible : internalVisible;
  const setIsVisible = (value: boolean) => {
    if (controlledVisible !== undefined) {
      onVisibilityChange?.(value);
    } else {
      setInternalVisible(value);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showTooltip = () => {
    // Measure the trigger element position
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setTriggerLayout({ x, y, width, height });

      // Determine position based on available space
      if (position === 'auto') {
        const spaceAbove = y;
        const spaceBelow = Dimensions.get('window').height - (y + height);
        setTooltipPosition(spaceAbove > spaceBelow ? 'top' : 'bottom');
      } else {
        setTooltipPosition(position);
      }

      setIsVisible(true);

      // Auto-hide after delay
      if (autoHideDelay > 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, autoHideDelay);
      }
    });
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const onTooltipLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setTooltipSize({ width, height });
  };

  // Calculate tooltip position
  const getTooltipStyle = () => {
    const horizontalCenter = triggerLayout.x + triggerLayout.width / 2;
    let left = horizontalCenter - tooltipSize.width / 2;

    // Keep tooltip within screen bounds
    const padding = 12;
    if (left < padding) {
      left = padding;
    } else if (left + tooltipSize.width > SCREEN_WIDTH - padding) {
      left = SCREEN_WIDTH - tooltipSize.width - padding;
    }

    const top =
      tooltipPosition === 'top'
        ? triggerLayout.y - tooltipSize.height - 8
        : triggerLayout.y + triggerLayout.height + 8;

    return { top, left };
  };

  // Calculate arrow position relative to tooltip
  const getArrowStyle = () => {
    const horizontalCenter = triggerLayout.x + triggerLayout.width / 2;
    const tooltipStyle = getTooltipStyle();
    const arrowLeft = horizontalCenter - tooltipStyle.left - 6; // 6 is half of arrow width

    return {
      left: Math.max(12, Math.min(arrowLeft, tooltipSize.width - 24)),
    };
  };

  return (
    <>
      <Pressable ref={triggerRef} onPress={showTooltip}>
        {children}
      </Pressable>

      <Modal
        transparent
        visible={isVisible}
        animationType="fade"
        onRequestClose={hideTooltip}
      >
        <Pressable style={styles.overlay} onPress={hideTooltip}>
          <View
            style={[
              styles.tooltip,
              { backgroundColor },
              getTooltipStyle(),
            ]}
            onLayout={onTooltipLayout}
          >
            <Text style={[styles.tooltipText, { color: textColor }]}>{content}</Text>
            <View
              style={[
                styles.arrow,
                tooltipPosition === 'top' ? styles.arrowBottom : styles.arrowTop,
                { borderTopColor: tooltipPosition === 'top' ? backgroundColor : 'transparent' },
                { borderBottomColor: tooltipPosition === 'bottom' ? backgroundColor : 'transparent' },
                getArrowStyle(),
              ]}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tooltip: {
    position: 'absolute',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    maxWidth: SCREEN_WIDTH - 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltipText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  arrowBottom: {
    bottom: -6,
    borderTopWidth: 6,
    borderBottomWidth: 0,
  },
  arrowTop: {
    top: -6,
    borderBottomWidth: 6,
    borderTopWidth: 0,
  },
});
