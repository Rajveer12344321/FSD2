import React from 'react';

export const DraftList = ({ drafts, onEditDraft, onDeleteDraft }) => {
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'twitter':
        return '🐦';
      case 'linkedin':
        return '💼';
      case 'instagram':
        return '📸';
      default:
        return '📝';
    }
  };

  const truncateText = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="card drafts-card">
      <div className="card-header">
        <h3>Saved Drafts ({drafts.length})</h3>
        <span className="badge badge-info">localStorage</span>
      </div>

      {drafts.length === 0 ? (
        <div className="drafts-empty-state">
          <p>No drafts saved yet.</p>
          <span>Create a post and click "Save Draft" to persist it locally.</span>
        </div>
      ) : (
        <div className="drafts-list">
          {drafts.map((draft) => (
            <div key={draft.id} className="draft-item">
              <div className="draft-item-header">
                <span className="draft-platform">
                  {getPlatformIcon(draft.platform)} {draft.platform.toUpperCase()}
                </span>
                <span className="draft-time">{draft.updatedAt}</span>
              </div>
              
              <p className="draft-preview">{truncateText(draft.content)}</p>
              
              <div className="draft-item-actions">
                <button
                  onClick={() => onDeleteDraft(draft.id)}
                  className="btn btn-sm btn-danger-outline"
                >
                  Delete
                </button>
                <button
                  onClick={() => onEditDraft(draft)}
                  className="btn btn-sm btn-primary"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
