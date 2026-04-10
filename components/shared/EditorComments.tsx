"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Check,
  X,
  RotateCw,
  MessageCircle,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Trash2,
  Send,
  Reply,
  CornerDownRight,
  AtSign,
} from "lucide-react";
import Tooltip from "@/components/shared/Tooltip";
import { formatTimeAgo } from "@/contexts/NotificationContext";

// ── Types ──

export type CommentStatus = "open" | "resolved" | "rejected";

export interface CommentAuthor {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface CommentMention {
  userId: string;
  name: string;
  offset: number;
  length: number;
}

export interface CommentReply {
  id: string;
  author: CommentAuthor;
  text: string;
  mentions: CommentMention[];
  createdAt: string;
}

export interface DocComment {
  id: string;
  documentId: string;
  author: CommentAuthor;
  selectedText: string;
  highlightRange: {
    pageIndex: number;
    startOffset: number;
    endOffset: number;
    anchorPath: string;
    focusPath: string;
    textOffset?: number;
  };
  tabId?: string;
  text: string;
  mentions: CommentMention[];
  status: CommentStatus;
  resolution?: {
    by: CommentAuthor;
    action: "resolved" | "rejected";
    message?: string;
    at: string;
  };
  replies: CommentReply[];
  createdAt: string;
  updatedAt: string;
}

export type MentionUser = { id: string; name: string; avatar?: string };

// ── useMention Hook ──

export function useMention({
  users,
  inputRef,
  value,
  onChange,
}: {
  users: MentionUser[];
  inputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  value: string;
  onChange: (val: string) => void;
}) {
  const [active, setActive] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [triggerPos, setTriggerPos] = useState(-1);

  const filtered = useMemo(() => {
    if (!active) return [];
    return users.filter((u) => !query || u.name.toLowerCase().includes(query.toLowerCase()));
  }, [active, query, users]);

  useEffect(() => {
    setHighlightIdx(0);
  }, [filtered.length]);

  const insertMention = useCallback((user: MentionUser) => {
    if (triggerPos < 0) return;
    const before = value.slice(0, triggerPos);
    const after = value.slice(triggerPos + 1 + query.length);
    const newVal = `${before}@${user.name} ${after}`;
    onChange(newVal);
    setActive(false);
    setQuery("");
    setTriggerPos(-1);

    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el) {
        const cursorPos = triggerPos + user.name.length + 2;
        el.focus();
        el.setSelectionRange(cursorPos, cursorPos);
      }
    });
  }, [triggerPos, query, value, onChange, inputRef]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!active || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && active) {
      e.preventDefault();
      e.stopPropagation();
      insertMention(filtered[highlightIdx]);
    } else if (e.key === "Escape") {
      setActive(false);
    }
  }, [active, filtered, highlightIdx, insertMention]);

  const handleChange = useCallback((newVal: string) => {
    onChange(newVal);
    const el = inputRef.current;
    if (!el) return;
    const cursorPos = (el as HTMLTextAreaElement).selectionStart ?? newVal.length;

    const textBeforeCursor = newVal.slice(0, cursorPos);
    const lastAt = textBeforeCursor.lastIndexOf("@");

    if (lastAt >= 0) {
      const afterAt = textBeforeCursor.slice(lastAt + 1);
      if (afterAt.length === 0 || /^[\w\s]{0,30}$/.test(afterAt)) {
        setActive(true);
        setQuery(afterAt);
        setTriggerPos(lastAt);
        return;
      }
    }
    setActive(false);
    setQuery("");
    setTriggerPos(-1);
  }, [onChange, inputRef]);

  return { active, filtered, highlightIdx, query, insertMention, handleKeyDown, handleChange, setActive };
}

// ── MentionPopover ──

export function MentionPopover({
  users,
  highlightIdx,
  onSelect,
  position = "above",
}: {
  users: MentionUser[];
  highlightIdx: number;
  onSelect: (user: MentionUser) => void;
  position?: "above" | "below";
}) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;
    const highlighted = listRef.current.querySelector("[data-mention-highlighted='true']");
    if (highlighted) highlighted.scrollIntoView({ block: "nearest" });
  }, [highlightIdx]);

  if (users.length === 0) return null;

  return (
    <div
      ref={listRef}
      data-mention-popover
      className={[
        "absolute left-0 w-full max-h-[180px] overflow-y-auto z-[250]",
        "rounded-xl border border-white/20 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30/40",
        "bg-white/80 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/80 backdrop-blur-xl",
        "shadow-2xl shadow-black/10 dark:shadow-black/30",
        position === "above" ? "bottom-full mb-1.5" : "top-full mt-1.5",
      ].join(" ")}
      role="listbox"
      aria-label="Mention suggestions"
    >
      <div className="py-1">
        {users.map((user, i) => (
          <button
            key={user.id}
            type="button"
            role="option"
            aria-selected={i === highlightIdx}
            data-mention-highlighted={i === highlightIdx ? "true" : undefined}
            data-mention-user-id={user.id}
            className={[
              "w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors cursor-pointer",
              i === highlightIdx
                ? "bg-blue-50/80 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30"
                : "hover:bg-gray-50/80 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5/50",
            ].join(" ")}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(user)}
          >
            <CommentAvatar author={{ id: user.id, name: user.name, avatar: user.avatar }} size={28} />
            <div className="min-w-0 flex-1">
              <div className={[
                "text-[12px] font-medium truncate",
                i === highlightIdx ? "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300" : "text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100",
              ].join(" ")}>
                {user.name}
              </div>
            </div>
            {i === highlightIdx && (
              <span className="text-[9px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 flex-shrink-0">Enter</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── renderMentionPills ──

export function renderMentionPills(text: string) {
  const parts = text.split(/(@\w+(?:\s+\w+)?)/g);
  return parts.map((part, i) => {
    if (part.startsWith("@")) {
      return (
        <span
          key={i}
          data-mention-pill
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 text-[10px] font-semibold leading-none whitespace-nowrap"
        >
          <AtSign className="w-2.5 h-2.5 opacity-70" />
          {part.slice(1)}
        </span>
      );
    }
    return part;
  });
}

// ── CommentAvatar ──

export function CommentAvatar({ author, size = 28 }: { author: CommentAuthor; size?: number }) {
  const bgColors = ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500", "bg-indigo-500"];
  const hash = author.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const bgColor = bgColors[hash % bgColors.length];
  const initials = author.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div
      className={`relative flex-shrink-0 rounded-full overflow-hidden ${bgColor}`}
      style={{ width: size, height: size }}
    >
      {author.avatar ? (
        <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white font-bold" style={{ fontSize: size * 0.4 }}>
          {initials}
        </div>
      )}
    </div>
  );
}

// ── CommentCard ──

export function CommentCard({
  comment,
  isActive,
  onSelect,
  onReply,
  onResolve,
  onReject,
  onReopen,
  onDelete,
  isOwner,
  currentAuthor,
  mentionableUsers,
  filterFade = false,
}: {
  comment: DocComment;
  isActive: boolean;
  onSelect: () => void;
  onReply: (text: string) => void;
  onResolve: (msg?: string) => void;
  onReject: (msg?: string) => void;
  onReopen?: () => void;
  onDelete: () => void;
  isOwner: boolean;
  currentAuthor: CommentAuthor;
  mentionableUsers: Array<{ id: string; name: string; avatar?: string }>;
  filterFade?: boolean;
}) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showActions, setShowActions] = useState(false);
  const replyRef = useRef<HTMLTextAreaElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const isResolved = comment.status === "resolved" || comment.status === "rejected";

  const mention = useMention({
    users: mentionableUsers,
    inputRef: replyRef,
    value: replyText,
    onChange: setReplyText,
  });

  useEffect(() => {
    if (!showActions) return;
    const handler = (e: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) setShowActions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showActions]);

  const handleSubmitReply = () => {
    const text = replyText.trim();
    if (!text) return;
    onReply(text);
    setReplyText("");
    setShowReplyInput(false);
    mention.setActive(false);
  };

  const timeAgo = formatTimeAgo(comment.createdAt);

  return (
    <div
      data-doc-comment-card={comment.id}
      data-active={isActive ? "true" : undefined}
      data-resolved={isResolved ? "true" : undefined}
      data-filter-fade={filterFade && isResolved ? "true" : undefined}
      onClick={onSelect}
      className={[
        "rounded-xl border p-2.5 transition-all duration-200 cursor-pointer group",
        isActive
          ? "border-blue-300 dark:border-blue-600 bg-blue-50/60 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 shadow-md ring-1 ring-blue-200/50 dark:ring-blue-700/30"
          : "border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm",
        isResolved ? "opacity-70" : "",
      ].join(" ")}
    >
      {/* Header: author + time + actions */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <CommentAvatar author={comment.author} size={24} />
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate">{comment.author.name}</div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">{timeAgo}</div>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {comment.status === "resolved" && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mr-1">
              Resolved
            </span>
          )}
          {comment.status === "rejected" && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 mr-1">
              Rejected
            </span>
          )}
          {!isResolved && isOwner && (
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <Tooltip content="Resolve" delay={300}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onResolve(); }}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                </button>
              </Tooltip>
              <Tooltip content="Reject" delay={300}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onReject(); }}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-red-400 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
                </button>
              </Tooltip>
            </div>
          )}
          {isResolved && onReopen && (
            <Tooltip content="Reopen" delay={300}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onReopen(); }}
                className="w-6 h-6 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all cursor-pointer"
              >
                <RotateCw className="w-3 h-3 text-blue-500 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </button>
            </Tooltip>
          )}
          {!isResolved && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowReplyInput(true); }}
              className="w-6 h-6 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-all cursor-pointer"
              title="Reply"
            >
              <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
          <div ref={actionsRef} className="relative">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowActions(!showActions); }}
              className="w-6 h-6 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-all cursor-pointer"
            >
              <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
            </button>
            {showActions && (
              <div className="absolute right-0 top-full mt-1 w-[140px] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] shadow-xl py-1 z-10">
                {isOwner && !isResolved && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onResolve(); setShowActions(false); }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolve
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onReject(); setShowActions(false); }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </>
                )}
                {isResolved && onReopen && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onReopen(); setShowActions(false); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    Reopen
                  </button>
                )}
                {(isOwner || currentAuthor.id === comment.author.id) && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDelete(); setShowActions(false); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab indicator */}
      {comment.tabId && (
        <div className="mb-1">
          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
            {comment.tabId.replace("tab-", "Tab ")}
          </span>
        </div>
      )}

      {/* Selected text excerpt */}
      <div className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 mb-1.5 px-1.5 py-1 bg-yellow-50/60 dark:bg-yellow-900/15 rounded border-l-2 border-yellow-400 dark:border-yellow-600 line-clamp-1">
        &ldquo;{comment.selectedText}&rdquo;
      </div>

      {/* Comment body */}
      <p className="text-[12px] text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 leading-relaxed mb-1.5">
        {renderMentionPills(comment.text)}
      </p>

      {/* Resolution info */}
      {comment.resolution && (
        <div className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 italic mb-1.5 flex items-center gap-1">
          {comment.resolution.action === "resolved" ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          ) : (
            <XCircle className="w-3 h-3 text-red-500" />
          )}
          {comment.resolution.action === "resolved" ? "Resolved" : "Rejected"} by {comment.resolution.by.name}
          {comment.resolution.message && ` — "${comment.resolution.message}"`}
        </div>
      )}

      {/* Replies thread */}
      {comment.replies.length > 0 && (
        <div className="mt-2 space-y-1.5 pl-3 border-l-2 border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex gap-2">
              <CommentAvatar author={reply.author} size={20} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">{reply.author.name}</span>
                  <span className="text-[9px] text-gray-400">{formatTimeAgo(reply.createdAt)}</span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 leading-relaxed">
                  {renderMentionPills(reply.text)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply input */}
      {!isResolved && (
        <div className="mt-2">
          {showReplyInput ? (
            <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <textarea
                  ref={replyRef}
                  autoFocus
                  value={replyText}
                  onChange={(e) => mention.handleChange(e.target.value)}
                  onKeyDown={(e) => {
                    mention.handleKeyDown(e);
                    if (!mention.active && e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmitReply();
                    if (e.key === "Escape" && !mention.active) { setShowReplyInput(false); setReplyText(""); }
                  }}
                  placeholder="Reply... (@ to mention)"
                  className="w-full text-[11px] text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 bg-gray-50/80 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/80 midnight:bg-[#0a0e27]/80 purple:bg-[#1a0b2e]/80 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-lg px-2.5 py-1.5 resize-none outline-none focus:ring-2 focus:ring-blue-400/40 placeholder-gray-400"
                  rows={2}
                />
                {mention.active && (
                  <MentionPopover
                    users={mention.filtered}
                    highlightIdx={mention.highlightIdx}
                    onSelect={(u) => mention.insertMention(u)}
                  />
                )}
              </div>
              <div className="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowReplyInput(false); setReplyText(""); }}
                  className="text-[10px] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleSubmitReply(); }}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-blue-500 hover:bg-blue-600 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  Reply
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowReplyInput(true); }}
              className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <Reply className="w-3 h-3" />
              Reply
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── FloatingCommentPill ──

export function FloatingCommentPill({
  comment,
  isActive,
  onSelect,
  onScrollTo,
  onReply,
  onResolve,
  onReject,
  onReopen,
  onDelete,
  onOpenSidebar,
  isOwner,
  mentionableUsers = [],
}: {
  comment: DocComment;
  isActive: boolean;
  onSelect: () => void;
  onScrollTo: () => void;
  onReply: (text: string) => void;
  onResolve: (msg?: string) => void;
  onReject: (msg?: string) => void;
  onReopen?: () => void;
  onDelete: () => void;
  onOpenSidebar: () => void;
  isOwner: boolean;
  mentionableUsers?: MentionUser[];
}) {
  const [replyText, setReplyText] = useState("");
  const [showActions, setShowActions] = useState(false);
  const isResolved = comment.status === "resolved" || comment.status === "rejected";
  const floatingReplyRef = useRef<HTMLTextAreaElement>(null);

  const mention = useMention({
    users: mentionableUsers,
    inputRef: floatingReplyRef,
    value: replyText,
    onChange: setReplyText,
  });

  const handleSubmitReply = () => {
    const text = replyText.trim();
    if (!text) return;
    onReply(text);
    setReplyText("");
    mention.setActive(false);
  };

  return (
    <div
      data-doc-floating-pill={comment.id}
      className={[
        "pointer-events-auto rounded-lg border transition-all duration-200 cursor-pointer",
        isActive
          ? "border-blue-300/80 dark:border-blue-600/60 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] shadow-lg ring-1 ring-blue-200/40"
          : "border-gray-200/80 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/60 bg-white/95 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/95 hover:border-blue-200/60 hover:shadow-md",
      ].join(" ")}
      onClick={() => { onSelect(); onScrollTo(); }}
    >
      {/* Card content */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <CommentAvatar author={comment.author} size={24} />
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate">{comment.author.name}</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">{formatTimeAgo(comment.createdAt)}</div>
            </div>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button type="button" onClick={(e) => { e.stopPropagation(); onOpenSidebar(); }}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer" title="Open in sidebar">
              <MessageCircle className="w-3 h-3 text-gray-400" />
            </button>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => setShowActions(!showActions)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer">
                <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {showActions && (
                <div className="absolute right-0 top-full mt-1 w-[120px] rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] shadow-xl py-1 z-20">
                  {isOwner && !isResolved && (
                    <>
                      <button type="button" onClick={() => { onResolve(); setShowActions(false); }}
                        className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer">
                        <CheckCircle2 className="w-3 h-3" /> Resolve
                      </button>
                      <button type="button" onClick={() => { onReject(); setShowActions(false); }}
                        className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20 cursor-pointer">
                        <XCircle className="w-3 h-3" /> Reject
                      </button>
                    </>
                  )}
                  {isResolved && onReopen && (
                    <button type="button" onClick={() => { onReopen(); setShowActions(false); }}
                      className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 cursor-pointer">
                      <Reply className="w-3 h-3" /> Reopen
                    </button>
                  )}
                  <button type="button" onClick={() => { onDelete(); setShowActions(false); }}
                    className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20 cursor-pointer">
                    <X className="w-3 h-3" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected text excerpt */}
        <div className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 mb-2 px-2 py-1 bg-yellow-50/60 dark:bg-yellow-900/15 rounded border-l-2 border-yellow-400 dark:border-yellow-600 line-clamp-2">
          &ldquo;{comment.selectedText}&rdquo;
        </div>

        {/* Comment body */}
        <p className="text-[11px] text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 leading-relaxed">
          {renderMentionPills(comment.text)}
        </p>

        {/* Reply count indicator (collapsed) */}
        {!isActive && comment.replies.length > 0 && (
          <div className="mt-2 flex items-center gap-1 text-[10px] text-blue-500 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
            <CornerDownRight className="w-3 h-3" />
            <span>{comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}</span>
          </div>
        )}
      </div>

      {/* Expanded section -- replies + reply input (only when active) */}
      {isActive && (
        <div className="border-t border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10" onClick={(e) => e.stopPropagation()}>
          {comment.replies.length > 0 && (
            <div className="px-3 pt-2 pb-1 space-y-2 max-h-[160px] overflow-y-auto">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex gap-2">
                  <CommentAvatar author={reply.author} size={20} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">{reply.author.name}</span>
                      <span className="text-[9px] text-gray-400">{formatTimeAgo(reply.createdAt)}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 leading-relaxed">{renderMentionPills(reply.text)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply input with @mention support */}
          <div className="px-3 py-2">
            <div className="relative">
              <textarea
                ref={floatingReplyRef}
                placeholder="Reply... (@ to mention)"
                value={replyText}
                onChange={(e) => mention.handleChange(e.target.value)}
                onKeyDown={(e) => {
                  mention.handleKeyDown(e);
                  if (!mention.active && e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmitReply();
                }}
                className="w-full px-2.5 py-1.5 rounded-lg text-[11px] bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 outline-none focus:ring-1 focus:ring-blue-400 resize-none"
                rows={2}
              />
              {mention.active && (
                <MentionPopover
                  users={mention.filtered}
                  highlightIdx={mention.highlightIdx}
                  onSelect={(u) => mention.insertMention(u)}
                />
              )}
            </div>
            <div className="flex items-center justify-end gap-1.5 mt-1.5">
              <button
                type="button"
                onClick={handleSubmitReply}
                disabled={!replyText.trim()}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-40 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <Send className="w-3 h-3" />
                Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
