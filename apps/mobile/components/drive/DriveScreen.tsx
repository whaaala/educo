import { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { PageHeader } from '../ui/PageHeader';
import {
  type DriveItem,
  type DriveSection,
  SIDEBAR_SECTIONS,
  getChildren,
  getItem,
  getBreadcrumbPath,
  getRecentItems,
  getStarredItems,
  getSharedItems,
  getBinItems,
  getChangeCounter,
  renameItem,
  toggleStar,
  moveToFolder,
  moveToBin,
  restoreFromBin,
  deletePermanently,
  createFolder,
} from './driveMockData';
import { DriveHeader } from './DriveHeader';
import { DriveBreadcrumbs } from './DriveBreadcrumbs';
import { DriveFileList } from './DriveFileList';
import { DriveFileGrid } from './DriveFileGrid';
import { DriveSidebar } from './DriveSidebar';
import { DriveEmptyState } from './DriveEmptyState';
import { DriveActionSheet } from './DriveActionSheet';
import { DriveNewFolderModal } from './DriveNewFolderModal';
import { DriveRenameModal } from './DriveRenameModal';
import { DriveMoveModal } from './DriveMoveModal';

function useIsTablet() {
  const [isTablet] = useState(() => Dimensions.get('window').width >= 768);
  return isTablet;
}

function getRootFolderForSection(section: DriveSection): string {
  switch (section) {
    case 'home':
    case 'myDrive':
      return 'folder-my-drive';
    case 'bin':
      return 'folder-bin';
    default:
      return 'folder-my-drive';
  }
}

const FLAT_SECTIONS: DriveSection[] = ['recent', 'starred', 'shared', 'bin'];

function getSectionLabel(section: DriveSection): string {
  const found = SIDEBAR_SECTIONS.find(s => s.id === section);
  return found?.label || 'Drive';
}

function getEmptyStateConfig(section: DriveSection) {
  switch (section) {
    case 'recent':
      return { icon: 'time-outline', title: 'No recent files', subtitle: 'Files you open or edit will appear here' };
    case 'starred':
      return { icon: 'star-outline', title: 'No starred items', subtitle: 'Star important files and folders for quick access' };
    case 'shared':
      return { icon: 'people-outline', title: 'Nothing shared with you', subtitle: 'Files shared with you will appear here' };
    case 'bin':
      return { icon: 'trash-outline', title: 'Bin is empty', subtitle: 'Items you delete will appear here' };
    default:
      return { icon: 'folder-open-outline', title: 'This folder is empty', subtitle: 'Upload files or create folders to get started' };
  }
}

export function DriveScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const isTablet = useIsTablet();

  const [activeSection, setActiveSection] = useState<DriveSection>('home');
  const [folderStack, setFolderStack] = useState<string[]>([getRootFolderForSection('home')]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(isTablet ? 'grid' : 'list');
  const [selectedItem, setSelectedItem] = useState<DriveItem | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [newFolderVisible, setNewFolderVisible] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);
  const [moveVisible, setMoveVisible] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  const refresh = useCallback(() => setDataVersion(getChangeCounter()), []);

  const currentFolderId = folderStack[folderStack.length - 1];
  const isInSubfolder = folderStack.length > 1;

  const items = useMemo(() => {
    switch (activeSection) {
      case 'home':
      case 'myDrive':
        return getChildren(currentFolderId);
      case 'recent':
        return getRecentItems();
      case 'starred':
        return getStarredItems();
      case 'shared':
        return getSharedItems();
      case 'bin':
        return getBinItems();
      default:
        return [];
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, currentFolderId, dataVersion]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.owner.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  // Breadcrumb path - always show on tablet, show on mobile when in subfolder
  const breadcrumbPath = useMemo(() => {
    if (FLAT_SECTIONS.includes(activeSection) && !isInSubfolder) {
      // For flat sections on tablet, show section name as breadcrumb
      if (isTablet) {
        return [{ id: 'section-root', name: getSectionLabel(activeSection) }];
      }
      return [];
    }
    return getBreadcrumbPath(currentFolderId);
  }, [activeSection, currentFolderId, isInSubfolder, isTablet]);

  const pageTitle = useMemo(() => {
    if (isInSubfolder) {
      const folder = getItem(currentFolderId);
      return folder?.name || 'Drive';
    }
    return 'Drive';
  }, [currentFolderId, isInSubfolder]);

  const handleSectionChange = useCallback((section: DriveSection) => {
    setActiveSection(section);
    setFolderStack([getRootFolderForSection(section)]);
    setSearchQuery('');
  }, []);

  const handleFolderOpen = useCallback((folderId: string) => {
    setFolderStack((prev) => [...prev, folderId]);
    setSearchQuery('');
  }, []);

  const handleItemPress = useCallback((item: DriveItem) => {
    if (item.type === 'folder') {
      handleFolderOpen(item.id);
    } else {
      router.push({ pathname: '/file-preview', params: { id: item.id } });
    }
  }, [handleFolderOpen, router]);

  const handleItemLongPress = useCallback((item: DriveItem) => {
    setSelectedItem(item);
    setActionSheetVisible(true);
  }, []);

  const handleBreadcrumbNavigate = useCallback((folderId: string) => {
    if (folderId === 'section-root') return;
    setFolderStack((prev) => {
      const idx = prev.indexOf(folderId);
      if (idx >= 0) return prev.slice(0, idx + 1);
      return prev;
    });
  }, []);

  const handleBack = useCallback(() => {
    if (isInSubfolder) {
      setFolderStack((prev) => prev.slice(0, -1));
    } else {
      router.back();
    }
  }, [isInSubfolder, router]);

  const handleAction = useCallback((action: string, item: DriveItem) => {
    switch (action) {
      case 'open':
        if (item.type === 'folder') {
          handleFolderOpen(item.id);
        } else {
          router.push({ pathname: '/file-preview', params: { id: item.id } });
        }
        break;
      case 'rename':
        setSelectedItem(item);
        setRenameVisible(true);
        break;
      case 'move':
        setSelectedItem(item);
        setMoveVisible(true);
        break;
      case 'star':
      case 'unstar':
        toggleStar(item.id);
        refresh();
        break;
      case 'delete':
        moveToBin(item.id);
        refresh();
        break;
      case 'restore':
        restoreFromBin(item.id);
        refresh();
        break;
      case 'deletePermanently':
        deletePermanently(item.id);
        refresh();
        break;
      case 'share':
        Alert.alert('Share', `Share link for "${item.name}" copied to clipboard.`, [{ text: 'OK' }]);
        break;
      case 'download':
        Alert.alert('Download', `"${item.name}" has been saved to your device.`, [{ text: 'OK' }]);
        break;
    }
  }, [handleFolderOpen, refresh]);

  const handleRename = useCallback((newName: string) => {
    if (selectedItem) {
      renameItem(selectedItem.id, newName);
      refresh();
    }
  }, [selectedItem, refresh]);

  const handleMove = useCallback((targetFolderId: string) => {
    if (selectedItem) {
      moveToFolder(selectedItem.id, targetFolderId);
      refresh();
    }
  }, [selectedItem, refresh]);

  const handleCreateFolder = useCallback((name: string) => {
    createFolder(name, currentFolderId);
    refresh();
  }, [currentFolderId, refresh]);

  const emptyConfig = getEmptyStateConfig(activeSection);

  const renderContent = () => {
    if (filteredItems.length === 0) {
      if (searchQuery.trim()) {
        return (
          <DriveEmptyState
            icon="search-outline"
            title="No results found"
            subtitle={`No files or folders match "${searchQuery}"`}
          />
        );
      }
      return (
        <DriveEmptyState
          icon={emptyConfig.icon}
          title={emptyConfig.title}
          subtitle={emptyConfig.subtitle}
        />
      );
    }

    if (viewMode === 'grid') {
      return (
        <DriveFileGrid
          items={filteredItems}
          onItemPress={handleItemPress}
          onItemLongPress={handleItemLongPress}
          isTablet={isTablet}
        />
      );
    }

    return (
      <DriveFileList
        items={filteredItems}
        onItemPress={handleItemPress}
        onItemLongPress={handleItemLongPress}
        isTablet={isTablet}
      />
    );
  };

  // ─── Tablet layout ───
  if (isTablet) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.tabletRow}>
          <DriveSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />

          <View style={styles.tabletContent}>
            <DriveHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              isTablet={isTablet}
            />

            {/* Breadcrumbs - always visible on tablet */}
            <DriveBreadcrumbs
              path={breadcrumbPath}
              onNavigate={handleBreadcrumbNavigate}
              isTablet={isTablet}
            />

            {/* Divider */}
            <View style={[styles.tabletDivider, { backgroundColor: colors.border }]} />

            {renderContent()}
          </View>
        </View>

        {/* FAB */}
        <Pressable
          onPress={() => setNewFolderVisible(true)}
          style={({ pressed }) => [
            styles.fab,
            {
              backgroundColor: colors.primary,
              transform: [{ scale: pressed ? 0.94 : 1 }],
            },
          ]}
        >
          <Ionicons name="add" size={26} color={colors.primaryText} />
        </Pressable>

        <DriveActionSheet
          visible={actionSheetVisible}
          onClose={() => setActionSheetVisible(false)}
          item={selectedItem}
          onAction={handleAction}
        />
        <DriveNewFolderModal
          visible={newFolderVisible}
          onClose={() => setNewFolderVisible(false)}
          onCreate={handleCreateFolder}
        />
        <DriveRenameModal
          visible={renameVisible}
          onClose={() => setRenameVisible(false)}
          currentName={selectedItem?.name || ''}
          onRename={handleRename}
        />
        <DriveMoveModal
          visible={moveVisible}
          onClose={() => setMoveVisible(false)}
          item={selectedItem}
          onMove={handleMove}
        />
      </SafeAreaView>
    );
  }

  // ─── Mobile layout ───
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <PageHeader
        title={pageTitle}
        showBackButton
        onBackPress={handleBack}
        showChildSwitcher={false}
      />

      <DriveHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sections={SIDEBAR_SECTIONS}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isTablet={isTablet}
      />

      {breadcrumbPath.length > 1 && (
        <DriveBreadcrumbs
          path={breadcrumbPath}
          onNavigate={handleBreadcrumbNavigate}
          isTablet={isTablet}
        />
      )}

      {renderContent()}

      <Pressable
        onPress={() => setNewFolderVisible(true)}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: colors.primary,
            transform: [{ scale: pressed ? 0.94 : 1 }],
          },
        ]}
      >
        <Ionicons name="add" size={26} color={colors.primaryText} />
      </Pressable>

      <DriveActionSheet
        visible={actionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        item={selectedItem}
        onAction={handleAction}
      />
      <DriveNewFolderModal
        visible={newFolderVisible}
        onClose={() => setNewFolderVisible(false)}
        onCreate={handleCreateFolder}
      />
      <DriveRenameModal
        visible={renameVisible}
        onClose={() => setRenameVisible(false)}
        currentName={selectedItem?.name || ''}
        onRename={handleRename}
      />
      <DriveMoveModal
        visible={moveVisible}
        onClose={() => setMoveVisible(false)}
        item={selectedItem}
        onMove={handleMove}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  tabletRow: {
    flex: 1,
    flexDirection: 'row',
  },
  tabletContent: {
    flex: 1,
  },
  tabletDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 28,
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
});

export default DriveScreen;
