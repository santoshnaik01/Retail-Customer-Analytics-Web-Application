import { Bell, Menu, Search } from "lucide-react";

export default function Header({ onToggleSidebar }) {
  return (
    <header className="top-header">
      <button
        className="icon-button mobile-menu"
        onClick={onToggleSidebar}
        aria-label="Toggle navigation"
      >
        <Menu size={21} />
      </button>

      <div className="header-title">
        <h2>Retail Customer Analytics</h2>
        <p>Customer behavior and shopping insights</p>
      </div>

      <div className="header-actions">
        <label className="search-box">
          <Search size={17} />
          <input
            type="search"
            placeholder="Search pages..."
            aria-label="Search pages"
          />
        </label>

        <button
          className="icon-button notification-button"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={19} />
        </button>

        <div className="user-avatar" title="Local workspace">
          RA
        </div>
      </div>
    </header>
  );
}