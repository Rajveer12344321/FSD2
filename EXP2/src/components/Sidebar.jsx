// components/Sidebar.jsx
//
// Sidebar: quick-glance summary using the same memoized statistics selector
// that powers the Analytics view, plus a platform color legend. Reading from
// the memoized selector here means the sidebar re-renders based on actual
// data changes, not on every keystroke elsewhere in the app.

import { useSelector } from "react-redux";
import { selectPostStatistics } from "../features/posts/postSelectors";
import { platformsSelectors } from "../features/platforms/platformSlice";

function Sidebar() {
  const stats = useSelector(selectPostStatistics);
  const platforms = useSelector(platformsSelectors.selectAll);

  return (
    <aside className="sidebar">
      <div className="sidebar-block">
        <h4>Quick Stats</h4>
        <ul className="sidebar-stat-list">
          <li>
            <span>Total Posts</span>
            <strong>{stats.totalPosts}</strong>
          </li>
          <li>
            <span>Platforms</span>
            <strong>{stats.platformCount}</strong>
          </li>
          <li>
            <span>Avg. Length</span>
            <strong>{stats.averageContentLength}</strong>
          </li>
        </ul>
      </div>

      <div className="sidebar-block">
        <h4>Platform Legend</h4>
        <ul className="sidebar-platform-list">
          {platforms.map((platform) => (
            <li key={platform.id}>
              <span className="color-dot" style={{ backgroundColor: platform.color }} />
              {platform.name}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
