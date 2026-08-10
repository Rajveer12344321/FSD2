// components/OptimizedList.jsx
//
// OPTIMIZED counterpart to NonOptimizedList.jsx (Assignment 5, side B).
//
// Fixes applied, matched 1:1 against the problems in NonOptimizedList:
//   1. Row is wrapped in React.memo -> a row only re-renders if ITS OWN
//      props (the `post` object or the callbacks) change identity.
//   2. Data comes from selectShortPosts, a `createSelector`-memoized selector
//      (postSelectors.js) -- it only recomputes when the underlying posts
//      array actually changes, not on every render/tick.
//   3. useMemo wraps any further derived computation (average length here),
//      and useCallback gives the click handler a STABLE identity so it
//      doesn't invalidate the memoized rows on every parent render.
//
// Net effect: with the same "tick every second" parent re-render used in the
// demo, this list's rows do NOT re-render on every tick -- only Dashboard's
// tick counter itself does.

import { useCallback, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import React from "react";
import { selectShortPosts } from "../features/posts/postSelectors";

const OptimizedRow = React.memo(function OptimizedRow({ post, onSelect }) {
  return (
    <li onClick={() => onSelect(post.id)}>
      {post.title}
    </li>
  );
});

function OptimizedList() {
  // Memoized selector: recomputes only when posts actually change.
  const shortPosts = useSelector(selectShortPosts);

  // Render counter for the list wrapper itself (the memoized rows below it
  // render even less often than this number, since React.memo blocks them
  // individually when their own props are unchanged).
  const renderCount = useRef(0);
  renderCount.current += 1;

  // useMemo: derived value recalculated only when shortPosts changes.
  const averageShortLength = useMemo(() => {
    if (shortPosts.length === 0) return 0;
    const total = shortPosts.reduce((sum, post) => sum + post.content.length, 0);
    return Math.round(total / shortPosts.length);
  }, [shortPosts]);

  // useCallback: stable function identity across renders, so OptimizedRow's
  // React.memo actually prevents re-renders instead of being defeated by it.
  const handleSelect = useCallback((id) => {
    console.log("clicked", id);
  }, []);

  return (
    <div className="card perf-list">
      <h4>
        Optimized List ({shortPosts.length} short posts, avg {averageShortLength} chars)
      </h4>
      <p className="render-count render-count-good">Renders so far: {renderCount.current}</p>
      <ul>
        {shortPosts.map((post) => (
          <OptimizedRow key={post.id} post={post} onSelect={handleSelect} />
        ))}
      </ul>
    </div>
  );
}

export default OptimizedList;
