// components/PerformanceDemo.jsx
//
// Assignment 5: Performance Optimization demo.
//
// A ticking counter forces this component (the parent) to re-render once a
// second regardless of any Redux state change. NonOptimizedList re-renders
// on every single tick because it has no React.memo and derives its data
// with a plain (non-memoized) selector. OptimizedList is protected by
// React.memo + a createSelector-memoized selector + useMemo/useCallback,
// so its render count grows far more slowly -- only when the underlying
// post data actually changes (add/edit/delete), not on every tick.
//
// Compare the "Renders so far" counters on each card after letting this
// tab sit open for ~10 seconds.

import { useState, useEffect } from "react";
import NonOptimizedList from "./NonOptimizedList";
import OptimizedList from "./OptimizedList";

function PerformanceDemo() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="performance-section">
      <h2>Performance Optimization Demo</h2>
      <p className="performance-explainer">
        This parent re-renders every second (tick: <strong>{tick}</strong>) to simulate
        unrelated UI state changing elsewhere in a real app. Watch how the two lists below
        respond differently to that same forced re-render.
      </p>

      <div className="performance-grid">
        <NonOptimizedList />
        <OptimizedList />
      </div>
    </section>
  );
}

export default PerformanceDemo;
