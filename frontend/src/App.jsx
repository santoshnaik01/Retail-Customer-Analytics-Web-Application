import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import ShoppingPatterns from "./pages/ShoppingPatterns";
import DataExplorer from "./pages/DataExplorer";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route
            path="shopping-patterns"
            element={<ShoppingPatterns />}
          />
          <Route path="data-explorer" element={<DataExplorer />} />
          <Route path="reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
