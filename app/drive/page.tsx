"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import FileBrowser, { type FileBrowserItem } from "@/components/shared/FileBrowser/FileBrowser";
import MoveDialog from "@/components/shared/MoveDialog";
import NewFolderDialog from "@/components/shared/NewFolderDialog";
import UploadProgress, { type UploadFileItem } from "@/components/shared/UploadProgress";
import { driveStorage, type DriveItem } from "@/lib/drive-storage";
import { docStorage } from "@/lib/doc-storage";
import { slideStorage } from "@/lib/slide-storage";
import AddButton from "@/components/shared/AddButton";
import ActionMenuDropdown, { type ActionMenuEntry } from "@/components/shared/ActionMenuDropdown";
import { getAllTeachers } from "@/lib/mockTeachers";
import { useUser } from "@/contexts/UserContext";
import type { PersonItem } from "@/components/shared/PeopleFilterDropdown";
import {
  HardDrive, FolderPlus, Plus, Home, Users, Clock, Star, Trash2, Cloud,
  Upload, FileText, Presentation, FolderUp,
} from "lucide-react";

export default function DrivePage() {
  const router = useRouter();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState("folder-my-drive");
  const [activeSection, setActiveSection] = useState("my-drive");
  const [peopleFilter, setPeopleFilter] = useState<PersonItem | null>(null);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [moveItem, setMoveItem] = useState<DriveItem | null>(null);
  const [items, setItems] = useState<DriveItem[]>([]);

  // Upload state
  const [uploadFiles, setUploadFiles] = useState<UploadFileItem[]>([]);
  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const uploadPausedRef = useRef(false);
  const uploadTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const refreshItems = useCallback(() => {
    setItems(driveStorage.getChildren(currentFolderId));
  }, [currentFolderId]);

  useEffect(() => {
    docStorage.list().forEach(doc => driveStorage.ensureFileEntry(doc.id, doc.title, "document"));
    slideStorage.list().forEach(pres => driveStorage.ensureFileEntry(pres.id, pres.title, "presentation"));
    refreshItems();
    setMounted(true);
  }, [refreshItems]);

  useEffect(() => {
    const handler = () => refreshItems();
    window.addEventListener("driveChanged", handler);
    return () => window.removeEventListener("driveChanged", handler);
  }, [refreshItems]);

  const breadcrumbs = useMemo(() => {
    return driveStorage.getPath(currentFolderId).map(p => ({ id: p.id, name: p.name }));
  }, [currentFolderId]);

  const currentUserFullName = `${user?.firstName || "System"} ${user?.lastName || "Administrator"}`;

  const mapOwner = (owner?: string) => {
    if (!owner || owner === "Me" || owner === "me") return currentUserFullName;
    return owner;
  };

  const browserItems: FileBrowserItem[] = useMemo(() => {
    return items.map(item => ({
      id: item.id, name: item.name, type: item.type, sourceType: item.sourceType,
      size: item.size, updatedAt: item.updatedAt, readOnly: item.readOnly,
      childCount: item.type === "folder" ? driveStorage.getChildren(item.id).length : undefined,
      owner: mapOwner(item.owner),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, user]);

  const recentFiles: FileBrowserItem[] = useMemo(() => {
    if (currentFolderId !== "folder-my-drive") return [];
    return driveStorage.list()
      .filter(i => i.type === "file")
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
      .map(item => ({
        id: item.id, name: item.name, type: item.type as "file", sourceType: item.sourceType,
        size: item.size, updatedAt: item.updatedAt,
        folderName: driveStorage.getFolderName(item.parentId), owner: mapOwner(item.owner),
      }));
  }, [currentFolderId, items]);

  const allBrowserItems: FileBrowserItem[] = useMemo(() => {
    return driveStorage.list().filter(i => !i.readOnly).map(item => ({
      id: item.id, name: item.name, type: item.type, sourceType: item.sourceType,
      size: item.size, updatedAt: item.updatedAt, readOnly: item.readOnly,
      folderName: driveStorage.getFolderName(item.parentId), owner: mapOwner(item.owner),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, user]);

  const sidebarItems = useMemo(() => [
    { id: "home", label: "Home", icon: Home, active: activeSection === "home" },
    { id: "my-drive", label: "My Drive", icon: HardDrive, active: activeSection === "my-drive" },
    { id: "shared", label: "Shared with me", icon: Users, active: activeSection === "shared" },
    { id: "recent", label: "Recent", icon: Clock, active: activeSection === "recent" },
    { id: "starred", label: "Starred", icon: Star, active: activeSection === "starred" },
    { id: "bin", label: "Bin", icon: Trash2, active: activeSection === "bin" },
    { id: "storage", label: "Storage", icon: Cloud, active: activeSection === "storage" },
  ], [activeSection]);

  // ── Upload handlers ──

  const simulateUpload = (fileList: { name: string; type: "file" | "folder" }[]) => {
    const uploadItems: UploadFileItem[] = fileList.map((f, i) => ({
      id: `upload-${Date.now()}-${i}`,
      name: f.name,
      type: f.type,
      progress: 0,
      status: "uploading" as const,
    }));

    setUploadFiles(uploadItems);
    setShowUploadProgress(true);
    uploadPausedRef.current = false;
    // Clear any existing timers
    uploadTimersRef.current.forEach(t => clearTimeout(t));
    uploadTimersRef.current = [];

    // Simulate progress for each file with pause support
    uploadItems.forEach((item, idx) => {
      const duration = 1500 + Math.random() * 2000;
      const steps = 10;
      const stepTime = duration / steps;

      for (let step = 1; step <= steps; step++) {
        const delay = stepTime * step + idx * 500;

        const scheduleStep = (remainingDelay: number) => {
          const timer = setTimeout(() => {
            // If paused, re-schedule this step to check again later
            if (uploadPausedRef.current) {
              const retryTimer = setTimeout(() => scheduleStep(100), 100);
              uploadTimersRef.current.push(retryTimer);
              return;
            }

            setUploadFiles(prev => prev.map(f =>
              f.id === item.id
                ? { ...f, progress: Math.min(100, Math.round((step / steps) * 100)), status: step === steps ? "complete" : "uploading" }
                : f
            ));

            if (step === steps) {
              driveStorage.create({
                parentId: currentFolderId,
                name: item.name,
                type: item.type === "folder" ? "folder" : "file",
                sourceType: "upload",
                size: Math.round(Math.random() * 5000000),
              });
              refreshItems();
            }
          }, remainingDelay);
          uploadTimersRef.current.push(timer);
        };

        scheduleStep(delay);
      }
    });
  };

  const handleUploadPause = () => { uploadPausedRef.current = true; };
  const handleUploadResume = () => { uploadPausedRef.current = false; };
  const handleUploadCancel = () => {
    uploadTimersRef.current.forEach(t => clearTimeout(t));
    uploadTimersRef.current = [];
    uploadPausedRef.current = false;
    setShowUploadProgress(false);
    setUploadFiles([]);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFolderUpload = () => {
    folderInputRef.current?.click();
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileList = Array.from(files).map(f => ({ name: f.name, type: "file" as const }));
    simulateUpload(fileList);
    e.target.value = "";
  };

  const handleFolderSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    // Get the folder name from the first file's path
    const firstPath = files[0].webkitRelativePath || files[0].name;
    const folderName = firstPath.split("/")[0] || "Uploaded folder";
    const fileList = [
      { name: folderName, type: "folder" as const },
      ...Array.from(files).map(f => ({ name: f.name, type: "file" as const })),
    ];
    simulateUpload(fileList);
    e.target.value = "";
  };

  // ── People who have shared files — derived from actual file owners in the drive ──
  const people: PersonItem[] = useMemo(() => {
    const allDriveItems = driveStorage.list();
    const currentUserName = `${user?.firstName || "System"} ${user?.lastName || "Administrator"}`;

    // Collect unique owners from files that exist in the drive
    const ownerMap = new Map<string, PersonItem>();

    // Always include current user
    ownerMap.set(currentUserName.toLowerCase(), {
      id: user?.id || "user-001",
      name: currentUserName,
      email: user?.email || "admin@educo.africa",
      avatar: user?.avatar,
      isMe: true,
    });

    // Find all unique owners from drive items
    for (const item of allDriveItems) {
      if (item.type === "file" && item.owner && item.owner !== "Me" && item.owner !== "System") {
        const key = item.owner.toLowerCase();
        if (!ownerMap.has(key)) {
          // Try to match with a teacher from the app
          const teacher = getAllTeachers().find(t =>
            `${t.firstName} ${t.lastName}`.toLowerCase() === key
          );
          ownerMap.set(key, {
            id: teacher?.id || `person-${key}`,
            name: item.owner,
            email: teacher?.email || `${key.replace(/\s+/g, ".")}@school.edu`,
            avatar: teacher?.imageUrl,
            isMe: false,
          });
        }
      }
    }

    return Array.from(ownerMap.values());
  }, [user, items]);

  // ── Workspace menu items ──

  const workspaceCreateItems: ActionMenuEntry[] = useMemo(() => [
    { id: "new-folder", label: "New folder", icon: FolderPlus, shortcut: "Alt+C then F", onClick: () => setShowNewFolderDialog(true) },
    { id: "upload-file", label: "File upload", icon: Upload, shortcut: "Alt+C then U", onClick: handleFileUpload },
    { id: "upload-folder", label: "Folder upload", icon: FolderUp, shortcut: "Alt+C then I", onClick: handleFolderUpload },
    { type: "divider" as const },
    { id: "new-document", label: "Document", icon: FileText, iconColor: "text-blue-500", onClick: () => {
      const id = docStorage.create({});
      window.open(`/doc-editor-test?id=${id}`, "_blank");
    }},
    { id: "new-presentation", label: "Presentation", icon: Presentation, iconColor: "text-amber-500", onClick: () => {
      const id = slideStorage.create({});
      window.open(`/presentations/editor?id=${id}`, "_blank");
    }},
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  const handleNavigate = (folderId: string) => {
    setCurrentFolderId(folderId);
    setActiveSection("my-drive");
  };

  const handleSidebarNavigate = (id: string) => {
    setActiveSection(id);
    if (id === "my-drive" || id === "home") setCurrentFolderId("folder-my-drive");
  };

  // Open files in new tab
  const handleFileOpen = (item: FileBrowserItem) => {
    const driveItem = driveStorage.list().find(i => i.id === item.id);
    if (driveItem?.sourceId) {
      if (driveItem.sourceType === "document") window.open(`/doc-editor-test?id=${driveItem.sourceId}`, "_blank");
      else if (driveItem.sourceType === "presentation") window.open(`/presentations/editor?id=${driveItem.sourceId}`, "_blank");
    }
  };

  const handleRename = (itemId: string, newName: string) => { driveStorage.rename(itemId, newName); refreshItems(); };
  const handleMove = (item: FileBrowserItem) => { const d = items.find(i => i.id === item.id) || driveStorage.get(item.id); if (d) setMoveItem(d); };
  const handleDelete = (item: FileBrowserItem) => { if (window.confirm(`Delete "${item.name}"?`)) { driveStorage.remove(item.id); refreshItems(); } };
  const handleCreateFolder = (name: string) => { driveStorage.createFolder(currentFolderId, name); refreshItems(); };

  if (!mounted) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-[1400px] mx-auto">
        <FileBrowser
          title="My Drive"
          subtitle="Manage your files and folders"
          icon={HardDrive}
          breadcrumbs={breadcrumbs}
          items={browserItems}
          allItems={allBrowserItems}
          recentFiles={recentFiles}
          sidebarItems={sidebarItems}
          storageUsed="20.1 MB"
          storageTotal="100 MB"
          storagePercent={20}
          searchPlaceholder="Search in Drive..."
          headerActions={
            <ActionMenuDropdown
              trigger={<AddButton label="New" icon={<Plus className="w-4 h-4" />} />}
              items={workspaceCreateItems}
              width="w-[260px]"
            />
          }
          titleMenuItems={workspaceCreateItems}
          people={people}
          onPeopleFilter={setPeopleFilter}
          onNavigate={handleNavigate}
          onSidebarNavigate={handleSidebarNavigate}
          onFileOpen={handleFileOpen}
          onRename={handleRename}
          onMove={handleMove}
          onDelete={handleDelete}
          onCreateFolder={handleCreateFolder}
          emptyAction={
            <button onClick={() => setShowNewFolderDialog(true)}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/15 transition-colors cursor-pointer">
              <FolderPlus className="w-4 h-4" /> Create a folder
            </button>
          }
        />
      </div>

      {/* Hidden file inputs for upload */}
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFilesSelected} />
      <input ref={folderInputRef} type="file" multiple className="hidden"
        {...{ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement>}
        onChange={handleFolderSelected} />

      {/* New Folder Dialog */}
      <NewFolderDialog
        isOpen={showNewFolderDialog}
        onClose={() => setShowNewFolderDialog(false)}
        onSubmit={handleCreateFolder}
      />

      {/* Move Dialog */}
      {moveItem && (
        <MoveDialog
          isOpen={true}
          onClose={() => setMoveItem(null)}
          fileName={moveItem.name}
          fileId={moveItem.id}
          sourceType={moveItem.sourceType}
          onMoveComplete={() => { setMoveItem(null); refreshItems(); }}
        />
      )}

      {/* Upload Progress Toast */}
      <UploadProgress
        isOpen={showUploadProgress}
        files={uploadFiles}
        onPause={handleUploadPause}
        onResume={handleUploadResume}
        onCancel={handleUploadCancel}
        onDismiss={() => { setShowUploadProgress(false); setUploadFiles([]); }}
      />
    </MainLayout>
  );
}
