"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FileText,
  Clock,
  Eye,
  Pencil,
  Users,
  Search,
  FolderOpen,
} from "lucide-react";
import { DashboardPage } from "@/components/pages";
import { formatTimeAgo } from "@/contexts/NotificationContext";

interface SharedDocument {
  id: string;
  title: string;
  html: string;
  language: string;
  sharedBy: {
    name: string;
    email: string;
    avatar?: string;
  };
  sharedWith: {
    name: string;
    email: string;
    isClass?: boolean;
    isGroup?: boolean;
  };
  role: "viewer" | "editor";
  sharedAt: string;
}

const STORAGE_KEY = "educo_shared_documents";

export default function SharedDocumentsPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [documents, setDocuments] = useState<SharedDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "viewer" | "editor">("all");

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDocuments(JSON.parse(stored));
      }
    } catch { /* ignore */ }
  }, []);

  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.sharedBy.name.toLowerCase().includes(q)
      );
    }

    if (filterRole !== "all") {
      filtered = filtered.filter((d) => d.role === filterRole);
    }

    return filtered.sort(
      (a, b) => new Date(b.sharedAt).getTime() - new Date(a.sharedAt).getTime()
    );
  }, [documents, searchQuery, filterRole]);

  const handleOpenDocument = (doc: SharedDocument) => {
    router.push(`/doc-editor-test?shared=${doc.id}`);
  };

  if (!isMounted) {
    return <DashboardPage title="Shared Documents" loadingText="Loading shared documents..." breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Shared Documents", isActive: true }]} />;
  }

  return (
    <DashboardPage
      title="Shared Documents"
      description="Documents that have been shared with you"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Shared Documents", isActive: true },
      ]}
      afterStats={
        <div className="mt-6 space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white/80 dark:bg-[#1a1d24]/80 midnight:bg-[#0a0e27]/80 purple:bg-[#1a0b2e]/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-gray-700/30 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50" />
                <input
                  type="text"
                  placeholder="Search by title or shared by..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-ink placeholder-gray-400 dark:placeholder-gray-500 midnight:placeholder-cyan-400/40 purple:placeholder-pink-400/40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-400/40 midnight:focus:ring-cyan-500/40 purple:focus:ring-pink-500/40 transition-all"
                />
              </div>
              {/* Filter buttons */}
              <div className="flex gap-2">
                {(["all", "viewer", "editor"] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      filterRole === role
                        ? "bg-blue-500 text-white shadow-sm dark:bg-blue-600 midnight:bg-cyan-600 purple:bg-pink-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#22262e] dark:text-gray-300 dark:hover:bg-[#2a2d35] midnight:bg-[#0f1330] midnight:text-cyan-300 midnight:hover:bg-cyan-500/10 purple:bg-[#251340] purple:text-pink-300 purple:hover:bg-pink-500/10"
                    }`}
                  >
                    {role === "all" ? "All" : role === "viewer" ? "View Only" : "Can Edit"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Documents Grid */}
          {filteredDocuments.length === 0 ? (
            <div className="bg-white/80 dark:bg-[#1a1d24]/80 midnight:bg-[#0a0e27]/80 purple:bg-[#1a0b2e]/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-gray-700/30 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm p-12 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mb-4">
                <FolderOpen className="w-8 h-8 text-gray-400 dark:text-gray-500 midnight:text-cyan-500/50 purple:text-pink-500/50" />
              </div>
              <p className="text-base font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                {documents.length === 0 ? "No shared documents yet" : "No documents match your search"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/60 purple:text-pink-300/60 mt-1 text-center">
                {documents.length === 0
                  ? "Documents shared with you will appear here"
                  : "Try adjusting your search or filter"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => handleOpenDocument(doc)}
                  className="text-left bg-white/80 dark:bg-[#1a1d24]/80 midnight:bg-[#0a0e27]/80 purple:bg-[#1a0b2e]/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-gray-700/30 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden"
                >
                  {/* Document preview header */}
                  <div className="h-32 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700/50 midnight:from-cyan-900/20 midnight:to-indigo-900/20 purple:from-pink-900/20 purple:to-purple-900/20 p-4 relative overflow-hidden">
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          doc.role === "editor"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 midnight:bg-emerald-500/20 midnight:text-emerald-300 purple:bg-emerald-500/20 purple:text-emerald-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 midnight:bg-cyan-500/20 midnight:text-cyan-300 purple:bg-pink-500/20 purple:text-pink-300"
                        }`}
                      >
                        {doc.role === "editor" ? (
                          <Pencil className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                        {doc.role === "editor" ? "Editor" : "Viewer"}
                      </span>
                    </div>
                    <FileText className="w-10 h-10 text-blue-300 dark:text-gray-500 midnight:text-cyan-600/40 purple:text-pink-600/40 group-hover:scale-110 transition-transform" />
                    {/* Faded content preview */}
                    <div className="mt-2 text-[0.625rem] leading-tight text-gray-400/60 dark:text-gray-500/40 midnight:text-cyan-400/20 purple:text-pink-400/20 line-clamp-3 overflow-hidden max-h-10">
                      {doc.html.replace(/<[^>]*>/g, " ").slice(0, 150)}
                    </div>
                  </div>

                  {/* Document info */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-ink truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400 transition-colors">
                      {doc.title}
                    </h3>

                    {/* Shared by */}
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                        {doc.sharedBy.avatar ? (
                          <Image
                            src={doc.sharedBy.avatar}
                            alt={doc.sharedBy.name}
                            width={24}
                            height={24}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-100 dark:bg-blue-500/20 midnight:bg-cyan-500/20 purple:bg-pink-500/20 flex items-center justify-center text-[0.625rem] font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                            {doc.sharedBy.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 truncate">
                        Shared by {doc.sharedBy.name}
                      </span>
                    </div>

                    {/* Shared with (class/group indicator) */}
                    {(doc.sharedWith.isClass || doc.sharedWith.isGroup) && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Users className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50" />
                        <span className="text-xs text-gray-400 dark:text-gray-500 midnight:text-cyan-300/50 purple:text-pink-300/50">
                          Shared with {doc.sharedWith.name}
                        </span>
                      </div>
                    )}

                    {/* Time */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50" />
                      <span className="text-[0.6875rem] text-gray-400 dark:text-gray-500 midnight:text-cyan-300/50 purple:text-pink-300/50">
                        {formatTimeAgo(doc.sharedAt)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      }
    />
  );
}
