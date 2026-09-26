import { useState } from 'react';
import { PLATFORMS, PLATFORM_KEYS, countWords } from '../platforms';

export default function Composer({ onCreate, onError }) {
  const [platform, setPlatform] = useState(PLATFORM_KEYS[0]);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const limit = PLATFORMS[platform].limit;
  const words = countWords(content);
  const percent = Math.min(100, Math.round((words / limit) * 100));

  const handleChange = (e) => {
    const text = e.target.value;
    const words = countWords(text);

    if (words > limit) {
      onError(`${PLATFORMS[platform].label} caps posts at ${limit} words — trimmed to fit.`);
      const truncated = text.trim().split(/\s+/).slice(0, limit).join(' ');
      setContent(truncated + (text.endsWith(' ') ? ' ' : ''));
    } else {
      onError(null);
      setContent(text);
    }
  };

  const handlePlatformSwitch = (key) => {
    setPlatform(key);
    setContent('');
    onError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onCreate({ platform, content });
      setContent('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="composer">
      <h2>New broadcast</h2>

      <div className="platform-tabs">
        {PLATFORM_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className={`platform-tab ${platform === key ? 'active' : ''}`}
            style={{ '--accent': PLATFORMS[key].color }}
            onClick={() => handlePlatformSwitch(key)}
          >
            <span className="platform-icon">{PLATFORMS[key].icon}</span>
            {PLATFORMS[key].label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          rows="6"
          placeholder={`Write your ${PLATFORMS[platform].label} post…`}
          value={content}
          onChange={handleChange}
        />

        <div className="limit-track">
          <div
            className="limit-fill"
            style={{
              width: `${percent}%`,
              background: PLATFORMS[platform].color,
            }}
          />
        </div>
        <div className="limit-caption">
          {words} / {limit} words
        </div>

        <button type="submit" className="submit-btn" disabled={!content.trim() || submitting}>
          {submitting ? 'Posting…' : 'Publish post'}
        </button>
      </form>
    </section>
  );
}
