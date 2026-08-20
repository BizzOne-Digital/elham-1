const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "ul",
  "ol",
  "li",
  "a",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "code",
  "pre",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
};

const GLOBAL_ALLOWED_ATTRS = new Set(["class"]);

function stripControlCharacters(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

function sanitizeUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  const lower = trimmed.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:")) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("/") || trimmed.startsWith("#")) {
    return trimmed;
  }

  if (/^mailto:/i.test(trimmed) || /^tel:/i.test(trimmed)) {
    return trimmed;
  }

  return null;
}

function sanitizeAttributes(tag: string, attrs: string): string {
  const allowedForTag = ALLOWED_ATTRS[tag] ?? new Set<string>();
  const sanitized: string[] = [];

  const attrPattern = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>/]+))/g;
  let match: RegExpExecArray | null;

  while ((match = attrPattern.exec(attrs)) !== null) {
    const name = match[1].toLowerCase();
    const value = match[3] ?? match[4] ?? match[5] ?? "";

    if (!allowedForTag.has(name) && !GLOBAL_ALLOWED_ATTRS.has(name)) {
      continue;
    }

    if (name === "href") {
      const safeUrl = sanitizeUrl(value);
      if (!safeUrl) {
        continue;
      }
      sanitized.push(`${name}="${safeUrl.replace(/"/g, "&quot;")}"`);
      continue;
    }

    if (name === "target" && value !== "_blank") {
      continue;
    }

    if (name === "rel" && tag === "a") {
      sanitized.push('rel="noopener noreferrer"');
      continue;
    }

    sanitized.push(`${name}="${value.replace(/"/g, "&quot;")}"`);
  }

  if (tag === "a" && sanitized.some((attr) => attr.startsWith('target="_blank"'))) {
    if (!sanitized.some((attr) => attr.startsWith("rel="))) {
      sanitized.push('rel="noopener noreferrer"');
    }
  }

  return sanitized.length > 0 ? ` ${sanitized.join(" ")}` : "";
}

/**
 * Allowlist-based rich text sanitization for CMS content and user messages.
 */
export function sanitizeRichText(input: string): string {
  const cleaned = stripControlCharacters(input);
  const tagPattern = /<\/?([a-zA-Z0-9]+)([^>]*)>/g;

  return cleaned.replace(tagPattern, (full, rawTag, rawAttrs) => {
    const tag = String(rawTag).toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      return "";
    }

    if (full.startsWith("</")) {
      return `</${tag}>`;
    }

    if (tag === "br") {
      return "<br />";
    }

    return `<${tag}${sanitizeAttributes(tag, String(rawAttrs))}>`;
  });
}

export function sanitizePlainText(input: string, maxLength = 5000): string {
  return stripControlCharacters(input).trim().slice(0, maxLength);
}

export function stripHtml(input: string): string {
  return stripControlCharacters(input).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
