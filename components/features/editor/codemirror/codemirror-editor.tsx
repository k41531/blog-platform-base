"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { createExtensions } from "./extensions";
import { EditorToolbar } from "./toolbar/editor-toolbar";
import { LinkDialog } from "./dialogs/link-dialog";
import { ImageDialog } from "./dialogs/image-dialog";
import {
  insertLink,
  insertImage,
  getSelectedText,
} from "./extensions/markdown-commands";

type CodeMirrorEditorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function CodeMirrorEditor({
  value,
  onChange,
  disabled = false,
  placeholder = "Markdownで記事を書く...",
}: CodeMirrorEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const readOnlyCompartment = useRef(new Compartment());

  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  // Keep callback ref up to date without re-creating extensions
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const stableOnChange = useCallback((val: string) => {
    onChangeRef.current(val);
  }, []);

  // Create EditorView once
  useEffect(() => {
    if (!containerRef.current) return;

    const extensions = createExtensions({
      onChange: stableOnChange,
      placeholder,
    });

    const state = EditorState.create({
      doc: value,
      extensions: [
        extensions,
        readOnlyCompartment.current.of(EditorState.readOnly.of(disabled)),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;
    setEditorView(view);

    return () => {
      view.destroy();
      viewRef.current = null;
      setEditorView(null);
    };
    // Only run on mount — value sync handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes (e.g., initial load, reset)
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const currentDoc = view.state.doc.toString();
    if (currentDoc !== value) {
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: value },
      });
    }
  }, [value]);

  // Sync disabled state
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    view.dispatch({
      effects: readOnlyCompartment.current.reconfigure(
        EditorState.readOnly.of(disabled)
      ),
    });
  }, [disabled]);

  const handleLinkClick = useCallback(() => {
    if (viewRef.current) {
      setSelectedText(getSelectedText(viewRef.current));
    }
    setLinkDialogOpen(true);
  }, []);

  const handleImageClick = useCallback(() => {
    setImageDialogOpen(true);
  }, []);

  const handleLinkInsert = useCallback((text: string, url: string) => {
    if (viewRef.current) {
      insertLink(viewRef.current, text, url);
      viewRef.current.focus();
    }
  }, []);

  const handleImageInsert = useCallback((alt: string, url: string) => {
    if (viewRef.current) {
      insertImage(viewRef.current, alt, url);
      viewRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col">
      <EditorToolbar
        editorView={editorView}
        disabled={disabled}
        onLinkClick={handleLinkClick}
        onImageClick={handleImageClick}
      />
      <div
        ref={containerRef}
        className="min-h-[400px] w-full [&_.cm-editor]:h-full"
      />
      <LinkDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        onInsert={handleLinkInsert}
        initialText={selectedText}
      />
      <ImageDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        onInsert={handleImageInsert}
      />
    </div>
  );
}
