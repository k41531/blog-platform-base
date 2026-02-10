import type { KeyBinding } from "@codemirror/view";

import {
  toggleBold,
  toggleItalic,
  toggleInlineCode,
  toggleStrikethrough,
} from "./markdown-commands";

export const markdownKeymap: KeyBinding[] = [
  { key: "Mod-b", run: toggleBold },
  { key: "Mod-i", run: toggleItalic },
  { key: "Mod-e", run: toggleInlineCode },
  { key: "Mod-Shift-s", run: toggleStrikethrough },
];
