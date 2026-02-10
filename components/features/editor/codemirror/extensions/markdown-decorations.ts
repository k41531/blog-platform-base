import {
  ViewPlugin,
  Decoration,
  DecorationSet,
  EditorView,
  ViewUpdate,
} from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder, EditorState } from "@codemirror/state";

import { ImageWidget, HRWidget, BulletWidget } from "./markdown-widgets";

type DecorationEntry = {
  from: number;
  to: number;
  deco: Decoration;
};

/**
 * Check whether a given line number is the cursor line.
 * Supports multiple selections / cursors.
 */
function isCursorLine(state: EditorState, lineNumber: number): boolean {
  for (const range of state.selection.ranges) {
    const headLine = state.doc.lineAt(range.head).number;
    if (headLine === lineNumber) return true;
    // If the selection spans multiple lines, treat all of them as cursor lines
    if (!range.empty) {
      const anchorLine = state.doc.lineAt(range.anchor).number;
      const minLine = Math.min(headLine, anchorLine);
      const maxLine = Math.max(headLine, anchorLine);
      if (lineNumber >= minLine && lineNumber <= maxLine) return true;
    }
  }
  return false;
}

/**
 * Build decorations for the visible ranges, hiding Markdown syntax
 * on lines where the cursor is NOT present.
 */
function buildDecorations(view: EditorView): DecorationSet {
  const state = view.state;
  const tree = syntaxTree(state);
  const decorations: DecorationEntry[] = [];

  for (const { from, to } of view.visibleRanges) {
    tree.iterate({
      from,
      to,
      enter(node) {
        // Determine the line of this node
        const nodeLineFrom = state.doc.lineAt(node.from).number;

        switch (node.name) {
          // ── Headings ─────────────────────────────────────
          case "HeaderMark": {
            if (isCursorLine(state, nodeLineFrom)) break;
            // The HeaderMark covers the "#" chars; include the trailing space
            const endWithSpace = Math.min(node.to + 1, state.doc.length);
            // Verify the character after the mark is actually a space
            const charAfter = state.sliceDoc(node.to, endWithSpace);
            const end = charAfter === " " ? endWithSpace : node.to;
            decorations.push({
              from: node.from,
              to: end,
              deco: Decoration.replace({}),
            });
            break;
          }

          // ── Emphasis / StrongEmphasis / Strikethrough markers ─
          case "EmphasisMark":
          case "StrikethroughMark": {
            if (isCursorLine(state, nodeLineFrom)) break;
            decorations.push({
              from: node.from,
              to: node.to,
              deco: Decoration.replace({}),
            });
            break;
          }

          // ── Inline code backtick markers ─────────────────
          case "CodeMark": {
            if (isCursorLine(state, nodeLineFrom)) break;
            // CodeMark appears inside both InlineCode and FencedCode.
            // For FencedCode, the entire opening/closing fence line is handled
            // below via the FencedCode case. Here we handle InlineCode only.
            const parent = node.node.parent;
            if (parent && parent.name === "InlineCode") {
              decorations.push({
                from: node.from,
                to: node.to,
                deco: Decoration.replace({}),
              });
            }
            break;
          }

          // ── Images ───────────────────────────────────────
          case "Image": {
            if (isCursorLine(state, nodeLineFrom)) break;
            const text = state.sliceDoc(node.from, node.to);
            const match = text.match(/^!\[([^\]]*)\]\(([^)]*)\)$/);
            if (match) {
              decorations.push({
                from: node.from,
                to: node.to,
                deco: Decoration.replace({
                  widget: new ImageWidget(match[2], match[1]),
                }),
              });
            }
            break;
          }

          // ── Links ────────────────────────────────────────
          case "Link": {
            if (isCursorLine(state, nodeLineFrom)) break;
            // Structure: LinkMark("[") LinkLabel LinkMark("]") LinkMark("(") URL LinkMark(")")
            // We want to: hide "[", hide "](url)", keep the visible text, add underline
            const linkNode = node.node;
            const children: { name: string; from: number; to: number }[] = [];
            let child = linkNode.firstChild;
            while (child) {
              children.push({
                name: child.name,
                from: child.from,
                to: child.to,
              });
              child = child.nextSibling;
            }

            if (children.length >= 2) {
              // Hide the opening "["
              const firstMark = children[0];
              if (firstMark.name === "LinkMark" && firstMark.to > firstMark.from) {
                decorations.push({
                  from: firstMark.from,
                  to: firstMark.to,
                  deco: Decoration.replace({}),
                });
              }

              // Find the "]" mark and hide everything from "]" to end of link
              // This covers "](url)" portion
              let closingBracketIdx = -1;
              for (let i = 1; i < children.length; i++) {
                if (
                  children[i].name === "LinkMark" &&
                  state.sliceDoc(children[i].from, children[i].to) === "]"
                ) {
                  closingBracketIdx = i;
                  break;
                }
              }

              if (closingBracketIdx !== -1) {
                const closingFrom = children[closingBracketIdx].from;
                decorations.push({
                  from: closingFrom,
                  to: node.to,
                  deco: Decoration.replace({}),
                });
              }

              // Add underline mark to the visible link text
              const textFrom = firstMark.to;
              const textTo =
                closingBracketIdx !== -1
                  ? children[closingBracketIdx].from
                  : node.to;
              if (textTo > textFrom) {
                decorations.push({
                  from: textFrom,
                  to: textTo,
                  deco: Decoration.mark({
                    class: "cm-link-decorated",
                  }),
                });
              }
            }

            // Don't recurse into link children — we handle them above
            return false;
          }

          // ── Horizontal Rule ──────────────────────────────
          case "HorizontalRule": {
            if (isCursorLine(state, nodeLineFrom)) break;
            decorations.push({
              from: node.from,
              to: node.to,
              deco: Decoration.replace({
                widget: new HRWidget(),
              }),
            });
            break;
          }

          // ── Bullet list markers ──────────────────────────
          case "ListMark": {
            if (isCursorLine(state, nodeLineFrom)) break;
            // Only handle unordered list markers (- or *)
            const markText = state.sliceDoc(node.from, node.to);
            if (markText === "-" || markText === "*") {
              // Include trailing space after the marker
              const endWithSpace = Math.min(node.to + 1, state.doc.length);
              const charAfterMark = state.sliceDoc(node.to, endWithSpace);
              const end = charAfterMark === " " ? endWithSpace : node.to;
              decorations.push({
                from: node.from,
                to: end,
                deco: Decoration.replace({
                  widget: new BulletWidget(),
                }),
              });
            }
            break;
          }

          // ── Fenced code block markers ────────────────────
          case "FencedCode": {
            // Hide opening and closing fence lines when cursor is not on them.
            // We iterate children to find CodeMark and CodeInfo nodes.
            const fencedNode = node.node;
            let fChild = fencedNode.firstChild;
            let openFenceEnd = -1;

            while (fChild) {
              if (fChild.name === "CodeMark") {
                const fenceLineNum = state.doc.lineAt(fChild.from).number;
                if (!isCursorLine(state, fenceLineNum)) {
                  // Determine if this is the opening or closing fence
                  if (openFenceEnd === -1) {
                    // Opening fence: hide entire line (``` + optional language)
                    const fenceLine = state.doc.lineAt(fChild.from);
                    openFenceEnd = fenceLine.to;
                    // Replace the entire opening line content
                    if (fenceLine.to > fenceLine.from) {
                      decorations.push({
                        from: fenceLine.from,
                        to: fenceLine.to,
                        deco: Decoration.replace({}),
                      });
                    }
                  } else {
                    // Closing fence: hide entire line
                    const fenceLine = state.doc.lineAt(fChild.from);
                    if (fenceLine.to > fenceLine.from) {
                      decorations.push({
                        from: fenceLine.from,
                        to: fenceLine.to,
                        deco: Decoration.replace({}),
                      });
                    }
                  }
                } else {
                  if (openFenceEnd === -1) openFenceEnd = fChild.to;
                }
              }
              fChild = fChild.nextSibling;
            }

            // Don't recurse into FencedCode children — we handle them manually
            return false;
          }

          // ── Blockquote markers ───────────────────────────
          case "QuoteMark": {
            if (isCursorLine(state, nodeLineFrom)) break;
            // Hide the "> " prefix
            const endWithSpace = Math.min(node.to + 1, state.doc.length);
            const charAfterQuote = state.sliceDoc(node.to, endWithSpace);
            const end = charAfterQuote === " " ? endWithSpace : node.to;
            decorations.push({
              from: node.from,
              to: end,
              deco: Decoration.replace({}),
            });
            break;
          }

          default:
            // For multi-line nodes that span cursor lines,
            // we skip at the individual mark level (handled above).
            break;
        }
      },
    });
  }

  // Sort by position — required by RangeSetBuilder
  decorations.sort((a, b) => a.from - b.from || a.to - b.to);

  // Remove overlapping decorations — keep the first one when ranges overlap
  const cleaned: DecorationEntry[] = [];
  for (const d of decorations) {
    if (d.from >= d.to) continue; // skip empty ranges
    if (d.from < 0 || d.to > state.doc.length) continue; // skip out of bounds
    const last = cleaned[cleaned.length - 1];
    if (last && d.from < last.to) {
      // Overlap — skip this decoration
      continue;
    }
    cleaned.push(d);
  }

  const builder = new RangeSetBuilder<Decoration>();
  for (const d of cleaned) {
    builder.add(d.from, d.to, d.deco);
  }
  return builder.finish();
}

/**
 * ViewPlugin that provides Typora-style inline WYSIWYG decorations.
 *
 * - Hides Markdown syntax markers on lines where the cursor is NOT present.
 * - Shows raw Markdown on the cursor line for editing.
 * - Updates on document changes, selection changes, and viewport changes.
 */
class MarkdownDecorationsPlugin {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = buildDecorations(view);
  }

  update(update: ViewUpdate) {
    if (
      update.docChanged ||
      update.selectionSet ||
      update.viewportChanged
    ) {
      this.decorations = buildDecorations(update.view);
    }
  }
}

export const markdownDecorations = ViewPlugin.fromClass(
  MarkdownDecorationsPlugin,
  {
    decorations: (plugin) => plugin.decorations,
  }
);
