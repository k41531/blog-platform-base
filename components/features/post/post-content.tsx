import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

/**
 * Preserve extra blank lines by converting them to empty paragraphs.
 * Markdown collapses multiple blank lines into one paragraph break,
 * but users expect blank lines in the editor to appear in the output.
 */
function preserveBlankLines(content: string): string {
  // Normalize line endings to \n first (DB may store \r\n)
  const normalized = content.replace(/\r\n/g, "\n");
  return normalized.replace(/\n{3,}/g, (match) => {
    const extraLines = match.length - 2;
    const spacers = Array(extraLines).fill("\n\n\u00A0").join("");
    return spacers + "\n\n";
  });
}

export function PostContent({ content }: { content: string }) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
        {preserveBlankLines(content)}
      </ReactMarkdown>
    </div>
  );
}
