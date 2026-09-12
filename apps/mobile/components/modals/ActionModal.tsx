import { type ReactNode } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useIsTablet } from '../../hooks/useIsTablet';
import { Modal } from '../ui/Modal';

// Shared fonts
const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

// ============================================================================
// Types
// ============================================================================

export type ActionVariant = 'danger' | 'warning' | 'info' | 'success';

/** Action button */
export interface ActionButton {
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  onPress?: () => void;
  /** Web-aligned alias */
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

/** Detail item */
export interface ActionDetail {
  label: string;
  value: ReactNode;
}

export interface ActionModalProps {
  /** Preferred visibility prop (web-aligned) */
  isOpen?: boolean;
  /** Back-compat visibility prop */
  visible?: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  iconBgColors?: readonly [string, string];
  variant?: ActionVariant;
  /** Main message */
  message?: string;
  /** Additional detail text */
  detail?: string;
  /** Key-value details */
  details?: ActionDetail[];
  /** Custom content */
  children?: ReactNode;
  /** Custom action buttons */
  actions?: ActionButton[];
  /** Simple confirm/cancel */
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
  isConfirming?: boolean;
}

// ============================================================================
// Variant Config
// ============================================================================

const variantConfig: Record<ActionVariant, {
  icon: keyof typeof Ionicons.glyphMap;
  gradientColors: readonly [string, string];
  accentColor: string;
}> = {
  danger: {
    icon: 'close-circle',
    gradientColors: ['#ef4444', '#f43f5e'] as const,
    accentColor: '#ef4444',
  },
  warning: {
    icon: 'warning',
    gradientColors: ['#f59e0b', '#f97316'] as const,
    accentColor: '#f59e0b',
  },
  info: {
    icon: 'information-circle',
    gradientColors: ['#3b82f6', '#6366f1'] as const,
    accentColor: '#3b82f6',
  },
  success: {
    icon: 'checkmark-circle',
    gradientColors: ['#10b981', '#22c55e'] as const,
    accentColor: '#10b981',
  },
};

// ============================================================================
// Component
// ============================================================================

export function ActionModal({
  isOpen,
  visible,
  onClose,
  title,
  subtitle,
  icon: customIcon,
  iconBgColors,
  variant = 'info',
  message,
  detail,
  details,
  children,
  actions,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  isConfirming = false,
}: ActionModalProps) {
  const { colors, isDark } = useTheme();
  const isTablet = useIsTablet();
  const config = variantConfig[variant];
  const resolvedVisible = isOpen ?? visible ?? false;

  // Default icon from variant
  const defaultIcon = (
    <Ionicons name={config.icon} size={22} color="#ffffff" />
  );

  const actualIconBgColors = iconBgColors || config.gradientColors;

  // Build footer
  const footer = actions ? (
    <View style={styles.footerActions}>
      {actions.map((action) => {
        const isGhost = action.variant === 'ghost';
        const isDanger = action.variant === 'danger';
        const isPrimary = action.variant === 'primary';

        return (
          <Pressable
            key={action.id}
            onPress={action.onPress ?? action.onClick}
            disabled={action.disabled || action.loading}
            style={[
              styles.actionBtn,
              isPrimary && { backgroundColor: colors.primary },
              isDanger && { backgroundColor: colors.error },
              isGhost && { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
              action.variant === 'secondary' && { backgroundColor: colors.backgroundTertiary },
              (action.disabled || action.loading) && { opacity: 0.6 },
            ]}
          >
            {action.loading ? (
              <View style={styles.spinner} />
            ) : action.icon ? (
              <Ionicons
                name={action.icon}
                size={16}
                color={isGhost ? colors.textSecondary : '#ffffff'}
                style={{ marginRight: 6 }}
              />
            ) : null}
            <Text
              style={[
                styles.actionBtnText,
                { color: isGhost ? colors.textSecondary : '#ffffff' },
              ]}
            >
              {action.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  ) : (
    <View style={styles.footerActions}>
      <Pressable
        onPress={onClose}
        style={[styles.actionBtn, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]}
      >
        <Text style={[styles.actionBtnText, { color: colors.textSecondary }]}>{cancelLabel}</Text>
      </Pressable>
      <Pressable
        onPress={onConfirm}
        disabled={isConfirming}
        style={[
          styles.actionBtn,
          {
            backgroundColor: variant === 'danger' ? colors.error : colors.primary,
          },
          isConfirming && { opacity: 0.6 },
        ]}
      >
        {isConfirming && <View style={styles.spinner} />}
        <Text style={styles.confirmBtnText}>{confirmLabel}</Text>
      </Pressable>
    </View>
  );

  return (
    <Modal
      visible={resolvedVisible}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={customIcon || defaultIcon}
      iconBgColors={actualIconBgColors}
      footer={footer}
    >
      {/* Message */}
      {message && (
        <View style={[styles.messageCard, { backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)', borderLeftColor: config.accentColor, padding: isTablet ? 20 : 16 }]}>
          <Text style={[styles.messageText, { color: colors.text, fontSize: isTablet ? 15 : 14 }]}>{message}</Text>
        </View>
      )}

      {/* Detail text */}
      {detail && (
        <Text style={[styles.detailText, { color: colors.textMuted }]}>{detail}</Text>
      )}

      {/* Detail items */}
      {details && details.length > 0 && (
        <View style={[styles.detailsCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
          {details.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.detailRow,
                idx < details.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
                {item.label}
              </Text>
              {typeof item.value === 'string' || typeof item.value === 'number' ? (
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {item.value}
                </Text>
              ) : (
                item.value
              )}
            </View>
          ))}
        </View>
      )}

      {/* Custom content */}
      {children}
    </Modal>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  // Message
  messageCard: {
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
    marginBottom: 16,
  },
  messageText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    lineHeight: 22,
  },

  // Detail text
  detailText: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    marginBottom: 16,
    lineHeight: 20,
  },

  // Details card
  detailsCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },

  // Footer
  footerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  actionBtnText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  confirmBtnText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#ffffff',
  },
  spinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderTopColor: '#ffffff',
    marginRight: 8,
  },
});

export default ActionModal;
