import { EditorView } from "@codemirror/view";
import { tags, tagHighlighter } from "@lezer/highlight";
import { syntaxHighlighting } from "@codemirror/language";
import { markdownStyles } from "@/lib/shared/markdown-styles";

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
    fontSize: markdownStyles.base.fontSize,
    height: "100%",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-scroller": {
    fontFamily: "inherit",
    lineHeight: markdownStyles.base.lineHeight,
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
    fontSize: markdownStyles.h1.fontSize,
    fontWeight: markdownStyles.h1.fontWeight,
    lineHeight: markdownStyles.h1.lineHeight,
  },
  ".cm-heading2": {
    fontSize: markdownStyles.h2.fontSize,
    fontWeight: markdownStyles.h2.fontWeight,
    lineHeight: markdownStyles.h2.lineHeight,
  },
  ".cm-heading3": {
    fontSize: markdownStyles.h3.fontSize,
    fontWeight: markdownStyles.h3.fontWeight,
    lineHeight: markdownStyles.h3.lineHeight,
  },
  ".cm-heading4": {
    fontSize: markdownStyles.h4.fontSize,
    fontWeight: markdownStyles.h4.fontWeight,
    lineHeight: markdownStyles.h4.lineHeight,
  },
  ".cm-heading5, .cm-heading6": {
    fontSize: markdownStyles.h5h6.fontSize,
    fontWeight: markdownStyles.h5h6.fontWeight,
    lineHeight: markdownStyles.h5h6.lineHeight,
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
    fontFamily: markdownStyles.inlineCode.fontFamily,
    fontSize: markdownStyles.inlineCode.fontSize,
    backgroundColor: "hsl(var(--muted))",
    borderRadius: markdownStyles.inlineCode.borderRadius,
    padding: markdownStyles.inlineCode.padding,
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
  // ── Code block styling ──────────────────────────
  ".cm-codeblock-line": {
    backgroundColor: "hsl(var(--muted))",
    fontFamily: markdownStyles.inlineCode.fontFamily,
    fontSize: markdownStyles.inlineCode.fontSize,
    paddingLeft: "16px",
    paddingRight: "16px",
  },
  ".cm-codeblock-first": {
    borderTopLeftRadius: "6px",
    borderTopRightRadius: "6px",
    paddingTop: "12px",
  },
  ".cm-codeblock-last": {
    borderBottomLeftRadius: "6px",
    borderBottomRightRadius: "6px",
    paddingBottom: "12px",
  },
  // ── Heading spacing ─────────────────────────────
  ".cm-heading-line": {
    paddingTop: "0.15em",
    paddingBottom: "0.1em",
  },
  // ── List indentation ───────────────────────────
  ".cm-list-line": {
    paddingLeft: "1.625em",
  },
  // ── Blockquote styling ──────────────────────────
  ".cm-blockquote-line": {
    borderLeft: "3px solid hsl(var(--border))",
    paddingLeft: "16px",
  },
});
