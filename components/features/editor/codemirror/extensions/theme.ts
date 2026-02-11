import { EditorView } from "@codemirror/view";
import { tags, tagHighlighter } from "@lezer/highlight";
import { syntaxHighlighting } from "@codemirror/language";

/**
 * Custom tag highlighter that maps lezer highlight tags to
 * predictable CSS class names for our theme to target.
 * Unlike defaultHighlightStyle (auto-generated classes) or
 * classHighlighter (tok-* with no heading level distinction),
 * this gives us full control over class names per heading level.
 */
export const markdownHighlighter = syntaxHighlighting(
  tagHighlighter([
    { tag: tags.heading1, class: "cm-heading1" },
    { tag: tags.heading2, class: "cm-heading2" },
    { tag: tags.heading3, class: "cm-heading3" },
    { tag: tags.heading4, class: "cm-heading4" },
    { tag: tags.heading5, class: "cm-heading5" },
    { tag: tags.heading6, class: "cm-heading6" },
    { tag: tags.strong, class: "cm-strong" },
    { tag: tags.emphasis, class: "cm-emphasis" },
    { tag: tags.strikethrough, class: "cm-strikethrough" },
    { tag: tags.monospace, class: "cm-monospace" },
    { tag: tags.link, class: "cm-link" },
    { tag: tags.url, class: "cm-url" },
    { tag: tags.quote, class: "cm-quote" },
    { tag: tags.processingInstruction, class: "cm-formatting" },
    { tag: tags.meta, class: "cm-meta" },
    { tag: tags.contentSeparator, class: "cm-hr" },
  ])
);

export const editorTheme = EditorView.theme({
  "&": {
    fontSize: "14px",
    height: "100%",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-scroller": {
    fontFamily: "inherit",
    lineHeight: "1.7",
    overflow: "auto",
  },
  ".cm-content": {
    caretColor: "hsl(var(--foreground))",
    color: "hsl(var(--foreground))",
    padding: "16px 0 16px 36px",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "hsl(var(--foreground))",
  },
  ".cm-selectionBackground": {
    backgroundColor: "hsl(var(--primary) / 0.15) !important",
  },
  "&.cm-focused .cm-selectionBackground": {
    backgroundColor: "hsl(var(--primary) / 0.2) !important",
  },
  ".cm-activeLine": {
    backgroundColor: "hsl(var(--muted) / 0.5)",
  },
  ".cm-gutters": {
    display: "none",
  },
  // Heading levels
  ".cm-heading1": {
    fontSize: "1.875em",
    fontWeight: "700",
    lineHeight: "1.3",
  },
  ".cm-heading2": {
    fontSize: "1.5em",
    fontWeight: "600",
    lineHeight: "1.35",
  },
  ".cm-heading3": {
    fontSize: "1.25em",
    fontWeight: "600",
    lineHeight: "1.4",
  },
  ".cm-heading4": {
    fontSize: "1.125em",
    fontWeight: "600",
    lineHeight: "1.4",
  },
  ".cm-heading5, .cm-heading6": {
    fontSize: "1em",
    fontWeight: "600",
    lineHeight: "1.5",
  },
  // Markdown marks (*, **, #, etc.) dimmed
  ".cm-formatting": {
    color: "hsl(var(--muted-foreground))",
  },
  ".cm-url": {
    color: "hsl(var(--muted-foreground))",
    textDecoration: "none",
  },
  ".cm-link": {
    color: "hsl(var(--primary))",
    textDecoration: "underline",
  },
  ".cm-meta": {
    color: "hsl(var(--muted-foreground))",
  },
  ".cm-quote": {
    color: "hsl(var(--muted-foreground))",
    fontStyle: "italic",
  },
  // Inline code
  ".cm-monospace": {
    fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
    fontSize: "0.9em",
    backgroundColor: "hsl(var(--muted))",
    borderRadius: "3px",
    padding: "1px 4px",
  },
  // Emphasis
  ".cm-strong": {
    fontWeight: "700",
  },
  ".cm-emphasis": {
    fontStyle: "italic",
  },
  ".cm-strikethrough": {
    textDecoration: "line-through",
  },
  // Horizontal rule
  ".cm-hr": {
    color: "hsl(var(--border))",
  },
  // Decorated link text (WYSIWYG mode)
  ".cm-link-decorated": {
    color: "hsl(var(--primary))",
    textDecoration: "underline",
    cursor: "pointer",
  },
});
