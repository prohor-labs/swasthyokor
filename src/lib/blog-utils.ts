export const DEFAULT_BLOG_COVER =
  "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&auto=format&fit=crop&q=85";

/**
 * Returns a valid, safe image URL for next/image.
 * If empty, invalid, or an unsplash webpage link, returns a high-resolution fallback.
 */
export function getSafeBlogCover(url?: string | null): string {
  if (!url || typeof url !== "string" || !url.trim()) {
    return DEFAULT_BLOG_COVER;
  }
  const trimmed = url.trim();

  // If user pasted an Unsplash webpage URL instead of direct image URL
  // e.g., https://unsplash.com/photos/lemon-curd-food-photography-recipe-idea-vm-sIjMioUQ
  if (trimmed.startsWith("https://unsplash.com/photos/")) {
    const photoId = trimmed.split("/").pop()?.split("-").pop() || "";
    if (photoId) {
      return `https://images.unsplash.com/photo-${photoId}?w=1200&auto=format&fit=crop&q=85`;
    }
    return DEFAULT_BLOG_COVER;
  }

  // Must be an http/https URL or relative path
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("/")) {
    return DEFAULT_BLOG_COVER;
  }

  return trimmed;
}
