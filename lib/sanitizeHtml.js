export function sanitizeHtml(html, options = {}) {
  if (!html) return "";
  const { allowIframe = true } = options;

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    let sanitized = html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/\son\w+=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(
        /(href|src|xlink:href)\s*=\s*(['"])\s*javascript:[^'"]*\2/gi,
        ""
      )
      .replace(
        /(href|src|xlink:href)\s*=\s*(['"])\s*data:text\/html[^'"]*\2/gi,
        ""
      );

    if (!allowIframe) {
      sanitized = sanitized.replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "");
    }

    return sanitized;
  }

  const doc = new DOMParser().parseFromString(html, "text/html");

  const blockedTags = new Set(["script", "object", "embed", "link"]);
  if (!allowIframe) blockedTags.add("iframe");

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
  const toRemove = [];

  while (walker.nextNode()) {
    const el = walker.currentNode;
    const tag = el.tagName?.toLowerCase();

    if (blockedTags.has(tag)) {
      toRemove.push(el);
      continue;
    }

    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value || "";

      if (name.startsWith("on")) {
        el.removeAttribute(attr.name);
        continue;
      }

      if (name === "href" || name === "src" || name === "xlink:href") {
        const v = value.trim().toLowerCase();
        if (v.startsWith("javascript:") || v.startsWith("data:text/html")) {
          el.removeAttribute(attr.name);
        }
      }
    }
  }

  for (const el of toRemove) {
    el.remove();
  }

  return doc.body.innerHTML;
}
