import { useState, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
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
import { DriveSectionPills } from './DriveSectionPills';
import { DriveSearchBar } from './DriveSearchBar';
import { DriveBreadcrumbs } from './DriveBreadcrumbs';
import { DriveContent } from './DriveContent';
import { DriveSidebar } from './DriveSidebar';
import { DriveFAB } from './DriveFAB';
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

  const [activeSection, setActiveSection] = useState<DriveSection>('myDrive');
  const [folderStack, setFolderStack] = useState<string[]>([getRootFolderForSection('myDrive')]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(isTablet ? 'grid' : 'list');
  const [selectedItem, setSelectedItem] = useState<DriveItem | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [newFolderVisible, setNewFolderVisible] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);
  const [moveVisible, setMoveVisible] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const [displayCount, setDisplayCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const refresh = useCallback(() => setDataVersion(getChangeCounter()), []);

  const currentFolderId = folderStack[folderStack.length - 1];
  const isInSubfolder = folderStack.length > 1;

  const items = useMemo(() => {
    switch (activeSection) {
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

  const allFilteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.owner.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const filteredItems = useMemo(() =>
    allFilteredItems.slice(0, displayCount),
    [allFilteredItems, displayCount]
  );

  const hasMore = filteredItems.length < allFilteredItems.length;

  const handleLoadMore = useCallback(() => {
    setIsLoadingMore(true);
    // Simulate loading delay for UX
    setTimeout(() => {
      setDisplayCount(prev => prev + 10);
      setIsLoadingMore(false);
    }, 500);
  }, []);

  const breadcrumbPath = useMemo(() => {
    if (FLAT_SECTIONS.includes(activeSection) && !isInSubfolder) {
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
    setDisplayCount(10);
  }, []);

  const handleFolderOpen = useCallback((folderId: string) => {
    setFolderStack((prev) => [...prev, folderId]);
    setSearchQuery('');
    setDisplayCount(10);
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
  }, [handleFolderOpen, refresh, router]);

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

  const handleFABPress = useCallback(() => setNewFolderVisible(true), []);

  const emptyConfig = getEmptyStateConfig(activeSection);
  const emptyProps = useMemo(() => searchQuery.trim()
    ? { emptyIcon: 'search-outline', emptyTitle: 'No results found', emptySubtitle: `No files or folders match "${searchQuery}"` }
    : { emptyIcon: emptyConfig.icon, emptyTitle: emptyConfig.title, emptySubtitle: emptyConfig.subtitle },
    [searchQuery, emptyConfig.icon, emptyConfig.title, emptyConfig.subtitle]);

  const showBreadcrumbs = isTablet ? breadcrumbPath.length > 0 : breadcrumbPath.length > 1;

  // Modals
  const modals = (
    <>
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
    </>
  );

  // ─── Tablet layout ───
  if (isTablet) {
    return (
      <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.tabletRow}>
          {/* Fixed sidebar */}
          <DriveSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />

          {/* Main content column */}
          <View style={styles.mainColumn}>
            {/* Fixed header area — does NOT scroll */}
            <View style={styles.tabletFixedHeader}>
              <DriveSearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                isTablet
              />

              {showBreadcrumbs && (
                <DriveBreadcrumbs
                  path={breadcrumbPath}
                  onNavigate={handleBreadcrumbNavigate}
                  isTablet
                />
              )}

              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            </View>

            {/* Scrollable content — only this scrolls */}
            <DriveContent
              items={filteredItems}
              viewMode={viewMode}
              isTablet
              onItemPress={handleItemPress}
              onItemLongPress={handleItemLongPress}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              isLoadingMore={isLoadingMore}
              totalItems={allFilteredItems.length}
              {...emptyProps}
            />
          </View>
        </View>

        <DriveFAB onPress={handleFABPress} />
        {modals}
      </View>
    );
  }

  // ─── Mobile layout ───
  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Fixed header area — does NOT scroll */}
      <PageHeader
        title={pageTitle}
        showBackButton
        onBackPress={handleBack}
        showChildSwitcher={false}
      />

      <DriveSectionPills
        sections={SIDEBAR_SECTIONS}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <DriveSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isTablet={false}
      />

      {showBreadcrumbs && (
        <DriveBreadcrumbs
          path={breadcrumbPath}
          onNavigate={handleBreadcrumbNavigate}
          isTablet={false}
        />
      )}

      {/* Scrollable content — only this scrolls */}
      <DriveContent
        items={filteredItems}
        viewMode={viewMode}
        isTablet={false}
        onItemPress={handleItemPress}
        onItemLongPress={handleItemLongPress}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        isLoadingMore={isLoadingMore}
        totalItems={allFilteredItems.length}
        {...emptyProps}
      />

      <DriveFAB onPress={handleFABPress} />
      {modals}
    </View>
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
  mainColumn: {
    flex: 1,
  },
  tabletFixedHeader: {
    paddingTop: 48,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 24,
  },
});

export default DriveScreen;
