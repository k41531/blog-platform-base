"use client";

import type { EditorView } from "@codemirror/view";
import { Bold, Italic, Strikethrough, Code } from "lucide-react";

import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ToolbarButton } from "../toolbar/toolbar-button";
import {
  toggleBold,
  toggleItalic,
  toggleStrikethrough,
  toggleInlineCode,
} from "../extensions/markdown-commands";

type FloatingSelectionToolbarProps = {
  visible: boolean;
  top: number;
  left: number;
  flipped: boolean;
  editorView: EditorView | null;
};

export function FloatingSelectionToolbar({
  visible,
  top,
  left,
  flipped,
  editorView,
}: FloatingSelectionToolbarProps) {
  const run = (fn: (view: EditorView) => boolean | void) => {
    if (!editorView) return;
    fn(editorView);
    editorView.focus();
  };

  return (
    <div
      className={cn(
        "absolute z-10 flex items-center gap-0.5 rounded-md border bg-popover p-1 shadow-md",
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      style={{ top, left }}
      role="toolbar"
      aria-label="テキスト書式"
      onMouseDown={(e) => e.preventDefault()}
    >
      <TooltipProvider>
        <ToolbarButton
          icon={Bold}
          label="太字"
          onClick={() => run(toggleBold)}
        />
        <ToolbarButton
          icon={Italic}
          label="斜体"
          onClick={() => run(toggleItalic)}
        />
        <ToolbarButton
          icon={Strikethrough}
          label="取り消し線"
          onClick={() => run(toggleStrikethrough)}
        />
        <ToolbarButton
          icon={Code}
          label="インラインコード"
          onClick={() => run(toggleInlineCode)}
        />
      </TooltipProvider>
    </div>
  );
}
