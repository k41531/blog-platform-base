"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { RefObject } from "react";
import { EditorView } from "@codemirror/view";
import { StateEffect } from "@codemirror/state";

type FloatingPosition = {
  visible: boolean;
  top: number;
  left: number;
};

export type FloatingUIState = {
  blockMenu: FloatingPosition;
  selectionToolbar: FloatingPosition;
};

const HIDDEN: FloatingPosition = { visible: false, top: 0, left: 0 };

const INITIAL_STATE: FloatingUIState = {
  blockMenu: HIDDEN,
  selectionToolbar: HIDDEN,
};

function computeState(
  view: EditorView,
  container: HTMLDivElement
): FloatingUIState {
  const { from, to } = view.state.selection.main;
  const containerRect = container.getBoundingClientRect();

  // --- Block menu ("+" button) ---
  const cursorLine = view.state.doc.lineAt(from);
  const isCollapsed = from === to;
  const isEmptyLine = cursorLine.text.trim() === "" && isCollapsed;

  let blockMenu: FloatingPosition = HIDDEN;
  if (isEmptyLine) {
    const coords = view.coordsAtPos(cursorLine.from);
    if (coords) {
      blockMenu = {
        visible: true,
        top: coords.top - containerRect.top,
        left: coords.left - containerRect.left,
      };
    }
  }

  // --- Selection toolbar (inline formatting) ---
  let selectionToolbar: FloatingPosition = HIDDEN;
  if (!isCollapsed) {
    const fromCoords = view.coordsAtPos(from);
    const toCoords = view.coordsAtPos(to, -1);
    if (fromCoords && toCoords) {
      const toolbarHeight = 40;
      const gap = 8;
      const toolbarWidth = 160;
      const containerWidth = containerRect.width;

      const centerX =
        (fromCoords.left + toCoords.right) / 2 - containerRect.left;
      const clampedLeft = Math.max(
        0,
        Math.min(centerX - toolbarWidth / 2, containerWidth - toolbarWidth)
      );

      selectionToolbar = {
        visible: true,
        top: Math.max(0, fromCoords.top - containerRect.top - toolbarHeight - gap),
        left: clampedLeft,
      };
    }
  }

  return { blockMenu, selectionToolbar };
}

export function useEditorFloatingUI(
  view: EditorView | null,
  containerRef: RefObject<HTMLDivElement | null>
): FloatingUIState {
  const [state, setState] = useState<FloatingUIState>(INITIAL_STATE);
  const rafRef = useRef<number>(0);
  const installedRef = useRef(false);

  const recalculate = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!view || !containerRef.current) return;
      setState(computeState(view, containerRef.current));
    });
  }, [view, containerRef]);

  // Install CodeMirror update listener + DOM event listeners
  useEffect(() => {
    if (!view) return;

    // Install EditorView.updateListener via appendConfig (one-time)
    if (!installedRef.current) {
      view.dispatch({
        effects: StateEffect.appendConfig.of(
          EditorView.updateListener.of((update) => {
            if (
              update.selectionSet ||
              update.docChanged ||
              update.geometryChanged
            ) {
              recalculate();
            }
          })
        ),
      });
      installedRef.current = true;
    }

    // Scroll listener on CodeMirror's scroll container
    const scrollDOM = view.scrollDOM;
    scrollDOM.addEventListener("scroll", recalculate, { passive: true });

    // ResizeObserver on the wrapper container
    const container = containerRef.current;
    let resizeObserver: ResizeObserver | null = null;
    if (container) {
      resizeObserver = new ResizeObserver(recalculate);
      resizeObserver.observe(container);
    }

    return () => {
      scrollDOM.removeEventListener("scroll", recalculate);
      resizeObserver?.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [view, containerRef, recalculate]);

  // Reset when view is destroyed/recreated
  useEffect(() => {
    if (!view) {
      setState(INITIAL_STATE);
      installedRef.current = false;
    }
  }, [view]);

  return state;
}
