import React from 'react';
import { Menu, Search, Bell, Database } from 'lucide-react';

export default function Header({ onToggleSidebar, datasetInfo }) {
  const filename = datasetInfo?.filename || 'shopping_trends.csv';
  const isLoaded = Boolean(datasetInfo?.row_count);

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          className="hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="header-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search insights, categories, customers..."
            aria-label="Search"
          />
        </div>
      </div>

      <div className="header-right">
        {isLoaded && (
          <div className="dataset-badge">
            <Database size={14} color="#10B981" />
            <span style={{ color: '#065F46' }}>
              Dataset Loaded: <strong>{filename}</strong>
            </span>
          </div>
        )}

        <button className="notification-bell" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-badge">3</span>
        </button>

        <div className="user-profile">
          <div className="user-avatar">SN</div>
          <div className="user-info">
            <div className="user-name">Santosh</div>
            <div className="user-role">Data Analyst</div>
          </div>
        </div>
      </div>
    </header>
  );
}
