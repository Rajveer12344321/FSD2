// components/Dashboard.jsx
//
// Landing dashboard: total posts, platform count, recent posts, a couple of
// analytics cards, and loading/error state surfaced directly from the posts
// slice. Everything here reads from already-memoized selectors, so the
// dashboard doesn't duplicate filtering/aggregation logic that lives in
// postSelectors.js.

import { useSelector } from "react-redux";
import { selectPostStatistics, selectRecentPosts } from "../features/posts/postSelectors";
import { selectPostsLoading, selectPostsError } from "../features/posts/postSelectors";

function Dashboard() {
  const stats = useSelector(selectPostStatistics);
  const recentPosts = useSelector(selectRecentPosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);

  return (
    <section className="dashboard-section">
      <h2>Dashboard</h2>

      {loading && <p className="status-message loading">Loading dashboard data...</p>}
      {error && <p className="status-message error">Error: {error}</p>}

      <div className="cards-grid">
        <div className="card stat-card">
          <span className="stat-label">Total Posts</span>
          <span className="stat-value">{stats.totalPosts}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Platform Count</span>
          <span className="stat-value">{stats.platformCount}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Short Posts</span>
          <span className="stat-value">{stats.shortPostCount}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Long Posts</span>
          <span className="stat-value">{stats.longPostCount}</span>
        </div>
      </div>

      <div className="card">
        <h3>Recent Posts</h3>
        {recentPosts.length === 0 && !loading ? (
          <p className="status-message empty">No posts yet -- add one from the Posts tab.</p>
        ) : (
          <ul className="recent-list">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <span className="platform-badge">{post.platform}</span>
                {post.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
