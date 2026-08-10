// features/posts/postSelectors.js
//
// Derived + memoized selectors (Experiment 2.2, Assignment 4).
// Everything here is computed FROM state rather than stored, and wrapped in
// createSelector so it only recomputes when its actual inputs change,
// not on every store update. This is the piece that powers Analytics.jsx
// and the optimized rendering demo (OptimizedList.jsx) without re-filtering
// or re-scanning the whole post list on unrelated state changes.

import { createSelector } from "reselect";
import { postsSelectors } from "./postsSlice";

// --- Basic (non-memoized) accessors --------------------------------------

// All posts, as a plain array, in the adapter's sort order (newest first).
export const selectAllPosts = (state) => postsSelectors.selectAll(state);

export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;
export const selectSearchTerm = (state) => state.posts.searchTerm;
export const selectPlatformFilter = (state) => state.posts.platformFilter;

// --- Memoized derived selectors -------------------------------------------

// Posts filtered by the current search term (title/content match, case-insensitive).
// Recomputes only when selectAllPosts or selectSearchTerm actually change.
export const selectSearchedPosts = createSelector(
  [selectAllPosts, selectSearchTerm],
  (posts, searchTerm) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return posts;
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(term) || post.content.toLowerCase().includes(term)
    );
  }
);

// Posts filtered by BOTH search term and selected platform ("all" = no platform filter).
// This is the selector the main Posts list actually renders from.
export const selectVisiblePosts = createSelector(
  [selectSearchedPosts, selectPlatformFilter],
  (searchedPosts, platformFilter) => {
    if (platformFilter === "all") return searchedPosts;
    return searchedPosts.filter((post) => post.platform === platformFilter);
  }
);

// Posts grouped by platform -> count. Powers the "Posts per Platform" analytics card.
export const selectPostCountByPlatform = createSelector([selectAllPosts], (posts) => {
  const counts = {};
  posts.forEach((post) => {
    counts[post.platform] = (counts[post.platform] || 0) + 1;
  });
  return counts;
});

// The 5 most recently created posts (adapter already sorts newest-first).
export const selectRecentPosts = createSelector([selectAllPosts], (posts) => posts.slice(0, 5));

// "Short" posts: content under 100 characters (mirrors the PDF's selectShortPosts example).
export const selectShortPosts = createSelector([selectAllPosts], (posts) =>
  posts.filter((post) => post.content.length < 100)
);

// "Long" posts: the complement of short posts, used in the Analytics view.
export const selectLongPosts = createSelector([selectAllPosts], (posts) =>
  posts.filter((post) => post.content.length >= 100)
);

// Aggregate statistics block: total posts, platform count, average content length.
// Combines multiple already-memoized selectors, so it only recomputes when one
// of ITS inputs changes -- not on every keystroke in the search box, for example.
export const selectPostStatistics = createSelector(
  [selectAllPosts, selectPostCountByPlatform, selectShortPosts, selectLongPosts],
  (posts, countByPlatform, shortPosts, longPosts) => {
    const totalPosts = posts.length;
    const totalLength = posts.reduce((sum, post) => sum + post.content.length, 0);
    const averageContentLength = totalPosts === 0 ? 0 : Math.round(totalLength / totalPosts);

    return {
      totalPosts,
      platformCount: Object.keys(countByPlatform).length,
      averageContentLength,
      shortPostCount: shortPosts.length,
      longPostCount: longPosts.length
    };
  }
);
