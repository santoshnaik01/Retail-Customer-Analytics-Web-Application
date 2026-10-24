import { LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">WORKSPACE / OVERVIEW</span>
          <h1>Overview Dashboard</h1>
          <p>Your retail analytics workspace at a glance.</p>
        </div>
        <div className="page-icon"><LayoutDashboard size={25} /></div>
      </div>

      <div className="welcome-panel">
        <h2>Welcome to Retail Analytics</h2>
        <p>
          Explore customer behavior, shopping patterns, and retail data
          insights using the navigation menu.
        </p>
      </div>

      <div className="placeholder-grid">
        <div className="placeholder-card">
          <span>01</span><h3>Customer Insights</h3>
          <p>Customer analytics will be available here.</p>
        </div>
        <div className="placeholder-card">
          <span>02</span><h3>Shopping Behavior</h3>
          <p>Shopping pattern analysis will be available here.</p>
        </div>
        <div className="placeholder-card">
          <span>03</span><h3>Data & Reports</h3>
          <p>Data exploration and reporting will be available here.</p>
        </div>
      </div>
    </section>
  );
}