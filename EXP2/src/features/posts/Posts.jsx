// features/posts/Posts.jsx
//
// Main posts view: search box, platform filter, list rendering, and
// delete/edit actions. Reads from the memoized `selectVisiblePosts`
// selector (postSelectors.js) so it never re-filters the raw array itself.

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  deletePost,
  setSearchTerm,
  setPlatformFilter
} from "./postsSlice";
import {
  selectVisiblePosts,
  selectSearchTerm,
  selectPlatformFilter,
  selectPostsLoading,
  selectPostsError
} from "./postSelectors";
import { platformsSelectors } from "../platforms/platformSlice";
import AddPost from "./AddPost";

// Single post row, memoized so editing the search box doesn't re-render
// every row -- only the ones whose data actually changed.
import React from "react";

const PostItem = React.memo(function PostItem({ post, onEdit, onDelete }) {
  return (
    <li className="post-item">
      <div className="post-item-header">
        <span className="platform-badge">{post.platform}</span>
        <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
      </div>
      <h4>{post.title}</h4>
      <p>{post.content}</p>
      <div className="post-item-actions">
        <button className="btn btn-small" onClick={() => onEdit(post)}>
          Edit
        </button>
        <button className="btn btn-small btn-danger" onClick={() => onDelete(post.id)}>
          Delete
        </button>
      </div>
    </li>
  );
});

function Posts() {
  const dispatch = useDispatch();
  const visiblePosts = useSelector(selectVisiblePosts);
  const searchTerm = useSelector(selectSearchTerm);
  const platformFilter = useSelector(selectPlatformFilter);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const platforms = useSelector(platformsSelectors.selectAll);

  const [editingPost, setEditingPost] = useState(null);

  // Fetch posts once on mount via the async thunk (simulated API call).
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  // useCallback keeps these handler identities stable across renders,
  // which matters because they're passed as props into the memoized PostItem.
  const handleEdit = useCallback((post) => setEditingPost(post), []);
  const handleDelete = useCallback((id) => dispatch(deletePost(id)), [dispatch]);
  const handleDoneEditing = useCallback(() => setEditingPost(null), []);

  return (
    <section className="posts-section">
      <AddPost editingPost={editingPost} onDoneEditing={handleDoneEditing} />

      <div className="card posts-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search posts by title or content..."
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        />
        <select
          className="filter-select"
          value={platformFilter}
          onChange={(e) => dispatch(setPlatformFilter(e.target.value))}
        >
          <option value="all">All Platforms</option>
          {platforms.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="status-message loading">Loading posts...</p>}
      {error && <p className="status-message error">Error: {error}</p>}

      {!loading && !error && visiblePosts.length === 0 && (
        <p className="status-message empty">No posts match your search/filter.</p>
      )}

      <ul className="posts-list">
        {visiblePosts.map((post) => (
          <PostItem key={post.id} post={post} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </ul>
    </section>
  );
}

export default Posts;
