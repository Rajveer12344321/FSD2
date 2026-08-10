// components/Navbar.jsx
//
// Top navigation bar. Purely presentational -- receives the active tab and
// a setter from App.jsx rather than owning its own routing state.

function Navbar({ activeTab, onTabChange }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "posts", label: "Posts" },
    { id: "platforms", label: "Platforms" },
    { id: "analytics", label: "Analytics" },
    { id: "performance", label: "Performance Demo" }
  ];

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="brand-mark">◆</span>
        <span>Content State Manager</span>
      </div>
      <nav className="navbar-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`navbar-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
