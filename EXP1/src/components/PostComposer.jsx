import React, { useEffect, useState } from 'react';
import { useForm } from '../hooks/useForm';

const platformLimits = {
  twitter: 280,
  linkedin: 3000,
  instagram: 2200
};

export const PostComposer = ({ activeDraft, onSaveDraft, isSaving, saveAttempts, resetActiveDraft }) => {
  const {
    values,
    handleChange,
    setFieldValue,
    isValid,
    errorMessage,
    reset,
    loadValues
  } = useForm({ content: '', platform: 'twitter' });

  // Sync with activeDraft if editing a draft
  useEffect(() => {
    if (activeDraft) {
      loadValues({
        content: activeDraft.content,
        platform: activeDraft.platform
      });
    }
  }, [activeDraft]);

  const handleClear = () => {
    reset();
    if (activeDraft) {
      resetActiveDraft();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!isValid || values.content.trim() === '') return;

    onSaveDraft({
      id: activeDraft ? activeDraft.id : Date.now(),
      content: values.content,
      platform: values.platform,
      updatedAt: new Date().toLocaleString()
    }, () => {
      // Success callback to clear form
      handleClear();
    });
  };

  const limit = platformLimits[values.platform] || 280;
  const charsRemaining = limit - values.content.length;
  const isOverLimit = charsRemaining < 0;

  return (
    <div className="card composer-card">
      <div className="card-header">
        <h3>Create a New Post</h3>
        {activeDraft && <span className="badge badge-warning">Editing Draft</span>}
      </div>

      <form onSubmit={handleSave} className="composer-form">
        <div className="form-group">
          <label htmlFor="platform-select">Select Platform</label>
          <select
            id="platform-select"
            name="platform"
            value={values.platform}
            onChange={handleChange}
            className="form-control"
            disabled={isSaving}
          >
            <option value="twitter">Twitter / X (280 chars max)</option>
            <option value="linkedin">LinkedIn (3000 chars max)</option>
            <option value="instagram">Instagram (2200 chars max + hashtag required)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="post-content">Post Content</label>
          <textarea
            id="post-content"
            name="content"
            value={values.content}
            onChange={handleChange}
            placeholder={`What's on your mind? Compose your ${values.platform} post here...`}
            rows="6"
            className={`form-control textarea-field ${errorMessage ? 'is-invalid' : ''}`}
            disabled={isSaving}
          />
          
          <div className="textarea-footer">
            <div className="validation-error">
              {errorMessage && <span className="error-text">{errorMessage}</span>}
            </div>
            
            <div className={`char-counter ${isOverLimit ? 'limit-exceeded' : ''}`}>
              {values.content.length} / {limit}
            </div>
          </div>
        </div>

        <div className="button-group flex-end">
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-outline"
            disabled={isSaving}
          >
            Clear
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSaving || !isValid || values.content.trim() === ''}
          >
            {isSaving ? (
              <span className="loading-spinner">
                Saving {saveAttempts > 0 ? `(Attempt ${saveAttempts + 1}/3)...` : ''}
              </span>
            ) : (
              'Save Draft'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
