import { EditorView } from "@codemirror/view";

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
    padding: "16px 0",
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
  // Markdown syntax highlighting
  ".cm-header-1": {
    fontSize: "1.875em",
    fontWeight: "700",
    lineHeight: "1.3",
  },
  ".cm-header-2": {
    fontSize: "1.5em",
    fontWeight: "600",
    lineHeight: "1.35",
  },
  ".cm-header-3": {
    fontSize: "1.25em",
    fontWeight: "600",
    lineHeight: "1.4",
  },
  ".cm-header-4": {
    fontSize: "1.125em",
    fontWeight: "600",
    lineHeight: "1.4",
  },
  ".cm-header-5, .cm-header-6": {
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
  "& .cm-monospace": {
    fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
    fontSize: "0.9em",
    backgroundColor: "hsl(var(--muted))",
    borderRadius: "3px",
    padding: "1px 4px",
  },
  // Code block (fenced code)
  ".cm-line.cm-codeblock": {
    backgroundColor: "hsl(var(--muted) / 0.5)",
    fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
    fontSize: "0.9em",
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
