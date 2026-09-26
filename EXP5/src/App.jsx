import { useEffect, useState, useCallback } from 'react';
import Composer from './components/Composer';
import Feed from './components/Feed';
import Toast from './components/Toast';
import { fetchPosts, createPost, updatePost, deletePost } from './api';

function App() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    try {
      const data = await fetchPosts();
      setPosts(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load posts', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCreate = async (payload) => {
    try {
      await createPost(payload);
      await loadPosts();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      await updatePost(id, payload);
      await loadPosts();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      await loadPosts();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="shell">
      <Toast message={error} onDismiss={() => setError(null)} />

      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">B</span>
          <span className="brand-name">Broadcastr</span>
        </div>
        <p className="brand-tagline">
          One draft. Every platform. Broadcastr keeps every post inside its
          platform's word limit automatically.
        </p>
        <ul className="stat-list">
          <li>
            <span className="stat-value">{posts.length}</span>
            <span className="stat-label">Total posts</span>
          </li>
        </ul>
      </aside>

      <main className="content">
        <Composer onCreate={handleCreate} onError={setError} />
        {loading ? (
          <div className="empty-state">Loading your posts…</div>
        ) : error && posts.length === 0 ? (
          <div className="empty-state">
            <p>{error}</p>
            <button className="retry-btn" onClick={loadPosts}>
              Retry connection
            </button>
          </div>
        ) : (
          <Feed posts={posts} onDelete={handleDelete} onUpdate={handleUpdate} />
        )}
      </main>
    </div>
  );
}

export default App;
