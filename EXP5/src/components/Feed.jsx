import { useState, useMemo } from 'react';
import PostCard from './PostCard';
import { PLATFORM_KEYS } from '../platforms';

export default function Feed({ posts, onDelete, onUpdate }) {
  const [filter, setFilter] = useState('All');

  const visible = useMemo(() => {
    const sorted = [...posts].sort((a, b) => b.id - a.id);
    if (filter === 'All') return sorted;
    return sorted.filter((p) => p.platform === filter);
  }, [posts, filter]);

  return (
    <section className="feed">
      <div className="feed-header">
        <h2>Broadcast history</h2>
        <div className="filter-row">
          {['All', ...PLATFORM_KEYS].map((key) => (
            <button
              key={key}
              className={`filter-pill ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="empty-state">Nothing here yet — your published posts will show up in this feed.</div>
      ) : (
        <div className="post-grid">
          {visible.map((post) => (
            <PostCard key={post.id} post={post} onDelete={onDelete} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </section>
  );
}
