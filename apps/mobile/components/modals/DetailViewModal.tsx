import { type ReactNode } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

/** A single detail field (key-value pair) */
export interface DetailField {
  label: string;
  value: ReactNode;
  /** Span full width */
  fullWidth?: boolean;
  /** Highlight accent color */
  highlight?: 'green' | 'red' | 'blue' | 'amber' | 'purple';
}

/** Badge displayed in the header */
export interface DetailBadge {
  label: string;
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';
  pulse?: boolean;
}

/** Tag chip */
export interface DetailTag {
  label: string;
  color?: string;
}

/** Content section */
export interface DetailSection {
  id: string;
  title?: string;
  type: 'grid' | 'description' | 'tags' | 'custom' | 'info-row';
  columns?: 2 | 3;
  fields?: DetailField[];
  content?: ReactNode;
  tags?: DetailTag[];
  children?: ReactNode;
  rows?: { label: string; value: ReactNode }[];
}

/** Header configuration */
export interface DetailHeader {
  image?: ReactNode;
  badges?: DetailBadge[];
  subtitle?: ReactNode;
  chips?: DetailTag[];
}

/** Footer action button */
export interface DetailAction {
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  onPress?: () => void;
  /** Web-aligned alias */
  onClick?: () => void;
  condition?: boolean;
}

/** Footer info */
export interface DetailFooterInfo {
  items: { label: string; value: string }[];
}

export interface DetailViewModalProps {
  /** Preferred visibility prop (web-aligned) */
  isOpen?: boolean;
  /** Back-compat visibility prop */
  visible?: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  iconBgColors?: readonly [string, string];
  header?: DetailHeader;
  sections: DetailSection[];
  actions?: DetailAction[];
  footerInfo?: DetailFooterInfo;
}

// ============================================================================
// Badge & Highlight Colors
// ============================================================================

const badgeColors: Record<string, { bg: readonly [string, string]; text: string }> = {
  success: { bg: ['#10b981', '#22c55e'] as const, text: '#ffffff' },
  warning: { bg: ['#f59e0b', '#f97316'] as const, text: '#ffffff' },
  danger: { bg: ['#ef4444', '#f43f5e'] as const, text: '#ffffff' },
  info: { bg: ['#3b82f6', '#6366f1'] as const, text: '#ffffff' },
  neutral: { bg: ['#6b7280', '#64748b'] as const, text: '#ffffff' },
  purple: { bg: ['#a855f7', '#ec4899'] as const, text: '#ffffff' },
};

const highlightColors: Record<string, { light: string; dark: string; border: string }> = {
  green: { light: '#ecfdf5', dark: 'rgba(16,185,129,0.15)', border: '#a7f3d0' },
  red: { light: '#fef2f2', dark: 'rgba(239,68,68,0.15)', border: '#fecaca' },
  blue: { light: '#eff6ff', dark: 'rgba(59,130,246,0.15)', border: '#bfdbfe' },
  amber: { light: '#fffbeb', dark: 'rgba(245,158,11,0.15)', border: '#fde68a' },
  purple: { light: '#faf5ff', dark: 'rgba(168,85,247,0.15)', border: '#e9d5ff' },
};

// ============================================================================
// Component
// ============================================================================

export function DetailViewModal({
  isOpen,
  visible,
  onClose,
  title,
  subtitle,
  icon,
  iconBgColors,
  header,
  sections,
  actions,
  footerInfo,
}: DetailViewModalProps) {
  const { colors, isDark } = useTheme();
  const isTablet = useIsTablet();
  const resolvedVisible = isOpen ?? visible ?? false;

  // Filter visible actions
  const visibleActions = actions?.filter((a) => a.condition !== false) ?? [];

  // Build footer
  const footer = visibleActions.length > 0 ? (
    <View style={styles.footerActions}>
      {visibleActions.map((action) => {
        const isGhost = action.variant === 'ghost';
        const isDanger = action.variant === 'danger';
        const isPrimary = action.variant === 'primary';

        return (
          <Pressable
            key={action.id}
            onPress={action.onPress ?? action.onClick}
            style={[
              styles.actionButton,
              isPrimary && { backgroundColor: colors.primary },
              isDanger && { backgroundColor: colors.error },
              isGhost && { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
              action.variant === 'secondary' && { backgroundColor: colors.backgroundTertiary },
            ]}
          >
            {action.icon && (
              <Ionicons
                name={action.icon}
                size={16}
                color={isGhost ? colors.textSecondary : '#ffffff'}
                style={{ marginRight: 6 }}
              />
            )}
            <Text
              style={[
                styles.actionButtonText,
                { color: isGhost ? colors.textSecondary : '#ffffff' },
              ]}
            >
              {action.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  ) : undefined;

  return (
    <Modal
      visible={resolvedVisible}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={icon}
      iconBgColors={iconBgColors}
      footer={footer}
    >
      {/* Header with image/badges */}
      {header && (
        <View style={styles.headerSection}>
          {header.image && (
            <View style={styles.headerImage}>{header.image}</View>
          )}
          <View style={{ flex: 1 }}>
            {/* Badges */}
            {header.badges && header.badges.length > 0 && (
              <View style={styles.badgeRow}>
                {header.badges.map((badge, idx) => {
                  const bc = badgeColors[badge.variant] || badgeColors.neutral;
                  return (
                    <LinearGradient
                      key={idx}
                      colors={bc.bg}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.badge}
                    >
                      {badge.pulse && (
                        <View style={styles.pulseIndicator} />
                      )}
                      <Text style={[styles.badgeText, { color: bc.text }]}>
                        {badge.label}
                      </Text>
                    </LinearGradient>
                  );
                })}
              </View>
            )}

            {/* Subtitle */}
            {header.subtitle && (
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                {typeof header.subtitle === 'string' ? header.subtitle : ''}
              </Text>
            )}
            {typeof header.subtitle !== 'string' && header.subtitle}

            {/* Chips */}
            {header.chips && header.chips.length > 0 && (
              <View style={styles.chipRow}>
                {header.chips.map((chip, idx) => (
                  <View
                    key={idx}
                    style={[styles.chip, { backgroundColor: colors.backgroundTertiary, borderColor: colors.border }]}
                  >
                    <Text style={[styles.chipText, { color: colors.textSecondary }]}>
                      {chip.label}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

      {/* Sections */}
      {sections.map((section) => (
        <View key={section.id} style={styles.section}>
          {section.title && (
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
              {section.title}
            </Text>
          )}

          {/* Description */}
          {section.type === 'description' && section.content && (
            <View style={[styles.descriptionCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
              {typeof section.content === 'string' ? (
                <Text style={[styles.descriptionText, { color: colors.text }]}>
                  {section.content}
                </Text>
              ) : (
                section.content
              )}
            </View>
          )}

          {/* Grid */}
          {section.type === 'grid' && section.fields && (
            <View style={[styles.grid, { gap: isTablet ? 12 : 8 }, section.columns === 3 && styles.grid3]}>
              {section.fields.map((field, idx) => {
                const hl = field.highlight ? highlightColors[field.highlight] : null;
                const bgColor = hl
                  ? isDark ? hl.dark : hl.light
                  : isDark ? colors.surface : colors.backgroundSecondary;
                const borderColor = hl ? hl.border : colors.border;

                return (
                  <View
                    key={idx}
                    style={[
                      styles.fieldCard,
                      { backgroundColor: bgColor, borderColor, padding: isTablet ? 16 : 14, minWidth: isTablet ? 150 : 120 },
                      field.fullWidth && styles.fieldFullWidth,
                    ]}
                  >
                    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
                      {field.label}
                    </Text>
                    {typeof field.value === 'string' || typeof field.value === 'number' ? (
                      <Text style={[styles.fieldValue, { color: colors.text }]}>
                        {field.value}
                      </Text>
                    ) : (
                      field.value
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* Tags */}
          {section.type === 'tags' && section.tags && section.tags.length > 0 && (
            <View style={styles.tagRow}>
              {section.tags.map((tag, idx) => (
                <View
                  key={idx}
                  style={[styles.tag, { backgroundColor: colors.backgroundTertiary, borderColor: colors.border }]}
                >
                  <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                    #{tag.label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Info rows */}
          {section.type === 'info-row' && section.rows && (
            <View style={styles.infoRows}>
              {section.rows.map((row, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.infoRow,
                    idx < (section.rows?.length ?? 0) - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                  ]}
                >
                  <Text style={[styles.infoRowLabel, { color: colors.textMuted }]}>
                    {row.label}
                  </Text>
                  {typeof row.value === 'string' || typeof row.value === 'number' ? (
                    <Text style={[styles.infoRowValue, { color: colors.text }]}>
                      {row.value}
                    </Text>
                  ) : (
                    row.value
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Custom */}
          {section.type === 'custom' && section.children}
        </View>
      ))}

      {/* Footer info */}
      {footerInfo && (
        <View style={[styles.footerInfo, { borderTopColor: colors.border }]}>
          {footerInfo.items.map((item, idx) => (
            <View key={idx} style={styles.footerInfoItem}>
              <Text style={[styles.footerInfoLabel, { color: colors.textSecondary }]}>
                {item.label}:
              </Text>
              <Text style={[styles.footerInfoValue, { color: colors.textMuted }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Modal>
  );
}

// ============================================================================
// Styles
// ============================================================================

// Base gap used in static styles; overridden inline by isTablet hook for dynamic responsiveness
const GRID_GAP = 8;

const styles = StyleSheet.create({
  // Header
  headerSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  headerImage: {
    flexShrink: 0,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pulseIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  badgeText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    textTransform: 'capitalize',
  },

  // Sections
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
  },

  // Description
  descriptionCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    lineHeight: 22,
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  grid3: {},
  fieldCard: {
    width: `${(100 - 2) / 2}%` as unknown as number,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    minWidth: 120,
    flexGrow: 1,
    flexBasis: '45%',
  },
  fieldFullWidth: {
    flexBasis: '100%',
    width: '100%',
  },
  fieldLabel: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },

  // Tags
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },

  // Info rows
  infoRows: {
    gap: 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  infoRowLabel: {
    fontSize: 13,
    fontFamily: FONTS.regular,
  },
  infoRowValue: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },

  // Footer
  footerActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 100,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },

  // Footer info
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    marginTop: 4,
  },
  footerInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerInfoLabel: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
  },
  footerInfoValue: {
    fontSize: 11,
    fontFamily: FONTS.regular,
  },
});

export default DetailViewModal;
