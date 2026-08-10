// components/NonOptimizedList.jsx
//
// INTENTIONALLY NON-OPTIMIZED (Assignment 5, "performance demonstration" side A).
//
// Problems on purpose, so they can be contrasted with OptimizedList.jsx:
//   1. No React.memo -> every row re-renders whenever ANY parent state changes,
//      even state that has nothing to do with this list (e.g. a tick counter).
//   2. Filtering logic runs inline on every render instead of via a memoized
//      selector -- it re-filters the full array from scratch each time,
//      even when the underlying posts haven't changed.
//   3. The onClick handler is a new inline arrow function created on every
//      render, so even if a child WERE memoized, its props would still
//      look "new" every time and defeat the memoization.
//
// This component reads posts directly from the store with a plain selector
// (no reselect) to make the re-filtering cost visible/comparable.

import { useSelector } from "react-redux";
import { useRef } from "react";

function NonOptimizedList() {
  // Plain (non-memoized) selector -- returns a brand-new filtered array
  // on every single render, regardless of whether posts changed.
  const shortPosts = useSelector((state) =>
    state.posts.ids
      .map((id) => state.posts.entities[id])
      .filter((post) => post.content.length < 100)
  );

  // Render counter (visible proof of the re-render problem, not just console noise).
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div className="card perf-list">
      <h4>Non-Optimized List ({shortPosts.length} short posts)</h4>
      <p className="render-count render-count-bad">Renders so far: {renderCount.current}</p>
      <ul>
        {shortPosts.map((post) => (
          // No React.memo wrapper here -- this whole subtree re-renders
          // every time the parent re-renders, e.g. once a second from the tick timer.
          <li key={post.id} onClick={() => console.log("clicked", post.id)}>
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NonOptimizedList;
