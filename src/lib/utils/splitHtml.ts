/**
 * Split HTML content into preview and remaining parts.
 * Takes roughly the first `ratio` (default 35%) of top-level block elements.
 */
export function splitHtmlForPreview(
  html: string,
  ratio: number = 0.35
): { preview: string; full: string } {
  if (!html) {
    return { preview: "", full: "" };
  }

  // Match top-level block elements (p, h1-h6, ul, ol, blockquote, figure, div, table, pre, hr)
  const blockPattern =
    /(<(?:p|h[1-6]|ul|ol|blockquote|figure|div|table|pre|hr)[\s>][\s\S]*?<\/(?:p|h[1-6]|ul|ol|blockquote|figure|div|table|pre)>|<hr\s*\/?>)/gi;

  const blocks: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = blockPattern.exec(html)) !== null) {
    blocks.push(match[0]);
  }

  if (blocks.length === 0) {
    return { preview: html, full: html };
  }

  // Take at least 2 blocks, at most all-1
  const splitIndex = Math.max(2, Math.min(blocks.length - 1, Math.round(blocks.length * ratio)));

  const previewBlocks = blocks.slice(0, splitIndex);

  return {
    preview: previewBlocks.join("\n"),
    full: html,
  };
}
