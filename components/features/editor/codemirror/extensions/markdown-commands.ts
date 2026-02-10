import type { EditorView } from "@codemirror/view";

// ─── Inline toggle helpers ─────────────────────────────────────

function toggleWrap(
  view: EditorView,
  marker: string
): boolean {
  const { state } = view;
  const { from, to } = state.selection.main;

  // Nothing selected → insert marker pair and place cursor inside
  if (from === to) {
    view.dispatch({
      changes: { from, insert: `${marker}${marker}` },
      selection: { anchor: from + marker.length },
    });
    return true;
  }

  const selected = state.sliceDoc(from, to);

  // Already wrapped → unwrap
  if (selected.startsWith(marker) && selected.endsWith(marker) && selected.length > marker.length * 2) {
    const inner = selected.slice(marker.length, -marker.length);
    view.dispatch({
      changes: { from, to, insert: inner },
      selection: { anchor: from, head: from + inner.length },
    });
    return true;
  }

  // Check if markers exist just outside the selection
  const beforeStart = from - marker.length;
  const afterEnd = to + marker.length;
  if (
    beforeStart >= 0 &&
    afterEnd <= state.doc.length &&
    state.sliceDoc(beforeStart, from) === marker &&
    state.sliceDoc(to, afterEnd) === marker
  ) {
    view.dispatch({
      changes: [
        { from: beforeStart, to: from, insert: "" },
        { from: to, to: afterEnd, insert: "" },
      ],
      selection: { anchor: beforeStart, head: beforeStart + (to - from) },
    });
    return true;
  }

  // Wrap selection
  view.dispatch({
    changes: { from, to, insert: `${marker}${selected}${marker}` },
    selection: { anchor: from + marker.length, head: to + marker.length },
  });
  return true;
}

// ─── Exported command functions ─────────────────────────────────

export function toggleBold(view: EditorView): boolean {
  return toggleWrap(view, "**");
}

export function toggleItalic(view: EditorView): boolean {
  return toggleWrap(view, "*");
}

export function toggleStrikethrough(view: EditorView): boolean {
  return toggleWrap(view, "~~");
}

export function toggleInlineCode(view: EditorView): boolean {
  return toggleWrap(view, "`");
}

export function toggleHeading(view: EditorView, level: number): boolean {
  const { state } = view;
  const line = state.doc.lineAt(state.selection.main.head);
  const text = line.text;
  const prefix = "#".repeat(level) + " ";

  // Already this heading level → remove
  if (text.startsWith(prefix)) {
    view.dispatch({
      changes: { from: line.from, to: line.from + prefix.length, insert: "" },
      selection: { anchor: line.from },
    });
    return true;
  }

  // Different heading level → replace
  const match = text.match(/^#{1,6}\s/);
  if (match) {
    view.dispatch({
      changes: { from: line.from, to: line.from + match[0].length, insert: prefix },
      selection: { anchor: line.from + prefix.length },
    });
    return true;
  }

  // No heading → add
  view.dispatch({
    changes: { from: line.from, insert: prefix },
    selection: { anchor: line.from + prefix.length },
  });
  return true;
}

export function toggleBlockquote(view: EditorView): boolean {
  const { state } = view;
  const { from, to } = state.selection.main;
  const startLine = state.doc.lineAt(from);
  const endLine = state.doc.lineAt(to);

  const changes: { from: number; to: number; insert: string }[] = [];
  let allQuoted = true;

  for (let i = startLine.number; i <= endLine.number; i++) {
    const line = state.doc.line(i);
    if (!line.text.startsWith("> ")) {
      allQuoted = false;
      break;
    }
  }

  for (let i = startLine.number; i <= endLine.number; i++) {
    const line = state.doc.line(i);
    if (allQuoted) {
      changes.push({ from: line.from, to: line.from + 2, insert: "" });
    } else {
      changes.push({ from: line.from, to: line.from, insert: "> " });
    }
  }

  const changeSet = state.changes(changes);
  view.dispatch({
    changes,
    selection: { anchor: changeSet.mapPos(from, 1), head: changeSet.mapPos(to, 1) },
  });
  return true;
}

export function toggleBulletList(view: EditorView): boolean {
  const { state } = view;
  const { from, to } = state.selection.main;
  const startLine = state.doc.lineAt(from);
  const endLine = state.doc.lineAt(to);

  const changes: { from: number; to: number; insert: string }[] = [];
  let allBulleted = true;

  for (let i = startLine.number; i <= endLine.number; i++) {
    const line = state.doc.line(i);
    if (!line.text.startsWith("- ")) {
      allBulleted = false;
      break;
    }
  }

  for (let i = startLine.number; i <= endLine.number; i++) {
    const line = state.doc.line(i);
    if (allBulleted) {
      changes.push({ from: line.from, to: line.from + 2, insert: "" });
    } else {
      changes.push({ from: line.from, to: line.from, insert: "- " });
    }
  }

  const changeSet = state.changes(changes);
  view.dispatch({
    changes,
    selection: { anchor: changeSet.mapPos(from, 1), head: changeSet.mapPos(to, 1) },
  });
  return true;
}

export function toggleNumberedList(view: EditorView): boolean {
  const { state } = view;
  const { from, to } = state.selection.main;
  const startLine = state.doc.lineAt(from);
  const endLine = state.doc.lineAt(to);

  const changes: { from: number; to: number; insert: string }[] = [];
  let allNumbered = true;

  for (let i = startLine.number; i <= endLine.number; i++) {
    const line = state.doc.line(i);
    if (!/^\d+\.\s/.test(line.text)) {
      allNumbered = false;
      break;
    }
  }

  for (let i = startLine.number; i <= endLine.number; i++) {
    const line = state.doc.line(i);
    if (allNumbered) {
      const match = line.text.match(/^\d+\.\s/);
      if (match) {
        changes.push({ from: line.from, to: line.from + match[0].length, insert: "" });
      }
    } else {
      const num = i - startLine.number + 1;
      changes.push({ from: line.from, to: line.from, insert: `${num}. ` });
    }
  }

  const changeSet = state.changes(changes);
  view.dispatch({
    changes,
    selection: { anchor: changeSet.mapPos(from, 1), head: changeSet.mapPos(to, 1) },
  });
  return true;
}

export function insertCodeBlock(view: EditorView): boolean {
  const { state } = view;
  const { from, to } = state.selection.main;
  const selected = state.sliceDoc(from, to);

  if (selected) {
    view.dispatch({
      changes: { from, to, insert: `\`\`\`\n${selected}\n\`\`\`` },
      selection: { anchor: from + 4, head: from + 4 + selected.length },
    });
  } else {
    view.dispatch({
      changes: { from, insert: "```\n\n```" },
      selection: { anchor: from + 4 },
    });
  }
  return true;
}

export function insertLink(view: EditorView, text: string, url: string): void {
  const { state } = view;
  const { from, to } = state.selection.main;
  const insert = `[${text}](${url})`;

  view.dispatch({
    changes: { from, to, insert },
    selection: { anchor: from + insert.length },
  });
}

export function insertImage(view: EditorView, alt: string, url: string): void {
  const { state } = view;
  const { from, to } = state.selection.main;
  const insert = `![${alt}](${url})`;

  view.dispatch({
    changes: { from, to, insert },
    selection: { anchor: from + insert.length },
  });
}

export function insertHorizontalRule(view: EditorView): boolean {
  const { state } = view;
  const pos = state.selection.main.head;
  const line = state.doc.lineAt(pos);

  // Insert on a new line
  const prefix = line.text.length > 0 ? "\n" : "";
  view.dispatch({
    changes: { from: line.to, insert: `${prefix}---\n` },
    selection: { anchor: line.to + prefix.length + 4 },
  });
  return true;
}

/** Get selected text (for pre-filling dialog inputs) */
export function getSelectedText(view: EditorView): string {
  const { from, to } = view.state.selection.main;
  return view.state.sliceDoc(from, to);
}
