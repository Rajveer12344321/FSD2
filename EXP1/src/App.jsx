import React, { useState, useEffect, useRef } from 'react';
import { PostComposer } from './components/PostComposer';
import { DraftList } from './components/DraftList';
import { IntervalCounter } from './components/IntervalCounter';
import { saveDraftMock, retry } from './utils/mockApi';

function App() {
  const [drafts, setDrafts] = useState([]);
  const [activeDraft, setActiveDraft] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveAttempts, setSaveAttempts] = useState(0);
  const [toast, setToast] = useState({ message: null, type: null });
  const toastTimeoutRef = useRef(null);

  // Load drafts from localStorage on mount
  useEffect(() => {
    try {
      const savedDrafts = localStorage.getItem('social_media_drafts');
      if (savedDrafts) {
        setDrafts(JSON.parse(savedDrafts));
      }
    } catch (e) {
      console.error('Failed to load drafts from localStorage', e);
    }
  }, []);

  const showToast = (message, type = 'info') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ message: null, type: null });
    }, 4000);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handleSaveDraft = async (draft, onSuccess) => {
    setIsSaving(true);
    setSaveAttempts(0);

    const apiCall = () => saveDraftMock(draft, 0.4); // 40% failure probability for testing retries

    try {
      // Execute save draft API call with retry logic (3 retries, 500ms delay)
      const response = await retry(
        apiCall,
        3,
        500,
        (remainingRetries, errMessage) => {
          const attemptNumber = 4 - remainingRetries;
          setSaveAttempts(attemptNumber);
          showToast(`Attempt ${attemptNumber} failed: ${errMessage}. Retrying...`, 'warning');
        }
      );

      // Save was successful
      let updatedDrafts;
      const draftExists = drafts.some((d) => d.id === draft.id);

      if (draftExists) {
        updatedDrafts = drafts.map((d) => (d.id === draft.id ? draft : d));
        showToast('Draft updated successfully!', 'success');
      } else {
        updatedDrafts = [draft, ...drafts];
        showToast('Draft created and saved successfully!', 'success');
      }

      setDrafts(updatedDrafts);
      localStorage.setItem('social_media_drafts', JSON.stringify(updatedDrafts));
      
      setActiveDraft(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      // Failed after all retries
      showToast(`Failed to save draft: ${error.message}. Please try again.`, 'error');
    } finally {
      setIsSaving(false);
      setSaveAttempts(0);
    }
  };

  const handleDeleteDraft = (id) => {
    const updatedDrafts = drafts.filter((draft) => draft.id !== id);
    setDrafts(updatedDrafts);
    localStorage.setItem('social_media_drafts', JSON.stringify(updatedDrafts));
    
    // If the draft being deleted was active, reset activeDraft state
    if (activeDraft && activeDraft.id === id) {
      setActiveDraft(null);
    }
    showToast('Draft deleted successfully.', 'info');
  };

  const handleEditDraft = (draft) => {
    setActiveDraft(draft);
    showToast(`Loaded draft for ${draft.platform.toUpperCase()}`, 'info');
  };

  const resetActiveDraft = () => {
    setActiveDraft(null);
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast.message && (
        <div className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toast.type === 'success' && '✅'}
              {toast.type === 'error' && '❌'}
              {toast.type === 'warning' && '⚠️'}
              {toast.type === 'info' && 'ℹ️'}
            </span>
            <span className="toast-text">{toast.message}</span>
          </div>
          <button onClick={() => setToast({ message: null, type: null })} className="toast-close">
            &times;
          </button>
        </div>
      )}

      <header className="app-header">
        <div className="header-logo">✍️</div>
        <div className="header-title-container">
          <h1>Social Media Post Composer</h1>
          <p>Multi-Platform Validation & Local Draft Management System</p>
        </div>
      </header>

      <main className="app-main">
        <div className="app-grid">
          {/* Left Column: Post Composer */}
          <div className="grid-column">
            <PostComposer
              activeDraft={activeDraft}
              onSaveDraft={handleSaveDraft}
              isSaving={isSaving}
              saveAttempts={saveAttempts}
              resetActiveDraft={resetActiveDraft}
            />
          </div>

          {/* Right Column: Saved Drafts & Educational Component */}
          <div className="grid-column flex-column">
            <DraftList
              drafts={drafts}
              onEditDraft={handleEditDraft}
              onDeleteDraft={handleDeleteDraft}
            />
            
            <IntervalCounter />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Lab Experiment 1 • Created with React & Vanilla CSS</p>
      </footer>
    </div>
  );
}

export default App;
