/**
 * Strips common Markdown syntax from text, returning plain text.
 * Useful for generating excerpts from Markdown content.
 */
export function stripMarkdown(text: string): string {
  let result = text;

  // Remove code blocks (triple backtick fenced blocks)
  result = result.replace(/```[\s\S]*?```/g, "");

  // Inline code: keep inner text
  result = result.replace(/`([^`]*)`/g, "$1");

  // Images: replace with alt text
  result = result.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");

  // Links: replace with link text
  result = result.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");

  // Heading markers at line starts
  result = result.replace(/^#{1,6}\s+/gm, "");

  // Bold/italic markers
  result = result.replace(/\*\*(.+?)\*\*/g, "$1");
  result = result.replace(/__(.+?)__/g, "$1");
  result = result.replace(/\*(.+?)\*/g, "$1");
  result = result.replace(/_(.+?)_/g, "$1");

  // Strikethrough
  result = result.replace(/~~(.+?)~~/g, "$1");

  // Blockquote markers at line starts
  result = result.replace(/^>\s+/gm, "");

  // Horizontal rules (lines that are only ---, ***, or ___)
  result = result.replace(/^[-*_]{3,}\s*$/gm, "");

  // Unordered list markers at line starts
  result = result.replace(/^[-*+]\s+/gm, "");

  // Ordered list markers at line starts
  result = result.replace(/^\d+\.\s+/gm, "");

  // Collapse multiple whitespace/newlines into single spaces
  result = result.replace(/\s+/g, " ");

  return result.trim();
}
