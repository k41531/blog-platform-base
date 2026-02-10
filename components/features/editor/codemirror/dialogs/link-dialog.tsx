"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LinkDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (text: string, url: string) => void;
  initialText?: string;
};

export function LinkDialog({
  open,
  onOpenChange,
  onInsert,
  initialText = "",
}: LinkDialogProps) {
  const [text, setText] = useState(initialText);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (open) {
      setText(initialText);
      setUrl("");
    }
  }, [open, initialText]);

  const handleInsert = () => {
    onInsert(text, url);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>リンクを挿入</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="link-text">テキスト</Label>
            <Input
              id="link-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="リンクテキスト"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleInsert} disabled={!url}>
            挿入
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
