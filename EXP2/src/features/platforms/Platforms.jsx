// features/platforms/Platforms.jsx
//
// CRUD UI for platforms. Uses the adapter-generated selectors from
// platformSlice.js directly (platformsSelectors.selectAll), since platforms
// are a small, simple collection that doesn't need extra memoized selectors.

import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPlatform, updatePlatform, deletePlatform, platformsSelectors } from "./platformSlice";

function Platforms() {
  const dispatch = useDispatch();
  const platforms = useSelector(platformsSelectors.selectAll);

  const [name, setName] = useState("");
  const [color, setColor] = useState("#6C63FF");
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (!name.trim()) return;

      if (editingId) {
        dispatch(updatePlatform({ id: editingId, changes: { name, color } }));
        setEditingId(null);
      } else {
        dispatch(addPlatform(name, color));
      }
      setName("");
      setColor("#6C63FF");
    },
    [dispatch, editingId, name, color]
  );

  const handleEdit = useCallback((platform) => {
    setEditingId(platform.id);
    setName(platform.name);
    setColor(platform.color);
  }, []);

  const handleDelete = useCallback(
    (id) => {
      dispatch(deletePlatform(id));
      if (editingId === id) {
        setEditingId(null);
        setName("");
      }
    },
    [dispatch, editingId]
  );

  return (
    <section className="platforms-section">
      <form className="card platform-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Platform" : "Add Platform"}</h3>
        <label htmlFor="platform-name">Name</label>
        <input
          id="platform-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. TikTok"
          required
        />
        <label htmlFor="platform-color">Accent Color</label>
        <input
          id="platform-color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingId ? "Save Changes" : "Add Platform"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditingId(null);
                setName("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="platforms-list">
        {platforms.map((platform) => (
          <li key={platform.id} className="platform-item" style={{ borderLeftColor: platform.color }}>
            <span className="platform-name">{platform.name}</span>
            <div className="post-item-actions">
              <button className="btn btn-small" onClick={() => handleEdit(platform)}>
                Edit
              </button>
              <button
                className="btn btn-small btn-danger"
                onClick={() => handleDelete(platform.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Platforms;
