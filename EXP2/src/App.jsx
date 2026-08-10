// App.jsx
//
// Root application shell. Uses simple local state for tab switching instead
// of a router, since the PDF's scope doesn't call for routing -- keeps the
// project dependency list limited to exactly what's specified.

import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import PerformanceDemo from "./components/PerformanceDemo";
import Posts from "./features/posts/Posts";
import Platforms from "./features/platforms/Platforms";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Renders the view for the currently active tab.
  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "posts":
        return <Posts />;
      case "platforms":
        return <Platforms />;
      case "analytics":
        return <Analytics />;
      case "performance":
        return <PerformanceDemo />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-shell">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">{renderActiveTab()}</main>
      </div>
    </div>
  );
}

export default App;
