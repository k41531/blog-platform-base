"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MarkdownPreviewProps = {
  content: string;
};

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-muted-foreground">
          プレビュー
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap break-words">
          {content || (
            <span className="text-muted-foreground">
              本文を入力するとプレビューが表示されます
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
