"use client";

import type { EditorView } from "@codemirror/view";
import {
  Plus,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  SquareCode,
  Link,
  ImageIcon,
  Minus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  toggleHeading,
  toggleBulletList,
  toggleNumberedList,
  toggleBlockquote,
  insertCodeBlock,
  insertHorizontalRule,
} from "../extensions/markdown-commands";

type FloatingBlockMenuProps = {
  visible: boolean;
  top: number;
  left: number;
  editorView: EditorView | null;
  onLinkClick: () => void;
  onImageClick: () => void;
};

export function FloatingBlockMenu({
  visible,
  top,
  left,
  editorView,
  onLinkClick,
  onImageClick,
}: FloatingBlockMenuProps) {
  const run = (fn: (view: EditorView) => boolean | void) => {
    if (!editorView) return;
    fn(editorView);
  };

  return (
    <div
      className={cn(
        "absolute z-10 transition-all duration-150",
        visible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      )}
      style={{ top, left: left - 32 }}
    >
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            aria-label="ブロックを追加"
            onMouseDown={(e) => e.preventDefault()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="start"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            editorView?.focus();
          }}
        >
          <DropdownMenuItem onSelect={() => run((v) => toggleHeading(v, 1))}>
            <Heading1 className="h-4 w-4" />
            <span>見出し1</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => run((v) => toggleHeading(v, 2))}>
            <Heading2 className="h-4 w-4" />
            <span>見出し2</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => run((v) => toggleHeading(v, 3))}>
            <Heading3 className="h-4 w-4" />
            <span>見出し3</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => run(toggleBulletList)}>
            <List className="h-4 w-4" />
            <span>箇条書きリスト</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => run(toggleNumberedList)}>
            <ListOrdered className="h-4 w-4" />
            <span>番号付きリスト</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => run(toggleBlockquote)}>
            <Quote className="h-4 w-4" />
            <span>引用</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => run(insertCodeBlock)}>
            <SquareCode className="h-4 w-4" />
            <span>コードブロック</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              onLinkClick();
            }}
          >
            <Link className="h-4 w-4" />
            <span>リンク</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              onImageClick();
            }}
          >
            <ImageIcon className="h-4 w-4" />
            <span>画像</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => run(insertHorizontalRule)}>
            <Minus className="h-4 w-4" />
            <span>水平線</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
