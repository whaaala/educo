import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export interface ChildData {
  id: string;
  name: string;
  classLevel: string;
  avatarUri?: string;
}

interface ChildSwitcherProps {
  /** The pupils to switch between. Named childList, not `children`: React reserves `children` for JSX
   *  content, so a domain list passed under that name is silently overridden by anything between the tags. */
  childList: ChildData[];
  selectedChildId: string;
  onSelectChild: (childId: string) => void;
  variant?: 'compact' | 'full';
  showClass?: boolean;
}

function useIsTablet() {
  const [isTablet] = useState(() => Dimensions.get('window').width >= 768);
  return isTablet;
}

export function ChildSwitcher({
  childList,
  selectedChildId,
  onSelectChild,
  variant = 'compact',
  showClass = true,
}: ChildSwitcherProps) {
  const { colors } = useTheme();
  const isTablet = useIsTablet();
  const [isOpen, setIsOpen] = useState(false);

  const selectedChild = childList.find((c) => c.id === selectedChildId) || childList[0];

  if (!selectedChild || childList.length === 0) {
    return null;
  }

  // If only one child, just show info without dropdown
  if (childList.length === 1) {
    return (
      <View style={[styles.singleChildContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.childAvatar, { backgroundColor: colors.primaryLight }]}>
          {selectedChild.avatarUri ? (
            <Image source={{ uri: selectedChild.avatarUri }} style={styles.childAvatarImage} />
          ) : (
            <Text style={[styles.childAvatarText, { color: colors.primary }]}>
              {selectedChild.name.charAt(0)}
            </Text>
          )}
        </View>
        <View style={styles.childInfo}>
          <Text style={[styles.childName, { color: colors.text }]} numberOfLines={1}>
            {selectedChild.name}
          </Text>
          {showClass && (
            <Text style={[styles.childClass, { color: colors.textMuted }]}>{selectedChild.classLevel}</Text>
          )}
        </View>
      </View>
    );
  }

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  const handleSelectChild = (childId: string) => {
    onSelectChild(childId);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(false);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // Mobile: Sleek pill-style button with modal dropdown
  if (!isTablet) {
    return (
      <>
        {/* Compact Pill Button */}
        <Pressable
          onPress={toggleDropdown}
          style={[
            styles.mobilePillButton,
            {
              backgroundColor: isOpen ? colors.primary : colors.surface,
              borderColor: isOpen ? colors.primary : colors.border,
            },
          ]}
        >
          <View style={styles.mobilePillAvatarWrap}>
            {selectedChild.avatarUri ? (
              <Image source={{ uri: selectedChild.avatarUri }} style={styles.mobilePillAvatar} />
            ) : (
              <View style={[styles.mobilePillAvatarFallback, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.mobilePillAvatarText, { color: colors.primary }]}>
                  {selectedChild.name.charAt(0)}
                </Text>
              </View>
            )}
          </View>
          <View style={[styles.mobilePillIconWrap, { backgroundColor: isOpen ? 'rgba(255,255,255,0.2)' : colors.backgroundTertiary }]}>
            <Ionicons
              name={isOpen ? 'chevron-up' : 'chevron-down'}
              size={12}
              color={isOpen ? '#ffffff' : colors.textMuted}
            />
          </View>
        </Pressable>

        {/* Modal Dropdown for Mobile */}
        <Modal
          visible={isOpen}
          transparent
          animationType="fade"
          onRequestClose={closeModal}
        >
          <Pressable style={styles.modalOverlay} onPress={closeModal}>
            <Pressable
              style={[styles.mobileDropdownCard, { backgroundColor: colors.surface }]}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <View style={[styles.mobileDropdownHeader, { borderBottomColor: colors.border }]}>
                <View style={[styles.mobileDropdownHeaderIcon, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="swap-horizontal" size={16} color={colors.primary} />
                </View>
                <Text style={[styles.mobileDropdownTitle, { color: colors.text }]}>Switch Child</Text>
                <Pressable onPress={closeModal} style={[styles.mobileDropdownClose, { backgroundColor: colors.backgroundTertiary }]}>
                  <Ionicons name="close" size={18} color={colors.textMuted} />
                </Pressable>
              </View>

              {/* Child Options */}
              <View style={styles.mobileDropdownOptions}>
                {childList.map((child, _index) => {
                  const isSelected = child.id === selectedChildId;
                  return (
                    <Pressable
                      key={child.id}
                      onPress={() => handleSelectChild(child.id)}
                      style={[
                        styles.mobileOptionCard,
                        {
                          backgroundColor: isSelected ? colors.primaryLight : colors.backgroundTertiary,
                          borderColor: isSelected ? colors.primary : 'transparent',
                        },
                      ]}
                    >
                      {/* Avatar with gradient ring for selected */}
                      <View style={styles.mobileOptionAvatarWrap}>
                        {isSelected ? (
                          <LinearGradient
                            colors={['#6366f1', '#8b5cf6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.mobileOptionAvatarRing}
                          >
                            <View style={[styles.mobileOptionAvatarInner, { backgroundColor: colors.background }]}>
                              {child.avatarUri ? (
                                <Image source={{ uri: child.avatarUri }} style={styles.mobileOptionAvatarImg} />
                              ) : (
                                <Text style={[styles.mobileOptionAvatarText, { color: colors.primary }]}>
                                  {child.name.charAt(0)}
                                </Text>
                              )}
                            </View>
                          </LinearGradient>
                        ) : (
                          <View style={[styles.mobileOptionAvatarSimple, { backgroundColor: colors.surface }]}>
                            {child.avatarUri ? (
                              <Image source={{ uri: child.avatarUri }} style={styles.mobileOptionAvatarImg} />
                            ) : (
                              <Text style={[styles.mobileOptionAvatarText, { color: colors.textSecondary }]}>
                                {child.name.charAt(0)}
                              </Text>
                            )}
                          </View>
                        )}
                      </View>

                      {/* Info */}
                      <View style={styles.mobileOptionInfo}>
                        <Text
                          style={[
                            styles.mobileOptionName,
                            { color: isSelected ? colors.primary : colors.text },
                          ]}
                          numberOfLines={1}
                        >
                          {child.name}
                        </Text>
                        <Text style={[styles.mobileOptionClass, { color: colors.textMuted }]}>
                          {child.classLevel}
                        </Text>
                      </View>

                      {/* Check indicator */}
                      {isSelected && (
                        <View style={[styles.mobileOptionCheck, { backgroundColor: colors.primary }]}>
                          <Ionicons name="checkmark" size={14} color="#ffffff" />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </>
    );
  }

  // Tablet: Inline dropdown with overflow visible
  return (
    <View style={styles.tabletContainer}>
      {/* Selected Child Button */}
      <Pressable
        onPress={toggleDropdown}
        style={[
          styles.tabletButton,
          {
            backgroundColor: isOpen ? colors.primaryLight : colors.surface,
            borderColor: isOpen ? colors.primary : colors.border,
          },
        ]}
      >
        <View style={[styles.tabletAvatar, { backgroundColor: colors.primaryLight }]}>
          {selectedChild.avatarUri ? (
            <Image source={{ uri: selectedChild.avatarUri }} style={styles.tabletAvatarImage} />
          ) : (
            <Text style={[styles.tabletAvatarText, { color: colors.primary }]}>
              {selectedChild.name.charAt(0)}
            </Text>
          )}
        </View>
        <View style={styles.tabletInfo}>
          <Text style={[styles.tabletName, { color: colors.text }]} numberOfLines={1}>
            {variant === 'compact' ? selectedChild.name.split(' ')[0] : selectedChild.name}
          </Text>
          {showClass && (
            <Text style={[styles.tabletClass, { color: colors.textMuted }]}>{selectedChild.classLevel}</Text>
          )}
        </View>
        <View style={[styles.tabletDropdownIcon, { backgroundColor: isOpen ? colors.primary : colors.backgroundTertiary }]}>
          <Ionicons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={isOpen ? '#ffffff' : colors.textMuted}
          />
        </View>
      </Pressable>

      {/* Dropdown Menu - Use Modal for tablet too to avoid overflow issues */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Pressable
            style={[styles.tabletDropdownCard, { backgroundColor: colors.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={[styles.tabletDropdownHeader, { borderBottomColor: colors.border }]}>
              <Ionicons name="people" size={16} color={colors.textMuted} />
              <Text style={[styles.tabletDropdownHeaderText, { color: colors.textMuted }]}>
                Switch Child
              </Text>
            </View>

            {/* Options */}
            {childList.map((child, index) => {
              const isSelected = child.id === selectedChildId;
              return (
                <Pressable
                  key={child.id}
                  onPress={() => handleSelectChild(child.id)}
                  style={[
                    styles.tabletOption,
                    {
                      backgroundColor: isSelected ? colors.primaryLight : 'transparent',
                      borderTopWidth: index > 0 ? 1 : 0,
                      borderTopColor: colors.border,
                    },
                  ]}
                >
                  <View style={[styles.tabletOptionAvatar, { backgroundColor: isSelected ? colors.primary + '30' : colors.backgroundTertiary }]}>
                    {child.avatarUri ? (
                      <Image source={{ uri: child.avatarUri }} style={styles.tabletOptionAvatarImage} />
                    ) : (
                      <Text style={[styles.tabletOptionAvatarText, { color: isSelected ? colors.primary : colors.textSecondary }]}>
                        {child.name.charAt(0)}
                      </Text>
                    )}
                  </View>
                  <View style={styles.tabletOptionInfo}>
                    <Text
                      style={[
                        styles.tabletOptionName,
                        { color: isSelected ? colors.primary : colors.text },
                      ]}
                      numberOfLines={1}
                    >
                      {child.name}
                    </Text>
                    <Text style={[styles.tabletOptionClass, { color: colors.textMuted }]}>{child.classLevel}</Text>
                  </View>
                  {isSelected && (
                    <View style={[styles.tabletOptionCheck, { backgroundColor: colors.primary }]}>
                      <Ionicons name="checkmark" size={14} color="#ffffff" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Single child (no dropdown)
  singleChildContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  childAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  childAvatarImage: {
    width: '100%',
    height: '100%',
  },
  childAvatarText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  childClass: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },

  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ========== MOBILE STYLES ==========
  mobilePillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
    paddingRight: 6,
    paddingVertical: 4,
    borderRadius: 24,
    borderWidth: 1.5,
    gap: 6,
  },
  mobilePillAvatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mobilePillAvatar: {
    width: '100%',
    height: '100%',
  },
  mobilePillAvatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobilePillAvatarText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  mobilePillIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Mobile Dropdown Card
  mobileDropdownCard: {
    width: '85%',
    maxWidth: 320,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 20,
  },
  mobileDropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  mobileDropdownHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  mobileDropdownTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
  mobileDropdownClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileDropdownOptions: {
    padding: 12,
    gap: 8,
  },
  mobileOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 2,
    gap: 12,
  },
  mobileOptionAvatarWrap: {
    width: 48,
    height: 48,
  },
  mobileOptionAvatarRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileOptionAvatarInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mobileOptionAvatarSimple: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mobileOptionAvatarImg: {
    width: '100%',
    height: '100%',
  },
  mobileOptionAvatarText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  mobileOptionInfo: {
    flex: 1,
  },
  mobileOptionName: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    marginBottom: 2,
  },
  mobileOptionClass: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  mobileOptionCheck: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ========== TABLET STYLES ==========
  tabletContainer: {
    minWidth: 180,
  },
  tabletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 10,
  },
  tabletAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tabletAvatarImage: {
    width: '100%',
    height: '100%',
  },
  tabletAvatarText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  tabletInfo: {
    flex: 1,
  },
  tabletName: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  tabletClass: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  tabletDropdownIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tablet Dropdown Card (Modal)
  tabletDropdownCard: {
    width: 280,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 16,
  },
  tabletDropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
  },
  tabletDropdownHeaderText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tabletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  tabletOptionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tabletOptionAvatarImage: {
    width: '100%',
    height: '100%',
  },
  tabletOptionAvatarText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  tabletOptionInfo: {
    flex: 1,
  },
  tabletOptionName: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    marginBottom: 2,
  },
  tabletOptionClass: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  tabletOptionCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChildSwitcher;
