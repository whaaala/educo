"use client";

import React from "react";
import { EditorMenuBar, type EditorMenuItem, MENU_DIVIDER as D } from "@/components/shared/EditorMenus";
import type { ViewMenuConfig } from "@/components/shared/EditorViewMenu";
import type { InsertMenuConfig } from "@/components/shared/EditorInsertMenu";
import { defaultImageItems, defaultShapeItems, defaultDiagramItems, defaultChartItems, defaultLineItems } from "@/components/shared/EditorInsertMenu";

import {
  FilePlus, FolderOpen, Upload, Copy, Share2, Download, Printer,
  FileText, Trash2, Settings,
  Search, PencilLine, MessageSquare, Eye, Play, Wand2, LayoutGrid,
  Ruler, Compass, Magnet, Monitor, ZoomIn, Maximize, Image, Shapes, Table2,
  GitBranch, BarChart3, Minus, Type, Sparkles, MessageCircle, PlusSquare,
  Bold, Italic, Underline, Strikethrough, Superscript, Subscript, CaseSensitive,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, IndentIncrease, IndentDecrease,
  List, ListOrdered, CheckSquare, Square, Palette,
  Plus, CopyPlus, EyeOff, MoveVertical, PaintBucket, Layout, Layers, Brush,
  ArrowUpToLine, ArrowUp, ArrowDown, ArrowDownToLine,
  AlignHorizontalDistributeCenter, AlignVerticalDistributeCenter,
  RotateCw, FlipHorizontal2, FlipVertical2, Group, Ungroup,
  SpellCheck, Book, Link2, Mic, Accessibility,
  Keyboard, GraduationCap, Bell, Presentation, CircleDot, ArrowRight,
  PenTool, Hexagon, SlidersHorizontal, X as XIcon,
} from "lucide-react";

interface SlideMenuBarProps {
  onAction: (action: string, payload?: unknown) => void;
  isStarred?: boolean;
  currentFolder?: string;
  /** Current editing mode */
  editingMode?: "editing" | "suggesting" | "viewing";
  /** Current zoom level */
  zoom?: number;
  /** Whether filmstrip sidebar is visible */
  showFilmstrip?: boolean;
  /** Whether rulers are visible */
  showRuler?: boolean;
  /** Whether guides are visible */
  showGuides?: boolean;
  /** Whether snap-to-grid is on */
  snapToGrid?: boolean;
  /** Whether snap-to-guides is on */
  snapToGuides?: boolean;
  /** Whether fullscreen is active */
  isFullscreen?: boolean;
}

export default function SlideMenuBar({
  onAction, isStarred = false, currentFolder = "Presentations",
  editingMode = "editing", zoom = 100, showFilmstrip = true,
  showRuler = true, showGuides = false, snapToGrid = false,
  snapToGuides = false, isFullscreen = false,
}: SlideMenuBarProps) {
  const act = (action: string) => () => onAction(action);

  const fileMenuConfig = {
    onAction,
    isStarred,
    currentFolder,
    workspace: {
      newMenu: {
        items: [
          { label: "Presentation", icon: Presentation, onClick: act("file:new") },
          { label: "From template gallery", icon: LayoutGrid, onClick: act("file:newFromTemplate") },
        ],
      },
      importItem: { label: "Import slides", icon: Upload, onClick: act("file:import") },
      copyMenu: [
        { label: "Entire presentation", icon: Copy, onClick: act("file:copyAll") },
        { label: "Selected slides", icon: CopyPlus, onClick: act("file:copySelected") },
      ],
      showConvertToVideo: true,
      languageLabel: "Slide language",
      showPageSetup: true,
    },
  };

  const editMenuConfig = {
    onAction,
    showDuplicate: true,
    hasContent: true, // Canvas objects always count as "content"
  };

  const viewMenuConfig: ViewMenuConfig = {
    mode: {
      current: editingMode,
      options: [
        { label: "Editing", icon: PencilLine, value: "editing", description: "Edit the presentation directly" },
        { label: "Suggesting", icon: MessageSquare, value: "suggesting", description: "Edits become suggestions" },
        { label: "Viewing", icon: Eye, value: "viewing", description: "Read or present the final slides" },
      ],
      onSelect: (value) => onAction(`view:mode${value.charAt(0).toUpperCase() + value.slice(1)}`),
    },
    sections: [
      // Section 1: Presentation actions
      [
        { type: "action", label: "Slideshow", icon: Play, shortcut: "Ctrl+F5", onClick: act("view:slideshow") },
        { type: "action", label: "Motion", icon: Wand2, onClick: act("view:motion") },
        { type: "action", label: "Theme builder", icon: Brush, onClick: act("view:themeBuilder") },
        { type: "action", label: "Grid view", icon: LayoutGrid, shortcut: "Ctrl+Alt+1", onClick: act("view:gridView") },
      ],
      // Section 2: Ruler, Guides, Snap to
      [
        { type: "toggle", label: "Show ruler", isOn: showRuler, onToggle: act("view:ruler") },
        { type: "submenu", label: "Guides", icon: Compass, items: [
          { label: "Show guides", icon: Compass, onClick: act("view:showGuides"), isChecked: showGuides },
          { label: "Add vertical guide", icon: SlidersHorizontal, onClick: act("view:addVGuide") },
          { label: "Add horizontal guide", icon: Minus, onClick: act("view:addHGuide") },
          { label: "Edit guides", icon: PencilLine, onClick: act("view:editGuides") },
          { label: "Clear guides", icon: XIcon, onClick: act("view:clearGuides") },
        ]},
        { type: "submenu", label: "Snap to", icon: Magnet, items: [
          { label: "Grid", icon: LayoutGrid, onClick: act("view:snapGrid"), isChecked: snapToGrid },
          { label: "Guides", icon: Compass, onClick: act("view:snapGuides"), isChecked: snapToGuides },
        ]},
      ],
      // Section 3: Filmstrip
      [
        { type: "toggle", label: "Show filmstrip", isOn: showFilmstrip, onToggle: act("view:filmstrip") },
      ],
    ],
    zoom: {
      current: zoom,
      levels: [50, 75, 100, 150, 200],
      showFit: true,
      onFit: act("view:zoomFit"),
      onChange: (level) => onAction(`view:zoom${level}`),
    },
    fullscreen: {
      isActive: isFullscreen,
      onToggle: act("view:fullscreen"),
    },
  };

  const insertMenuConfig: InsertMenuConfig = {
    onAction,
    imageItems: defaultImageItems(act),
    shapeItems: defaultShapeItems(act),
    showTable: true,
    diagramItems: defaultDiagramItems(act),
    chartItems: defaultChartItems(act),
    showAudioVideo: true,
    showTextBox: true,
    showWordArt: true,
    lineItems: defaultLineItems(act),
    showComment: true,
    showNewSlide: true,
    showLink: true, // Insert → Link (Ctrl+K), same as Google Slides
  };

  const formatMenu: EditorMenuItem[] = [
    { label: "Text", icon: Type, submenu: [
      { label: "Bold", icon: Bold, shortcut: "Ctrl+B", onClick: act("format:bold") },
      { label: "Italic", icon: Italic, shortcut: "Ctrl+I", onClick: act("format:italic") },
      { label: "Underline", icon: Underline, shortcut: "Ctrl+U", onClick: act("format:underline") },
      { label: "Strikethrough", icon: Strikethrough, shortcut: "Alt+Shift+5", onClick: act("format:strikethrough") },
      { label: "Superscript", icon: Superscript, onClick: act("format:superscript") },
      { label: "Subscript", icon: Subscript, onClick: act("format:subscript") },
      D,
      { label: "Increase font size", icon: CaseSensitive, onClick: act("format:sizeUp") },
      { label: "Decrease font size", icon: CaseSensitive, onClick: act("format:sizeDown") },
      D,
      { label: "UPPERCASE", icon: CaseSensitive, onClick: act("format:uppercase") },
      { label: "lowercase", icon: CaseSensitive, onClick: act("format:lowercase") },
      { label: "Title Case", icon: CaseSensitive, onClick: act("format:titleCase") },
    ]},
    { label: "Align & indent", icon: AlignLeft, submenu: [
      { label: "Left", icon: AlignLeft, onClick: act("format:alignLeft") },
      { label: "Center", icon: AlignCenter, onClick: act("format:alignCenter") },
      { label: "Right", icon: AlignRight, onClick: act("format:alignRight") },
      { label: "Justify", icon: AlignJustify, onClick: act("format:alignJustify") },
      D,
      { label: "Increase indent", icon: IndentIncrease, onClick: act("format:indentMore") },
      { label: "Decrease indent", icon: IndentDecrease, onClick: act("format:indentLess") },
      D,
      { label: "Line spacing", icon: SlidersHorizontal, submenu: [
        { label: "Single", onClick: act("format:spacingSingle") },
        { label: "1.15", onClick: act("format:spacing115") },
        { label: "1.5", onClick: act("format:spacing15") },
        { label: "Double", onClick: act("format:spacingDouble") },
        { label: "Custom", onClick: act("format:spacingCustom") },
      ]},
    ]},
    { label: "Lists", icon: List, submenu: [
      { label: "Numbered list", icon: ListOrdered, onClick: act("format:numberedList") },
      { label: "Bulleted list", icon: List, onClick: act("format:bulletedList") },
      { label: "Checklist", icon: CheckSquare, onClick: act("format:checklist") },
    ]},
    { label: "Borders & lines", icon: Square, submenu: [
      { label: "Border weight", icon: SlidersHorizontal, onClick: act("format:borderWeight") },
      { label: "Border dash", icon: Minus, onClick: act("format:borderDash") },
      { label: "Border color", icon: Palette, onClick: act("format:borderColor") },
    ]},
    D,
    { label: "Format options", icon: Settings, onClick: act("format:options") },
    { label: "Clear formatting", icon: XIcon, shortcut: "Ctrl+\\", onClick: act("format:clear") },
  ];

  const slideMenu: EditorMenuItem[] = [
    { label: "New slide", icon: Plus, shortcut: "Ctrl+M", onClick: act("slide:new") },
    { label: "Duplicate slide", icon: CopyPlus, onClick: act("slide:duplicate") },
    { label: "Delete slide", icon: Trash2, onClick: act("slide:delete") },
    { label: "Skip slide", icon: EyeOff, onClick: act("slide:skip") },
    D,
    { label: "Move slide", icon: MoveVertical, submenu: [
      { label: "Move to beginning", icon: ArrowUpToLine, onClick: act("slide:moveStart") },
      { label: "Move up", icon: ArrowUp, onClick: act("slide:moveUp") },
      { label: "Move down", icon: ArrowDown, onClick: act("slide:moveDown") },
      { label: "Move to end", icon: ArrowDownToLine, onClick: act("slide:moveEnd") },
    ]},
    D,
    { label: "Change background", icon: PaintBucket, onClick: act("slide:background") },
    { label: "Apply layout", icon: Layout, submenu: [
      { label: "Title Slide", icon: Type, onClick: act("slide:layoutTitle") },
      { label: "Section Header", icon: Minus, onClick: act("slide:layoutSection") },
      { label: "Title and Body", icon: FileText, onClick: act("slide:layoutTitleBody") },
      { label: "Two Columns", icon: LayoutGrid, onClick: act("slide:layoutTwoCol") },
      { label: "Blank", icon: Square, onClick: act("slide:layoutBlank") },
    ]},
    { label: "Transitions", icon: Wand2, onClick: act("slide:transitions") },
    { label: "Edit theme", icon: Brush, onClick: act("slide:editTheme") },
  ];

  const arrangeMenu: EditorMenuItem[] = [
    { label: "Order", icon: Layers, submenu: [
      { label: "Bring to front", icon: ArrowUpToLine, shortcut: "Ctrl+Shift+↑", onClick: act("arrange:bringFront") },
      { label: "Bring forward", icon: ArrowUp, shortcut: "Ctrl+↑", onClick: act("arrange:bringForward") },
      { label: "Send backward", icon: ArrowDown, shortcut: "Ctrl+↓", onClick: act("arrange:sendBackward") },
      { label: "Send to back", icon: ArrowDownToLine, shortcut: "Ctrl+Shift+↓", onClick: act("arrange:sendBack") },
    ]},
    D,
    { label: "Align", icon: AlignLeft, submenu: [
      { label: "Left", icon: AlignLeft, onClick: act("arrange:alignLeft") },
      { label: "Center", icon: AlignCenter, onClick: act("arrange:alignCenter") },
      { label: "Right", icon: AlignRight, onClick: act("arrange:alignRight") },
      { label: "Top", icon: ArrowUpToLine, onClick: act("arrange:alignTop") },
      { label: "Middle", icon: AlignCenter, onClick: act("arrange:alignMiddle") },
      { label: "Bottom", icon: ArrowDownToLine, onClick: act("arrange:alignBottom") },
    ]},
    { label: "Distribute", icon: AlignHorizontalDistributeCenter, submenu: [
      { label: "Horizontally", icon: AlignHorizontalDistributeCenter, onClick: act("arrange:distributeH") },
      { label: "Vertically", icon: AlignVerticalDistributeCenter, onClick: act("arrange:distributeV") },
    ]},
    { label: "Center on page", icon: Maximize, submenu: [
      { label: "Horizontally", icon: AlignCenter, onClick: act("arrange:centerH") },
      { label: "Vertically", icon: AlignCenter, onClick: act("arrange:centerV") },
    ]},
    D,
    { label: "Rotate", icon: RotateCw, submenu: [
      { label: "Rotate clockwise 90°", icon: RotateCw, onClick: act("arrange:rotateCW") },
      { label: "Rotate counter-clockwise 90°", icon: RotateCw, onClick: act("arrange:rotateCCW") },
      { label: "Flip horizontally", icon: FlipHorizontal2, onClick: act("arrange:flipH") },
      { label: "Flip vertically", icon: FlipVertical2, onClick: act("arrange:flipV") },
    ]},
    D,
    { label: "Group", icon: Group, shortcut: "Ctrl+G", onClick: act("arrange:group") },
    { label: "Ungroup", icon: Ungroup, shortcut: "Ctrl+Alt+G", onClick: act("arrange:ungroup") },
  ];

  const toolsMenu: EditorMenuItem[] = [
    { label: "Spelling", icon: SpellCheck, submenu: [
      { label: "Spell check", icon: SpellCheck, onClick: act("tools:spellCheck") },
      { label: "Personal dictionary", icon: Book, onClick: act("tools:dictionary") },
    ]},
    { label: "Explore", icon: Search, shortcut: "Ctrl+Alt+Shift+I", onClick: act("tools:explore") },
    { label: "Linked objects", icon: Link2, onClick: act("tools:linkedObjects") },
    { label: "Dictionary", icon: Book, shortcut: "Ctrl+Shift+Y", onClick: act("tools:dictionaryLookup") },
    D,
    { label: "Voice type speaker notes", icon: Mic, shortcut: "Ctrl+Shift+S", onClick: act("tools:voiceType") },
    { label: "Accessibility settings", icon: Accessibility, onClick: act("tools:accessibility") },
  ];

  const helpMenu: EditorMenuItem[] = [
    { label: "Search the menus", icon: Search, shortcut: "Alt+/", onClick: act("help:search") },
    { label: "Keyboard shortcuts", icon: Keyboard, onClick: act("help:shortcuts") },
    D,
    { label: "Training", icon: GraduationCap, onClick: act("help:training") },
    { label: "Updates", icon: Bell, onClick: act("help:updates") },
  ];

  return (
    <EditorMenuBar
      fileMenuConfig={fileMenuConfig}
      editMenuConfig={editMenuConfig}
      viewMenuConfig={viewMenuConfig}
      insertMenuConfig={insertMenuConfig}
      menus={[
        { id: "file", label: "File", items: [] },
        { id: "edit", label: "Edit", items: [] },
        { id: "view", label: "View", items: [] },
        { id: "insert", label: "Insert", items: [] },
        { id: "format", label: "Format", items: formatMenu },
        { id: "slide", label: "Slide", items: slideMenu },
        { id: "arrange", label: "Arrange", items: arrangeMenu },
        { id: "tools", label: "Tools", items: toolsMenu },
        { id: "help", label: "Help", items: helpMenu },
      ]}
    />
  );
}
