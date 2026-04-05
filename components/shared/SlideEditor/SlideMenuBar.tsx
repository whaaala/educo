"use client";

import React from "react";
import { EditorMenuBar, type EditorMenuItem, MENU_DIVIDER as D } from "@/components/shared/EditorMenus";
import { type FileMenuConfig, EditorFileMenuPanel } from "@/components/shared/EditorFileMenu";
import {
  FilePlus, FolderOpen, Upload, Copy, Share2, Download, Printer,
  FileText, Trash2, Settings, Undo2, Redo2, Scissors, Clipboard, ClipboardPaste,
  MousePointer2, Search, PencilLine, MessageSquare, Eye, Play, Wand2, LayoutGrid,
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
}

export default function SlideMenuBar({ onAction, isStarred = false, currentFolder = "Presentations" }: SlideMenuBarProps) {
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

  const editMenu: EditorMenuItem[] = [
    { label: "Undo", icon: Undo2, shortcut: "Ctrl+Z", onClick: act("edit:undo") },
    { label: "Redo", icon: Redo2, shortcut: "Ctrl+Y", onClick: act("edit:redo") },
    D,
    { label: "Cut", icon: Scissors, shortcut: "Ctrl+X", onClick: act("edit:cut") },
    { label: "Copy", icon: Copy, shortcut: "Ctrl+C", onClick: act("edit:copy") },
    { label: "Paste", icon: Clipboard, shortcut: "Ctrl+V", onClick: act("edit:paste") },
    { label: "Paste without formatting", icon: ClipboardPaste, shortcut: "Ctrl+Shift+V", onClick: act("edit:pasteNoFormat") },
    D,
    { label: "Select all", icon: MousePointer2, shortcut: "Ctrl+A", onClick: act("edit:selectAll") },
    { label: "Delete", icon: Trash2, onClick: act("edit:delete") },
    { label: "Duplicate", icon: CopyPlus, shortcut: "Ctrl+D", onClick: act("edit:duplicate") },
    D,
    { label: "Find and replace", icon: Search, shortcut: "Ctrl+H", onClick: act("edit:findReplace") },
  ];

  const viewMenu: EditorMenuItem[] = [
    { label: "Mode", icon: PencilLine, submenu: [
      { label: "Editing", icon: PencilLine, onClick: act("view:modeEditing") },
      { label: "Commenting", icon: MessageSquare, onClick: act("view:modeCommenting") },
      { label: "Viewing", icon: Eye, onClick: act("view:modeViewing") },
    ]},
    D,
    { label: "Slideshow", icon: Play, shortcut: "Ctrl+F5", onClick: act("view:slideshow") },
    { label: "Motion", icon: Wand2, onClick: act("view:motion") },
    { label: "Theme builder", icon: Brush, onClick: act("view:themeBuilder") },
    { label: "Grid view", icon: LayoutGrid, shortcut: "Ctrl+Alt+1", onClick: act("view:gridView") },
    D,
    { label: "Show ruler", icon: Ruler, onClick: act("view:ruler") },
    { label: "Guides", icon: Compass, submenu: [
      { label: "Show guides", icon: Compass, onClick: act("view:showGuides") },
      { label: "Add vertical guide", icon: SlidersHorizontal, onClick: act("view:addVGuide") },
      { label: "Add horizontal guide", icon: Minus, onClick: act("view:addHGuide") },
      { label: "Edit guides", icon: PencilLine, onClick: act("view:editGuides") },
      { label: "Clear guides", icon: XIcon, onClick: act("view:clearGuides") },
    ]},
    { label: "Snap to", icon: Magnet, submenu: [
      { label: "Grid", icon: LayoutGrid, onClick: act("view:snapGrid") },
      { label: "Guides", icon: Compass, onClick: act("view:snapGuides") },
    ]},
    D,
    { label: "Show filmstrip", icon: Monitor, onClick: act("view:filmstrip") },
    { label: "Zoom", icon: ZoomIn, submenu: [
      { label: "Fit", icon: Maximize, onClick: act("view:zoomFit") },
      { label: "50%", onClick: act("view:zoom50") },
      { label: "75%", onClick: act("view:zoom75") },
      { label: "100%", onClick: act("view:zoom100") },
      { label: "150%", onClick: act("view:zoom150") },
      { label: "200%", onClick: act("view:zoom200") },
    ]},
    { label: "Full screen", icon: Maximize, onClick: act("view:fullscreen") },
  ];

  const insertMenu: EditorMenuItem[] = [
    { label: "Image", icon: Image, submenu: [
      { label: "Upload from computer", icon: Upload, onClick: act("insert:imageUpload") },
      { label: "Search the web", icon: Search, onClick: act("insert:imageWeb") },
      { label: "Drive", icon: FolderOpen, onClick: act("insert:imageDrive") },
      { label: "Camera", icon: CircleDot, onClick: act("insert:imageCamera") },
      { label: "By URL", icon: Link2, onClick: act("insert:imageUrl") },
    ]},
    { label: "Shape", icon: Shapes, submenu: [
      { label: "Shapes", icon: Square, onClick: act("insert:shapeBasic") },
      { label: "Arrows", icon: ArrowRight, onClick: act("insert:shapeArrow") },
      { label: "Callouts", icon: MessageSquare, onClick: act("insert:shapeCallout") },
      { label: "Equation", icon: Sparkles, onClick: act("insert:shapeEquation") },
    ]},
    { label: "Table", icon: Table2, onClick: act("insert:table") },
    { label: "Diagram", icon: GitBranch, submenu: [
      { label: "Grid", icon: LayoutGrid, onClick: act("insert:diagramGrid") },
      { label: "Hierarchy", icon: GitBranch, onClick: act("insert:diagramHierarchy") },
      { label: "Timeline", icon: Minus, onClick: act("insert:diagramTimeline") },
      { label: "Process", icon: ArrowRight, onClick: act("insert:diagramProcess") },
      { label: "Relationship", icon: Link2, onClick: act("insert:diagramRelationship") },
      { label: "Cycle", icon: RotateCw, onClick: act("insert:diagramCycle") },
    ]},
    { label: "Chart", icon: BarChart3, submenu: [
      { label: "Bar", icon: BarChart3, onClick: act("insert:chartBar") },
      { label: "Column", icon: BarChart3, onClick: act("insert:chartColumn") },
      { label: "Line", icon: Minus, onClick: act("insert:chartLine") },
      { label: "Pie", icon: CircleDot, onClick: act("insert:chartPie") },
    ]},
    D,
    { label: "Text box", icon: Type, onClick: act("insert:textBox") },
    { label: "Word art", icon: Sparkles, onClick: act("insert:wordArt") },
    { label: "Line", icon: Minus, submenu: [
      { label: "Line", icon: Minus, onClick: act("insert:line") },
      { label: "Arrow", icon: ArrowRight, onClick: act("insert:arrow") },
      { label: "Elbow connector", icon: PenTool, onClick: act("insert:elbowConnector") },
      { label: "Curved connector", icon: PenTool, onClick: act("insert:curvedConnector") },
      { label: "Curve", icon: PenTool, onClick: act("insert:curve") },
      { label: "Polyline", icon: Hexagon, onClick: act("insert:polyline") },
      { label: "Scribble", icon: PencilLine, onClick: act("insert:scribble") },
    ]},
    D,
    { label: "Comment", icon: MessageCircle, shortcut: "Ctrl+Alt+M", onClick: act("insert:comment") },
    { label: "New slide", icon: PlusSquare, shortcut: "Ctrl+M", onClick: act("insert:newSlide") },
  ];

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
      menus={[
        { id: "file", label: "File", items: [] },
        { id: "edit", label: "Edit", items: editMenu },
        { id: "view", label: "View", items: viewMenu },
        { id: "insert", label: "Insert", items: insertMenu },
        { id: "format", label: "Format", items: formatMenu },
        { id: "slide", label: "Slide", items: slideMenu },
        { id: "arrange", label: "Arrange", items: arrangeMenu },
        { id: "tools", label: "Tools", items: toolsMenu },
        { id: "help", label: "Help", items: helpMenu },
      ]}
    />
  );
}
