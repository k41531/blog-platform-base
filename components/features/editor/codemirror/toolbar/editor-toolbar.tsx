"use client";

import type { EditorView } from "@codemirror/view";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  SquareCode,
  Link,
  Image,
  Minus,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";

import {
  toggleBold,
  toggleItalic,
  toggleStrikethrough,
  toggleInlineCode,
  toggleHeading,
  toggleBlockquote,
  toggleBulletList,
  toggleNumberedList,
  insertCodeBlock,
  insertHorizontalRule,
} from "../extensions/markdown-commands";
import { ToolbarButton } from "./toolbar-button";

type EditorToolbarProps = {
  editorView: EditorView | null;
  disabled?: boolean;
  onLinkClick: () => void;
  onImageClick: () => void;
};

export function EditorToolbar({
  editorView,
  disabled = false,
  onLinkClick,
  onImageClick,
}: EditorToolbarProps) {
  const isDisabled = disabled || !editorView;

  const run = (fn: (view: EditorView) => boolean | void) => {
    if (!editorView) return;
    fn(editorView);
    editorView.focus();
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-0.5 border-b px-2 py-1">
        {/* Group 1: Inline formatting */}
        <ToolbarButton
          icon={Bold}
          label="太字"
          onClick={() => run(toggleBold)}
          disabled={isDisabled}
        />
        <ToolbarButton
          icon={Italic}
          label="斜体"
          onClick={() => run(toggleItalic)}
          disabled={isDisabled}
        />
        <ToolbarButton
          icon={Strikethrough}
          label="取り消し線"
          onClick={() => run(toggleStrikethrough)}
          disabled={isDisabled}
        />
        <ToolbarButton
          icon={Code}
          label="インラインコード"
          onClick={() => run(toggleInlineCode)}
          disabled={isDisabled}
        />

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Group 2: Headings */}
        <ToolbarButton
          icon={Heading1}
          label="見出し1"
          onClick={() => run((v) => toggleHeading(v, 1))}
          disabled={isDisabled}
        />
        <ToolbarButton
          icon={Heading2}
          label="見出し2"
          onClick={() => run((v) => toggleHeading(v, 2))}
          disabled={isDisabled}
        />
        <ToolbarButton
          icon={Heading3}
          label="見出し3"
          onClick={() => run((v) => toggleHeading(v, 3))}
          disabled={isDisabled}
        />

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Group 3: Lists & Blockquote */}
        <ToolbarButton
          icon={List}
          label="箇条書きリスト"
          onClick={() => run(toggleBulletList)}
          disabled={isDisabled}
        />
        <ToolbarButton
          icon={ListOrdered}
          label="番号付きリスト"
          onClick={() => run(toggleNumberedList)}
          disabled={isDisabled}
        />
        <ToolbarButton
          icon={Quote}
          label="引用"
          onClick={() => run(toggleBlockquote)}
          disabled={isDisabled}
        />

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Group 4: Blocks & Media */}
        <ToolbarButton
          icon={SquareCode}
          label="コードブロック"
          onClick={() => run(insertCodeBlock)}
          disabled={isDisabled}
        />
        <ToolbarButton
          icon={Link}
          label="リンク"
          onClick={onLinkClick}
          disabled={isDisabled}
        />
        <ToolbarButton
          icon={Image}
          label="画像"
          onClick={onImageClick}
          disabled={isDisabled}
        />
        <ToolbarButton
          icon={Minus}
          label="水平線"
          onClick={() => run(insertHorizontalRule)}
          disabled={isDisabled}
        />
      </div>
    </TooltipProvider>
  );
}
