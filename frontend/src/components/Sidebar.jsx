import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Database,
  FileText,
  ChartNoAxesCombined,
} from "lucide-react";

const navigation = [
  { label: "Overview Dashboard", path: "/", icon: LayoutDashboard, end: true },
  { label: "Customer Analytics", path: "/customers", icon: Users },
  { label: "Shopping Patterns", path: "/shopping-patterns", icon: ShoppingBag },
  { label: "Data Explorer", path: "/data-explorer", icon: Database },
  { label: "Reports Center", path: "/reports", icon: FileText },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <ChartNoAxesCombined size={24} />
        </div>
        <div>
          <h2>Retail Analytics</h2>
          <p>Customer Insights</p>
        </div>
      </div>

      <p className="nav-heading">WORKSPACE</p>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="status-dot" />
        <span>Local Analytics Workspace</span>
      </div>
    </aside>
  );
}