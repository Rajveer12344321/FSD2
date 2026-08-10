// components/Analytics.jsx
//
// Analytics view (Experiment 2.2 + Assignment 4). Every number here comes
// from a memoized reselect selector -- selectPostStatistics combines several
// other memoized selectors, so none of this re-scans the post list unless
// the underlying posts actually changed.

import { useSelector } from "react-redux";
import {
  selectPostStatistics,
  selectPostCountByPlatform,
  selectRecentPosts
} from "../features/posts/postSelectors";

function Analytics() {
  const stats = useSelector(selectPostStatistics);
  const countByPlatform = useSelector(selectPostCountByPlatform);
  const recentPosts = useSelector(selectRecentPosts);

  return (
    <section className="analytics-section">
      <h2>Analytics</h2>

      <div className="cards-grid">
        <div className="card stat-card">
          <span className="stat-label">Total Posts</span>
          <span className="stat-value">{stats.totalPosts}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Avg. Content Length</span>
          <span className="stat-value">{stats.averageContentLength}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Short Posts (&lt;100 chars)</span>
          <span className="stat-value">{stats.shortPostCount}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Long Posts (&ge;100 chars)</span>
          <span className="stat-value">{stats.longPostCount}</span>
        </div>
      </div>

      <div className="card">
        <h3>Posts per Platform</h3>
        <ul className="platform-breakdown">
          {Object.entries(countByPlatform).map(([platform, count]) => (
            <li key={platform}>
              <span>{platform}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${Math.min(100, count * 20)}%` }}
                />
              </div>
              <strong>{count}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3>Recent Posts</h3>
        <ul className="recent-list">
          {recentPosts.map((post) => (
            <li key={post.id}>
              <span className="platform-badge">{post.platform}</span>
              {post.title}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Analytics;
