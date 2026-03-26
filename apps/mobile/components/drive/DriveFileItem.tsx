import { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import {
  type DriveItem,
  getFileTypeConfig,
  formatFileSize,
  timeAgo,
  getChildCount,
} from './driveMockData';

const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

function FileIcon({ config, size, color }: { config: { icon: string; color: string }; size: number; color?: string }) {
  return <Ionicons name={config.icon as any} size={size} color={color || config.color} />;
}

interface DriveFileItemProps {
  item: DriveItem;
  onPress: (item: DriveItem) => void;
  onLongPress: (item: DriveItem) => void;
  layout: 'list' | 'grid';
  isTablet: boolean;
}

function DriveFileItemInner({ item, onPress, onLongPress, layout, isTablet }: DriveFileItemProps) {
  const { colors } = useTheme();
  const config = getFileTypeConfig(item);
  const isFolder = item.type === 'folder';
  const childCount = isFolder ? getChildCount(item.id) : 0;

  if (layout === 'grid') {
    return (
      <Pressable
        onPress={() => onPress(item)}
        onLongPress={() => onLongPress(item)}
        style={[
          styles.gridCard,
          isTablet && styles.gridCardTablet,
          {
            backgroundColor: colors.surface,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        {/* Preview header area */}
        <View style={[
          styles.gridPreview,
          isTablet && styles.gridPreviewTablet,
          { backgroundColor: config.previewBg },
        ]}>
          {/* Decorative circles */}
          <View style={[styles.gridDecoCircle1, { backgroundColor: config.bgColor, opacity: 0.5 }]} />
          <View style={[styles.gridDecoCircle2, { backgroundColor: config.bgColor, opacity: 0.3 }]} />

          {/* Main icon */}
          <View style={[
            styles.gridIconCircle,
            isTablet && styles.gridIconCircleTablet,
            { backgroundColor: 'rgba(255,255,255,0.85)' },
          ]}>
            <FileIcon config={config} size={isTablet ? 28 : 26} />
          </View>

          {/* Star */}
          {item.starred && (
            <View style={[styles.gridStarBadge, { backgroundColor: colors.surface }]}>
              <Ionicons name="star" size={10} color="#f59e0b" />
            </View>
          )}

          {/* Menu */}
          <Pressable
            onPress={() => onLongPress(item)}
            style={[styles.gridMenuBtn, { backgroundColor: 'rgba(255,255,255,0.7)' }]}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons name="ellipsis-horizontal" size={14} color={config.color} />
          </Pressable>
        </View>

        {/* Card body */}
        <View style={[styles.gridBody, isTablet && styles.gridBodyTablet]}>
          {/* File name */}
          <Text
            style={[styles.gridName, isTablet && styles.gridNameTablet, { color: colors.text }]}
            numberOfLines={2}
          >
            {item.name}
          </Text>

          {/* Type + meta */}
          <View style={styles.gridMetaRow}>
            <Text style={[styles.gridTypeLabel, { color: config.color }]}>
              {config.label}
            </Text>
            <Text style={[styles.gridMetaDot, { color: colors.textMuted }]}>·</Text>
            {isFolder ? (
              <Text style={[styles.gridMetaText, { color: colors.textMuted }]}>
                {childCount} {childCount === 1 ? 'item' : 'items'}
              </Text>
            ) : (
              <Text style={[styles.gridMetaText, { color: colors.textMuted }]}>
                {formatFileSize(item.size)}
              </Text>
            )}
          </View>

          <Text style={[styles.gridDateText, { color: colors.textMuted }]}>
            {timeAgo(item.updatedAt)}
          </Text>

          {/* Owner */}
          {item.owner !== 'Me' && (
            <View style={styles.gridOwnerRow}>
              <View style={[styles.gridOwnerDot, { backgroundColor: config.color }]} />
              <Text
                style={[styles.gridOwnerText, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {item.owner}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  }

  // ── List layout ──
  if (isTablet) {
    // Tablet list: card-row style
    return (
      <Pressable
        onPress={() => onPress(item)}
        onLongPress={() => onLongPress(item)}
        style={[
          styles.listRowTablet,
          {
            backgroundColor: colors.surface,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        {/* Left color accent */}
        <View style={[styles.listAccent, { backgroundColor: config.color }]} />

        {/* Icon */}
        <View style={[styles.listIconBoxTablet, { backgroundColor: config.bgColor }]}>
          <FileIcon config={config} size={22} />
        </View>

        {/* Info */}
        <View style={styles.listCenterTablet}>
          <View style={styles.listNameRow}>
            <Text
              style={[styles.listNameTablet, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            {item.starred && (
              <Ionicons name="star" size={13} color="#f59e0b" style={styles.listStar} />
            )}
          </View>
          <View style={styles.listMetaRowTablet}>
            <View style={[styles.listTypePill, { backgroundColor: config.bgColor }]}>
              <Text style={[styles.listTypePillText, { color: config.color }]}>{config.label}</Text>
            </View>
            <Text style={[styles.listSubtitleTablet, { color: colors.textMuted }]}>
              {isFolder
                ? `${childCount} ${childCount === 1 ? 'item' : 'items'}`
                : formatFileSize(item.size)}
            </Text>
            <Text style={[styles.listDotTablet, { color: colors.textMuted }]}>·</Text>
            <Text style={[styles.listSubtitleTablet, { color: colors.textMuted }]}>
              {timeAgo(item.updatedAt)}
            </Text>
          </View>
        </View>

        {/* Owner */}
        {item.owner !== 'Me' && (
          <View style={styles.listOwnerTablet}>
            <View style={[styles.listOwnerDot, { backgroundColor: config.color }]} />
            <Text
              style={[styles.listOwnerTextTablet, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {item.owner}
            </Text>
          </View>
        )}

        {/* Menu */}
        <Pressable
          onPress={() => onLongPress(item)}
          style={styles.listMenuButtonTablet}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-vertical" size={16} color={colors.textMuted} />
        </Pressable>
      </Pressable>
    );
  }

  // Mobile list
  return (
    <Pressable
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress(item)}
      style={[
        styles.listRowMobile,
        { backgroundColor: colors.surface },
      ]}
    >
      {/* Icon with colored bg */}
      <View style={[styles.listIconBoxMobile, { backgroundColor: config.bgColor }]}>
        <Ionicons name={config.icon as any} size={22} color={config.color} />
      </View>

      {/* Center */}
      <View style={styles.listCenterMobile}>
        <View style={styles.listNameRow}>
          <Text
            style={[styles.listNameMobile, { color: colors.text }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          {item.starred && (
            <Ionicons name="star" size={11} color="#f59e0b" style={{ marginLeft: 5 }} />
          )}
        </View>
        <View style={styles.listMetaMobile}>
          <Text style={[styles.listMetaTextMobile, { color: config.color }]}>
            {config.label}
          </Text>
          <Text style={[styles.listMetaDotMobile, { color: colors.textMuted }]}>·</Text>
          <Text style={[styles.listMetaTextMobile, { color: colors.textMuted }]}>
            {isFolder
              ? `${childCount} ${childCount === 1 ? 'item' : 'items'}`
              : formatFileSize(item.size)}
          </Text>
          <Text style={[styles.listMetaDotMobile, { color: colors.textMuted }]}>·</Text>
          <Text style={[styles.listMetaTextMobile, { color: colors.textMuted }]}>
            {timeAgo(item.updatedAt)}
          </Text>
        </View>
        {item.owner !== 'Me' && (
          <Text
            style={[styles.listOwnerMobile, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {item.owner}
          </Text>
        )}
      </View>

      {/* Menu */}
      <Pressable
        onPress={() => onLongPress(item)}
        style={styles.listMenuMobile}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="ellipsis-vertical" size={18} color={colors.textMuted} />
      </Pressable>
    </Pressable>
  );
}

export const DriveFileItem = memo(DriveFileItemInner);

const styles = StyleSheet.create({
  // ── Shared List ──
  listNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ── Mobile List ──
  listRowMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listIconBoxMobile: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listCenterMobile: {
    flex: 1,
    marginLeft: 12,
    marginRight: 4,
  },
  listNameMobile: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    flexShrink: 1,
    letterSpacing: -0.2,
  },
  listMetaMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 4,
  },
  listMetaTextMobile: {
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  listMetaDotMobile: {
    fontSize: 12,
  },
  listOwnerMobile: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  listMenuMobile: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  // ── Tablet List ──
  listRowTablet: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginVertical: 4,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    paddingLeft: 0,
    overflow: 'hidden',
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  listAccent: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginRight: 12,
    marginLeft: 2,
  },
  listIconBoxTablet: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  listCenterTablet: {
    flex: 1,
    marginRight: 12,
  },
  listNameTablet: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    flexShrink: 1,
  },
  listMetaRowTablet: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  listTypePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  listTypePillText: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  listSubtitleTablet: {
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  listDotTablet: {
    fontSize: 12,
  },
  listOwnerTablet: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    gap: 5,
  },
  listOwnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  listOwnerTextTablet: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    maxWidth: 120,
  },
  listMenuButtonTablet: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  // ── Grid (mobile default, tablet overrides) ──
  gridCard: {
    flex: 1,
    borderRadius: 14,
    margin: 5,
    overflow: 'hidden',
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  gridCardTablet: {
    borderRadius: 16,
    margin: 6,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  gridPreview: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  gridPreviewTablet: {
    height: 100,
  },
  gridDecoCircle1: {
    position: 'absolute',
    top: -20,
    right: -15,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  gridDecoCircle2: {
    position: 'absolute',
    bottom: -10,
    left: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  gridIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridIconCircleTablet: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  gridStarBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  gridMenuBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridBody: {
    padding: 10,
    paddingTop: 8,
  },
  gridBodyTablet: {
    padding: 12,
    paddingTop: 10,
  },
  gridName: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    lineHeight: 17,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  gridNameTablet: {
    fontSize: 13,
    marginBottom: 5,
  },
  gridMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexWrap: 'wrap',
  },
  gridTypeLabel: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  gridMetaText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
  },
  gridMetaDot: {
    fontSize: 11,
    marginHorizontal: 1,
  },
  gridDateText: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
  gridOwnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 4,
  },
  gridOwnerDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  gridOwnerText: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    flexShrink: 1,
  },
});

export default DriveFileItem;
