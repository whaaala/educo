import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { type DriveItem, getFileTypeConfig, formatFileSize, timeAgo } from './driveMockData';

const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

function useIsTablet() {
  const [isTablet] = useState(() => Dimensions.get('window').width >= 768);
  return isTablet;
}

interface DriveActionSheetProps {
  visible: boolean;
  onClose: () => void;
  item: DriveItem | null;
  onAction: (action: string, item: DriveItem) => void;
}

interface ActionItem {
  id: string;
  label: string;
  icon: string;
  color?: string;
  destructive?: boolean;
}

function getActionsForItem(item: DriveItem | null): ActionItem[] {
  if (!item) return [];

  if (item.parentId === 'folder-bin') {
    return [
      { id: 'restore', label: 'Restore', icon: 'arrow-undo', color: '#3b82f6' },
      { id: 'deletePermanently', label: 'Delete', icon: 'trash', destructive: true },
    ];
  }

  if (item.type === 'folder') {
    return [
      { id: 'open', label: 'Open', icon: 'folder-open', color: '#3b82f6' },
      { id: 'rename', label: 'Rename', icon: 'pencil', color: '#6366f1' },
      { id: 'move', label: 'Move', icon: 'arrow-forward-circle', color: '#0891b2' },
      { id: item.starred ? 'unstar' : 'star', label: item.starred ? 'Unstar' : 'Star', icon: item.starred ? 'star' : 'star-outline', color: '#f59e0b' },
      { id: 'delete', label: 'Bin', icon: 'trash', destructive: true },
    ];
  }

  return [
    { id: 'open', label: 'Open', icon: 'open-outline', color: '#3b82f6' },
    { id: 'rename', label: 'Rename', icon: 'pencil', color: '#6366f1' },
    { id: 'move', label: 'Move', icon: 'arrow-forward-circle', color: '#0891b2' },
    { id: item.starred ? 'unstar' : 'star', label: item.starred ? 'Unstar' : 'Star', icon: item.starred ? 'star' : 'star-outline', color: '#f59e0b' },
    { id: 'share', label: 'Share', icon: 'share-social', color: '#10b981' },
    { id: 'download', label: 'Save', icon: 'download', color: '#8b5cf6' },
    { id: 'delete', label: 'Bin', icon: 'trash', destructive: true },
  ];
}

export function DriveActionSheet({ visible, onClose, item, onAction }: DriveActionSheetProps) {
  const { colors } = useTheme();
  const isTablet = useIsTablet();
  const actions = getActionsForItem(item);
  const config = item ? getFileTypeConfig(item) : null;

  const fire = (id: string) => {
    if (item) { onAction(id, item); onClose(); }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose} statusBarTranslucent>
      <View style={s.overlay}>
        <Pressable style={s.backdrop} onPress={onClose} />

        <View style={isTablet ? s.wrapTablet : s.wrap}>
          <View style={[isTablet ? s.cardTablet : s.card, { backgroundColor: colors.modalBackground }]}>

            {!isTablet && (
              <View style={s.handleWrap}>
                <View style={[s.handle, { backgroundColor: colors.border }]} />
              </View>
            )}

            {item && config && (
              <View style={s.hdr}>
                <View style={[s.hdrIcon, { backgroundColor: config.previewBg }]}>
                  <Ionicons name={config.icon as any} size={24} color={config.color} />
                </View>
                <View style={s.hdrInfo}>
                  <Text style={[s.hdrName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                  <Text style={[s.hdrMeta, { color: colors.textMuted }]}>
                    {config.label}{item.size ? ` · ${formatFileSize(item.size)}` : ''} · {timeAgo(item.updatedAt)}
                  </Text>
                </View>
                <Pressable onPress={onClose} style={[s.hdrClose, { backgroundColor: colors.backgroundTertiary }]} hitSlop={8}>
                  <Ionicons name="close" size={16} color={colors.textMuted} />
                </Pressable>
              </View>
            )}

            <View style={[s.sep, { backgroundColor: colors.border }]} />

            <View style={s.grid}>
              {actions.map((action) => {
                const c = action.destructive ? colors.error : (action.color || colors.textSecondary);
                const bg = action.destructive ? colors.errorLight : `${c}14`;
                return (
                  <Pressable
                    key={action.id}
                    onPress={() => fire(action.id)}
                    style={({ pressed }) => [s.tile, pressed && { opacity: 0.6 }]}
                  >
                    <View style={[s.tileIcon, { backgroundColor: bg }]}>
                      <Ionicons name={action.icon as any} size={22} color={c} />
                    </View>
                    <Text style={[s.tileLabel, { color: action.destructive ? colors.error : colors.textSecondary }]}>{action.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ height: 12 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },

  wrap: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 8, paddingBottom: 12 },
  card: { borderRadius: 22, overflow: 'hidden', elevation: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 12 },

  wrapTablet: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  cardTablet: { width: 400, borderRadius: 18, overflow: 'hidden', elevation: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 20 },

  handleWrap: { alignItems: 'center', paddingTop: 10, paddingBottom: 4 },
  handle: { width: 32, height: 4, borderRadius: 2 },

  hdr: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14 },
  hdrIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  hdrInfo: { flex: 1, marginLeft: 12, marginRight: 10 },
  hdrName: { fontSize: 15, fontFamily: FONTS.semiBold, letterSpacing: -0.2 },
  hdrMeta: { fontSize: 12, fontFamily: FONTS.regular, marginTop: 2 },
  hdrClose: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },

  sep: { height: StyleSheet.hairlineWidth, marginHorizontal: 18 },

  grid: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 16,
  },
  tile: {
    alignItems: 'center',
    width: 56,
  },
  tileIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  tileLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
});

export default DriveActionSheet;
