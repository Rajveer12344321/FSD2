import { useState, useEffect, useCallback } from 'react';
import './App.css';

// Backend API URL
const API_URL = 'http://localhost:8080/api/tasks';
const PAGE_SIZE = 5;

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination State
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = useCallback(async (targetPage) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(
        `${API_URL}?page=${targetPage}&size=${PAGE_SIZE}&sort=id,desc`
      );
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);

      const data = await response.json();
      const pages = Math.max(data.totalPages, 1);

      // If the current page no longer exists (e.g. last item deleted), step back.
      if (targetPage > pages - 1) {
        setPage(pages - 1);
        return;
      }
      setTasks(data.content);
      setTotalPages(pages);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Could not reach the backend. Make sure it is running on http://localhost:8080.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(page);
  }, [page, fetchTasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    const title = newTaskTitle.trim();
    if (!title) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, completed: false }),
      });
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      await response.json();
      setNewTaskTitle('');
      // New tasks are sorted first, so jump to page one.
      if (page === 0) fetchTasks(0);
      else setPage(0);
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Could not add the task. Is the backend running?');
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/toggle`, { method: 'PUT' });
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      const text = await response.text();
      if (!text) {
        // Task no longer exists on the server; refresh the list.
        fetchTasks(page);
        return;
      }
      const updatedTask = JSON.parse(text);
      setTasks((current) => current.map((task) => (task.id === id ? updatedTask : task)));
    } catch (err) {
      console.error('Error toggling task:', err);
      setError('Could not update the task. Is the backend running?');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      fetchTasks(page);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Could not delete the task. Is the backend running?');
    }
  };

  // Stats for the current page
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <main className="shell">
      <section className="board">
        <header className="masthead">
          <p className="eyebrow">Experiment 6</p>
          <h1 className="title">Student Task Manager</h1>
          <p className="subtitle">Scalable APIs &amp; Caching</p>
        </header>

        <div className="summary">
          <div className="summary-cell">
            <span className="summary-number">{tasks.length}</span>
            <span className="summary-label">Tasks</span>
          </div>
          <div className="summary-cell">
            <span className="summary-number is-done">{completedCount}</span>
            <span className="summary-label">Done</span>
          </div>
          <div className="summary-cell">
            <span className="summary-number is-pending">{pendingCount}</span>
            <span className="summary-label">Pending</span>
          </div>
        </div>

        <div
          className="progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Completion on this page"
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <form onSubmit={handleAddTask} className="composer">
          <input
            type="text"
            className="composer-input"
            placeholder="What needs to be done?"
            aria-label="New task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button type="submit" className="composer-button">
            Add task
          </button>
        </form>

        {error && (
          <div className="notice" role="alert">
            <span>{error}</span>
            <button className="notice-retry" onClick={() => fetchTasks(page)}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="state-block">
            <div className="spinner" />
            <p className="state-text">Fetching tasks from H2 Database...</p>
          </div>
        ) : (
          <>
            {tasks.length === 0 ? (
              !error && (
                <div className="state-block">
                  <div className="state-icon" aria-hidden="true">✓</div>
                  <p className="state-text">No tasks on this page. You're all caught up!</p>
                </div>
              )
            ) : (
              <ul className="list">
                {tasks.map((task) => (
                  <li key={task.id} className={`row ${task.completed ? 'is-complete' : ''}`}>
                    <button
                      className="row-main"
                      onClick={() => handleToggleTask(task.id)}
                      aria-pressed={task.completed}
                      title="Toggle completion"
                    >
                      <span className="tick" aria-hidden="true">
                        {task.completed && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      <span className="row-text">
                        <span className="row-title">{task.title}</span>
                        <span className="row-meta">ID: #{task.id} • Backend Data</span>
                      </span>
                    </button>
                    <button
                      className="row-delete"
                      onClick={() => handleDeleteTask(task.id)}
                      title="Delete Task"
                      aria-label={`Delete task ${task.title}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {totalPages > 1 && (
              <nav className="pager" aria-label="Pagination">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="pager-button"
                >
                  ← Prev
                </button>
                <span className="pager-status">
                  Page <strong>{page + 1}</strong> of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="pager-button"
                >
                  Next →
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default App;
