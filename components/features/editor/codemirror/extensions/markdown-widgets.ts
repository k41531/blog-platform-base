import { WidgetType } from "@codemirror/view";

/**
 * Replaces `![alt](url)` with a rendered <img> element.
 * Shows alt text in a placeholder on load error.
 */
export class ImageWidget extends WidgetType {
  constructor(
    readonly src: string,
    readonly alt: string
  ) {
    super();
  }

  eq(other: ImageWidget): boolean {
    return this.src === other.src && this.alt === other.alt;
  }

  toDOM(): HTMLElement {
    const wrapper = document.createElement("span");
    wrapper.style.display = "block";
    wrapper.style.padding = "4px 0";

    const img = document.createElement("img");
    img.src = this.src;
    img.alt = this.alt;
    img.style.maxWidth = "100%";
    img.style.borderRadius = "6px";
    img.style.display = "block";

    img.addEventListener("error", () => {
      wrapper.textContent = "";
      const placeholder = document.createElement("div");
      placeholder.style.padding = "12px 16px";
      placeholder.style.borderRadius = "6px";
      placeholder.style.border = "1px dashed hsl(var(--border))";
      placeholder.style.color = "hsl(var(--muted-foreground))";
      placeholder.style.fontSize = "0.875em";
      placeholder.textContent = this.alt || "Image failed to load";
      wrapper.appendChild(placeholder);
    });

    wrapper.appendChild(img);
    return wrapper;
  }

  ignoreEvent(): boolean {
    return false;
  }
}

/**
 * Replaces `---` / `***` / `___` with a styled <hr>.
 */
export class HRWidget extends WidgetType {
  eq(): boolean {
    return true;
  }

  toDOM(): HTMLElement {
    const hr = document.createElement("hr");
    hr.style.border = "none";
    hr.style.borderTop = "1px solid hsl(var(--border))";
    hr.style.margin = "8px 0";
    return hr;
  }

  ignoreEvent(): boolean {
    return false;
  }
}

/**
 * Replaces `- ` / `* ` list markers with a bullet dot character.
 */
export class BulletWidget extends WidgetType {
  eq(): boolean {
    return true;
  }

  toDOM(): HTMLElement {
    const span = document.createElement("span");
    span.textContent = "\u2022";
    span.style.color = "hsl(var(--muted-foreground))";
    span.style.paddingRight = "6px";
    return span;
  }

  ignoreEvent(): boolean {
    return false;
  }
}
