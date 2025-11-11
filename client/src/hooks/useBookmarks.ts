import { useState, useEffect } from 'react';

const BOOKMARKS_KEY = 'metahers_bookmarks';

export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBookmarkedIds(new Set(parsed));
      } catch (error) {
        console.error('Failed to parse bookmarks:', error);
      }
    }
  }, []);

  const toggleBookmark = (experienceId: string) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(experienceId)) {
        next.delete(experienceId);
      } else {
        next.add(experienceId);
      }
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const isBookmarked = (experienceId: string) => bookmarkedIds.has(experienceId);

  const getBookmarkedIds = () => Array.from(bookmarkedIds);

  return {
    isBookmarked,
    toggleBookmark,
    getBookmarkedIds,
    bookmarkedCount: bookmarkedIds.size,
  };
}
