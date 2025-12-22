export const formatNodeDate = (dateString: string): string => {
  if (!dateString) return "Never";
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    return "Invalid Date";
  }
};

/**
 * Format a date string to show relative time for recent dates and absolute date for older ones.
 * @param dateString - ISO date string or null/undefined
 * @returns Formatted date string (e.g., "2 minutes ago", "3 hours ago", "Jan 15, 2024", or "Never")
 */
export const formatRelativeDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "Never";
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    // Show relative time for recent dates (within 7 days)
    if (diffSeconds < 60) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      // Show absolute date for older dates
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  } catch (error) {
    return "Invalid Date";
  }
};