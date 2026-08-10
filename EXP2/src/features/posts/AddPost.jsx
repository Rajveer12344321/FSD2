// features/posts/AddPost.jsx
//
// Handles both CREATE and EDIT for posts, since the two forms are identical
// in shape (title, content, platform). `editingPost` (passed down from Posts.jsx)
// switches the form into edit mode and pre-fills the fields.
//
// useCallback is used on the submit handler so this component's own re-renders
// don't force a brand-new function identity into child inputs unnecessarily.

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, updatePost } from "./postsSlice";
import { platformsSelectors } from "../platforms/platformSlice";

function AddPost({ editingPost, onDoneEditing }) {
  const dispatch = useDispatch();
  const platforms = useSelector(platformsSelectors.selectAll);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState(platforms[0]?.name || "");

  // When editingPost changes (user clicked "Edit" on a post), populate the form.
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
      setPlatform(editingPost.platform);
    }
  }, [editingPost]);

  const resetForm = useCallback(() => {
    setTitle("");
    setContent("");
    setPlatform(platforms[0]?.name || "");
  }, [platforms]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (!title.trim() || !content.trim() || !platform) return;

      if (editingPost) {
        dispatch(updatePost({ id: editingPost.id, changes: { title, content, platform } }));
        onDoneEditing();
      } else {
        dispatch(addPost({ title, content, platform }));
      }
      resetForm();
    },
    [dispatch, editingPost, title, content, platform, onDoneEditing, resetForm]
  );

  const handleCancel = useCallback(() => {
    resetForm();
    onDoneEditing();
  }, [resetForm, onDoneEditing]);

  return (
    <form className="card post-form" onSubmit={handleSubmit}>
      <h3>{editingPost ? "Edit Post" : "Add New Post"}</h3>

      <label htmlFor="post-title">Title</label>
      <input
        id="post-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        required
      />

      <label htmlFor="post-content">Content</label>
      <textarea
        id="post-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write the post content..."
        rows={4}
        required
      />

      <label htmlFor="post-platform">Platform</label>
      <select
        id="post-platform"
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        required
      >
        {platforms.map((p) => (
          <option key={p.id} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingPost ? "Save Changes" : "Add Post"}
        </button>
        {editingPost && (
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default AddPost;
