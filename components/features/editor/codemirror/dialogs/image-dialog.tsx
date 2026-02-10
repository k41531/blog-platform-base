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

type ImageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (alt: string, url: string) => void;
};

export function ImageDialog({
  open,
  onOpenChange,
  onInsert,
}: ImageDialogProps) {
  const [alt, setAlt] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (open) {
      setAlt("");
      setUrl("");
    }
  }, [open]);

  const handleInsert = () => {
    onInsert(alt, url);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>画像を挿入</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="image-alt">代替テキスト</Label>
            <Input
              id="image-alt"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="画像の説明"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image-url">画像URL</Label>
            <Input
              id="image-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/image.png"
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
