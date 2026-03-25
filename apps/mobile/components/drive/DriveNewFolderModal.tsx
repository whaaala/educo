import { useState } from 'react';
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

interface DriveNewFolderModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function DriveNewFolderModal({ visible, onClose, onCreate }: DriveNewFolderModalProps) {
  const { colors } = useTheme();
  const [folderName, setFolderName] = useState('');

  const handleCreate = () => {
    const trimmed = folderName.trim();
    if (trimmed.length > 0) {
      onCreate(trimmed);
      setFolderName('');
      onClose();
    }
  };

  const handleClose = () => {
    setFolderName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title="New Folder"
      icon={<Ionicons name="folder-outline" size={22} color="#ffffff" />}
      showCloseButton
      footer={
        <View style={styles.footerRow}>
          <Pressable
            onPress={handleClose}
            style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
          >
            <Text style={[styles.buttonText, { color: colors.textSecondary }]}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleCreate}
            style={[
              styles.button,
              styles.createButton,
              {
                backgroundColor: folderName.trim().length > 0 ? colors.primary : colors.border,
              },
            ]}
            disabled={folderName.trim().length === 0}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: folderName.trim().length > 0 ? colors.primaryText : colors.textMuted,
                },
              ]}
            >
              Create
            </Text>
          </Pressable>
        </View>
      }
    >
      <View style={styles.body}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Folder name</Text>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
            },
          ]}
          placeholder="Enter folder name"
          placeholderTextColor={colors.inputPlaceholder}
          value={folderName}
          onChangeText={setFolderName}
          autoFocus
          onSubmitEditing={handleCreate}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: FONTS.regular,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  createButton: {},
  buttonText: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
  },
});

export default DriveNewFolderModal;
