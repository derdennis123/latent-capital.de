import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";

/**
 * Format a date string in German locale.
 * Example: "15. Januar 2025"
 */
export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, "d. MMMM yyyy", { locale: de });
}

/**
 * Estimate reading time from HTML content.
 * Returns reading time in minutes (minimum 1).
 */
export function estimateReadingTime(html: string): number {
  // Strip HTML tags to get plain text
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);

  return Math.max(1, minutes);
}

/**
 * Truncate text to a maximum length, appending an ellipsis
 * if truncated. Avoids cutting words in half.
 */
export function truncateExcerpt(
  text: string,
  maxLength: number = 160
): string {
  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace === -1) {
    return truncated + "\u2026";
  }

  return truncated.slice(0, lastSpace) + "\u2026";
}

/**
 * Map tag slugs to their section URLs on the site.
 */
export function getTagUrl(slug: string): string {
  return `/tag/${slug}`;
}
