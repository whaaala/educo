import { useState, useMemo } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Modal } from '../ui/Modal';
import { getAllFolders, type DriveItem } from './driveMockData';

const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

interface DriveMoveModalProps {
  visible: boolean;
  onClose: () => void;
  item: DriveItem | null;
  onMove: (targetFolderId: string) => void;
}

export function DriveMoveModal({ visible, onClose, item, onMove }: DriveMoveModalProps) {
  const { colors } = useTheme();
  const [selected, setSelected] = useState<string | null>(null);

  const folders = useMemo(() => {
    if (!item) return [];
    return getAllFolders().filter(f => f.id !== item.id && f.id !== item.parentId);
  }, [item]);

  const handleMove = () => {
    if (selected) {
      onMove(selected);
      setSelected(null);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={() => { setSelected(null); onClose(); }}
      title="Move to..."
      icon={<Ionicons name="arrow-forward-circle" size={20} color="#ffffff" />}
      showCloseButton
      footer={
        <View style={styles.footerRow}>
          <Pressable onPress={() => { setSelected(null); onClose(); }} style={[styles.btn, styles.cancelBtn, { borderColor: colors.border }]}>
            <Text style={[styles.btnText, { color: colors.textSecondary }]}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleMove}
            disabled={!selected}
            style={[styles.btn, { backgroundColor: selected ? colors.primary : colors.border }]}
          >
            <Text style={[styles.btnText, { color: selected ? colors.primaryText : colors.textMuted }]}>Move here</Text>
          </Pressable>
        </View>
      }
    >
      <FlatList
        data={folders}
        keyExtractor={(f) => f.id}
        style={{ maxHeight: 280 }}
        renderItem={({ item: folder }) => {
          const isSelected = selected === folder.id;
          return (
            <Pressable
              onPress={() => setSelected(folder.id)}
              style={[
                styles.folderRow,
                {
                  backgroundColor: isSelected ? colors.primaryLight : 'transparent',
                  borderColor: isSelected ? colors.primary : 'transparent',
                },
              ]}
            >
              <Ionicons name="folder" size={22} color={isSelected ? colors.primary : '#f59e0b'} />
              <Text style={[styles.folderName, { color: isSelected ? colors.primary : colors.text }]}>{folder.name}</Text>
              {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  folderRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12, borderWidth: 1, gap: 10 },
  folderName: { flex: 1, fontSize: 15, fontFamily: FONTS.medium },
  footerRow: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { borderWidth: 1 },
  btnText: { fontSize: 15, fontFamily: FONTS.semiBold },
});

export default DriveMoveModal;
