import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={sidebarOpen ? "sidebar-shell open" : "sidebar-shell"}>
        <Sidebar />
      </div>

      <div className="main-wrapper">
        <Header onToggleSidebar={() => setSidebarOpen((open) => !open)} />

        <main className="page-content" onClick={() => setSidebarOpen(false)}>
          <Outlet />
        </main>

        <footer className="app-footer">
          Retail Customer Analytics · Local Workspace
        </footer>
      </div>
    </div>
  );
}