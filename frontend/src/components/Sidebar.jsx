import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  Users,
  BarChart2,
  Database,
  FileText,
  Settings,
  Info,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { name: 'Overview Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Upload & Data Cleaning', path: '/upload', icon: UploadCloud },
    { name: 'Customer Analytics', path: '/customers', icon: Users },
    { name: 'Shopping Patterns', path: '/shopping-patterns', icon: BarChart2 },
    { name: 'Data Explorer', path: '/data-explorer', icon: Database },
    { name: 'Reports Center', path: '/reports', icon: FileText },
  ];

  const bottomItems = [
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <ShoppingCart size={22} strokeWidth={2.5} />
        </div>
        <div className="brand-text">
          <h1>Retail Analytics</h1>
          <p>Customer Behavior & Trends</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
              end={item.path === '/'}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        <div className="sidebar-divider" />

        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-cart-graphic">
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', color: '#60A5FA' }}>
            <Sparkles size={16} />
            <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pro Analytics
            </span>
          </div>
          <p>FastAPI &amp; React Powered Intelligence Engine</p>
        </div>
      </div>
    </aside>
  );
}
