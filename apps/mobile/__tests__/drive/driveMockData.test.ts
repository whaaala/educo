import {
  MOCK_DRIVE_ITEMS,
  getChildren,
  getItem,
  getBreadcrumbPath,
  getRecentItems,
  getStarredItems,
  getSharedItems,
  getBinItems,
  getChildCount,
  formatFileSize,
  timeAgo,
  getFileTypeConfig,
  renameItem,
  toggleStar,
  moveToFolder,
  moveToBin,
  restoreFromBin,
  deletePermanently,
  createFolder,
  getAllFolders,
} from '../../components/drive/driveMockData';

describe('driveMockData — Helper Functions', () => {
  describe('getChildren', () => {
    it('returns children of My Drive', () => {
      const children = getChildren('folder-my-drive');
      expect(children.length).toBeGreaterThan(0);
    });

    it('sorts folders before files', () => {
      const children = getChildren('folder-my-drive');
      const firstFileIdx = children.findIndex(c => c.type === 'file');
      const lastFolderIdx = children.reduce((acc, c, i) => c.type === 'folder' ? i : acc, -1);
      if (firstFileIdx !== -1 && lastFolderIdx !== -1) {
        expect(lastFolderIdx).toBeLessThan(firstFileIdx);
      }
    });

    it('returns empty array for non-existent parent', () => {
      expect(getChildren('nonexistent')).toEqual([]);
    });
  });

  describe('getItem', () => {
    it('returns an item by ID', () => {
      const item = getItem('folder-documents');
      expect(item).toBeDefined();
      expect(item!.name).toBe('Documents');
    });

    it('returns undefined for non-existent ID', () => {
      expect(getItem('nonexistent')).toBeUndefined();
    });
  });

  describe('getBreadcrumbPath', () => {
    it('returns path from root to folder', () => {
      const path = getBreadcrumbPath('folder-documents');
      expect(path.length).toBeGreaterThanOrEqual(2);
      expect(path[0].name).toBe('My Drive');
      expect(path[path.length - 1].name).toBe('Documents');
    });

    it('returns single item for root folder', () => {
      const path = getBreadcrumbPath('folder-my-drive');
      expect(path.length).toBe(1);
      expect(path[0].name).toBe('My Drive');
    });
  });

  describe('getRecentItems', () => {
    it('returns only files (not folders)', () => {
      const recent = getRecentItems();
      expect(recent.every(i => i.type === 'file')).toBe(true);
    });

    it('excludes bin items', () => {
      const recent = getRecentItems();
      expect(recent.every(i => i.parentId !== 'folder-bin')).toBe(true);
    });

    it('is sorted by updatedAt descending', () => {
      const recent = getRecentItems();
      for (let i = 1; i < recent.length; i++) {
        expect(new Date(recent[i - 1].updatedAt).getTime())
          .toBeGreaterThanOrEqual(new Date(recent[i].updatedAt).getTime());
      }
    });
  });

  describe('getStarredItems', () => {
    it('returns only starred items', () => {
      const starred = getStarredItems();
      expect(starred.every(i => i.starred)).toBe(true);
    });

    it('excludes bin items', () => {
      const starred = getStarredItems();
      expect(starred.every(i => i.parentId !== 'folder-bin')).toBe(true);
    });
  });

  describe('getSharedItems', () => {
    it('returns only items not owned by Me', () => {
      const shared = getSharedItems();
      expect(shared.every(i => i.owner !== 'Me' && i.owner !== 'System')).toBe(true);
    });
  });

  describe('getBinItems', () => {
    it('returns only items in the bin folder', () => {
      const bin = getBinItems();
      expect(bin.every(i => i.parentId === 'folder-bin')).toBe(true);
    });
  });

  describe('getChildCount', () => {
    it('returns correct count for a folder', () => {
      const count = getChildCount('folder-my-drive');
      expect(count).toBeGreaterThan(0);
    });

    it('returns 0 for non-existent folder', () => {
      expect(getChildCount('nonexistent')).toBe(0);
    });
  });

  describe('formatFileSize', () => {
    it('returns dash for undefined', () => {
      expect(formatFileSize(undefined)).toBe('—');
    });

    it('formats bytes', () => {
      expect(formatFileSize(500)).toBe('500 B');
    });

    it('formats kilobytes', () => {
      expect(formatFileSize(12000)).toBe('12 KB');
    });

    it('formats megabytes', () => {
      expect(formatFileSize(2400000)).toBe('2.3 MB');
    });
  });

  describe('timeAgo', () => {
    it('returns "Just now" for current time', () => {
      expect(timeAgo(new Date().toISOString())).toBe('Just now');
    });

    it('returns minutes ago', () => {
      const tenMinsAgo = new Date(Date.now() - 10 * 60000).toISOString();
      expect(timeAgo(tenMinsAgo)).toBe('10m ago');
    });

    it('returns hours ago', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 3600000).toISOString();
      expect(timeAgo(threeHoursAgo)).toBe('3h ago');
    });

    it('returns days ago', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString();
      expect(timeAgo(twoDaysAgo)).toBe('2d ago');
    });
  });

  describe('getFileTypeConfig', () => {
    it('returns folder config for folders', () => {
      const config = getFileTypeConfig({ type: 'folder', name: 'Test' } as any);
      expect(config.icon).toBe('folder');
      expect(config.label).toBe('Folder');
    });

    it('returns PDF config for .pdf files', () => {
      const config = getFileTypeConfig({ type: 'file', name: 'report.pdf' } as any);
      expect(config.label).toBe('PDF');
      expect(config.color).toBe('#dc2626');
    });

    it('returns Document config for .docx files', () => {
      const config = getFileTypeConfig({ type: 'file', name: 'notes.docx' } as any);
      expect(config.label).toBe('Document');
    });

    it('returns Spreadsheet config for .xlsx files', () => {
      const config = getFileTypeConfig({ type: 'file', name: 'data.xlsx' } as any);
      expect(config.label).toBe('Spreadsheet');
      expect(config.icon).toBe('grid');
    });

    it('returns Slides config for .pptx files', () => {
      const config = getFileTypeConfig({ type: 'file', name: 'deck.pptx' } as any);
      expect(config.label).toBe('Slides');
    });

    it('returns Video config for .mp4 files', () => {
      const config = getFileTypeConfig({ type: 'file', name: 'video.mp4' } as any);
      expect(config.label).toBe('Video');
      expect(config.icon).toBe('videocam');
    });

    it('returns Image config for .jpg files', () => {
      const config = getFileTypeConfig({ type: 'file', name: 'photo.jpg' } as any);
      expect(config.label).toBe('Image');
    });

    it('falls back to sourceType when extension not recognized', () => {
      const config = getFileTypeConfig({ type: 'file', name: 'unknown', sourceType: 'spreadsheet' } as any);
      expect(config.label).toBe('Spreadsheet');
    });
  });
});

describe('driveMockData — Mutation Helpers', () => {
  describe('renameItem', () => {
    it('renames an existing item', () => {
      const item = getItem('file-011')!;
      const oldName = item.name;
      const result = renameItem('file-011', 'Renamed File.txt');
      expect(result).toBe(true);
      expect(getItem('file-011')!.name).toBe('Renamed File.txt');
      // Restore
      renameItem('file-011', oldName);
    });

    it('returns false for non-existent item', () => {
      expect(renameItem('nonexistent', 'New Name')).toBe(false);
    });
  });

  describe('toggleStar', () => {
    it('stars an unstarred item', () => {
      const item = getItem('file-011')!;
      const wasStar = item.starred;
      toggleStar('file-011');
      expect(getItem('file-011')!.starred).toBe(!wasStar);
      // Restore
      toggleStar('file-011');
    });

    it('returns false for non-existent item', () => {
      expect(toggleStar('nonexistent')).toBe(false);
    });
  });

  describe('moveToFolder', () => {
    it('moves an item to a different folder', () => {
      const item = getItem('file-011')!;
      const originalParent = item.parentId;
      moveToFolder('file-011', 'folder-documents');
      expect(getItem('file-011')!.parentId).toBe('folder-documents');
      // Restore
      moveToFolder('file-011', originalParent);
    });

    it('returns false for non-existent item', () => {
      expect(moveToFolder('nonexistent', 'folder-documents')).toBe(false);
    });
  });

  describe('moveToBin', () => {
    it('moves an item to the bin and saves previous parent', () => {
      const item = getItem('file-011')!;
      const originalParent = item.parentId;
      moveToBin('file-011');
      const binned = getItem('file-011')!;
      expect(binned.parentId).toBe('folder-bin');
      expect(binned.previousParentId).toBe(originalParent);
      // Restore
      restoreFromBin('file-011');
    });
  });

  describe('restoreFromBin', () => {
    it('restores an item to its original folder', () => {
      const item = getItem('file-bin-001')!;
      const prevParent = item.previousParentId;
      restoreFromBin('file-bin-001');
      expect(getItem('file-bin-001')!.parentId).toBe(prevParent);
      // Put back in bin
      moveToBin('file-bin-001');
    });

    it('returns false for non-existent item', () => {
      expect(restoreFromBin('nonexistent')).toBe(false);
    });
  });

  describe('createFolder', () => {
    it('creates a new folder in the specified parent', () => {
      const before = getChildren('folder-my-drive').length;
      const folder = createFolder('Test Folder', 'folder-my-drive');
      expect(folder.name).toBe('Test Folder');
      expect(folder.type).toBe('folder');
      expect(folder.parentId).toBe('folder-my-drive');
      expect(getChildren('folder-my-drive').length).toBe(before + 1);
      // Cleanup
      deletePermanently(folder.id);
    });
  });

  describe('deletePermanently', () => {
    it('removes an item completely', () => {
      const folder = createFolder('ToDelete', 'folder-my-drive');
      const id = folder.id;
      deletePermanently(id);
      expect(getItem(id)).toBeUndefined();
    });

    it('returns false for non-existent item', () => {
      expect(deletePermanently('nonexistent')).toBe(false);
    });
  });

  describe('getAllFolders', () => {
    it('returns only folders', () => {
      const folders = getAllFolders();
      expect(folders.every(f => f.type === 'folder')).toBe(true);
    });

    it('excludes the bin folder', () => {
      const folders = getAllFolders();
      expect(folders.find(f => f.id === 'folder-bin')).toBeUndefined();
    });
  });
});
