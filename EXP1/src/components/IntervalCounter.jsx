import React, { useState, useEffect } from 'react';

/**
 * Educational Component demonstrating prevention of stale closures and memory leaks.
 * - Prevents stale closures by using a functional state updater `setCount(prev => prev + 1)`.
 * - Prevents memory leaks by returning a cleanup function that clears the interval.
 */
export const IntervalCounter = () => {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    // Correct implementation: Functional state updater and interval cleanup on unmount/dependency change
    const id = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    return () => {
      // Cleanup to prevent memory leaks when active state toggles or component unmounts
      clearInterval(id);
    };
  }, [isActive]);

  const toggleCounter = () => {
    setIsActive(!isActive);
  };

  const resetCounter = () => {
    setCount(0);
  };

  return (
    <div className="card educational-card">
      <div className="card-header">
        <h3>Section 10 Demo: Stale Closures & Memory Leaks</h3>
        <span className="badge badge-info">Lab Requirement</span>
      </div>
      
      <div className="counter-container">
        <div className="counter-value">{count}</div>
        <div className="counter-label">seconds active</div>
      </div>

      <div className="button-group">
        <button 
          onClick={toggleCounter} 
          className={`btn ${isActive ? 'btn-secondary' : 'btn-primary'}`}
        >
          {isActive ? 'Pause Counter' : 'Resume Counter'}
        </button>
        <button onClick={resetCounter} className="btn btn-outline">
          Reset
        </button>
      </div>

      <div className="educational-notes">
        <h4>How this satisfies requirements:</h4>
        <ul>
          <li>
            <strong>Memory Leak Prevention:</strong> When paused or unmounted, the returned <code>clearInterval(id)</code> executes, tearing down the browser runtime timer.
          </li>
          <li>
            <strong>Stale Closure Avoidance:</strong> By using <code>prevCount =&gt; prevCount + 1</code>, React references the latest internal state queue instead of capturing a stale <code>count = 0</code> on render.
          </li>
        </ul>
      </div>
    </div>
  );
};
