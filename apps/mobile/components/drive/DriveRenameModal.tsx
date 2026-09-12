import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Modal } from '../ui/Modal';

const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

interface DriveRenameModalProps {
  visible: boolean;
  onClose: () => void;
  currentName: string;
  onRename: (newName: string) => void;
}

export function DriveRenameModal({ visible, onClose, currentName, onRename }: DriveRenameModalProps) {
  const { colors } = useTheme();
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (visible) setName(currentName);
  }, [visible, currentName]);

  const handleRename = () => {
    const trimmed = name.trim();
    if (trimmed.length > 0 && trimmed !== currentName) {
      onRename(trimmed);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Rename"
      icon={<Ionicons name="pencil" size={20} color="#ffffff" />}
      showCloseButton
      footer={
        <View style={styles.footerRow}>
          <Pressable onPress={onClose} style={[styles.btn, styles.cancelBtn, { borderColor: colors.border }]}>
            <Text style={[styles.btnText, { color: colors.textSecondary }]}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleRename}
            disabled={!name.trim() || name.trim() === currentName}
            style={[styles.btn, { backgroundColor: name.trim() && name.trim() !== currentName ? colors.primary : colors.border }]}
          >
            <Text style={[styles.btnText, { color: name.trim() && name.trim() !== currentName ? colors.primaryText : colors.textMuted }]}>Rename</Text>
          </Pressable>
        </View>
      }
    >
      <TextInput
        style={[styles.input, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}
        value={name}
        onChangeText={setName}
        autoFocus
        selectTextOnFocus
        onSubmitEditing={handleRename}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  input: { height: 48, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, fontSize: 15, fontFamily: FONTS.regular },
  footerRow: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { borderWidth: 1 },
  btnText: { fontSize: 15, fontFamily: FONTS.semiBold },
});

export default DriveRenameModal;
