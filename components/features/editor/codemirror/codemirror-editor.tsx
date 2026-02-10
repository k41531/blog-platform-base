"use client";

import { useRef, useEffect, useCallback } from "react";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { createExtensions } from "./extensions";

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

    return () => {
      view.destroy();
      viewRef.current = null;
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

  return (
    <div
      ref={containerRef}
      className="min-h-[400px] w-full [&_.cm-editor]:h-full"
    />
  );
}
