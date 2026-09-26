import { useState } from 'react';
import { PLATFORMS } from '../platforms';

export default function PostCard({ post, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(post.content);
  const meta = PLATFORMS[post.platform] || { label: post.platform, color: '#999', icon: '•' };

  const startEdit = () => {
    setDraft(post.content);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setDraft(post.content);
  };

  const saveEdit = async () => {
    if (!draft.trim()) return;
    await onUpdate(post.id, { platform: post.platform, content: draft });
    setIsEditing(false);
  };

  return (
    <article className="post-card">
      <header className="post-card-header">
        <span className="post-badge" style={{ '--accent': meta.color }}>
          <span className="post-badge-icon">{meta.icon}</span>
          {meta.label}
        </span>
        <div className="post-card-actions">
          {isEditing ? (
            <>
              <button className="chip chip-save" onClick={saveEdit}>Save</button>
              <button className="chip chip-cancel" onClick={cancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              <button className="chip" onClick={startEdit}>Edit</button>
              <button className="chip chip-danger" onClick={() => onDelete(post.id)}>Delete</button>
            </>
          )}
        </div>
      </header>

      {isEditing ? (
        <textarea
          className="post-edit-area"
          rows="4"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
      ) : (
        <p className="post-content">{post.content}</p>
      )}
    </article>
  );
}
