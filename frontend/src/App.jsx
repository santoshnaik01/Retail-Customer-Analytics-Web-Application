
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import ShoppingPatterns from "./pages/ShoppingPatterns";
import DataExplorer from "./pages/DataExplorer";
import Reports from "./pages/Reports";

function BackendHealthCheck() {
  const [health, setHealth] = useState({
    status: "checking",
    message: "Checking backend connection...",
  });

  useEffect(() => {
    const controller = new AbortController();

    async function checkBackend() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/health", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Backend returned HTTP ${response.status}`);
        }

        const data = await response.json();

        setHealth({
          status: "connected",
          message: "Backend connected successfully",
          data,
        });
      } catch (error) {
        if (error.name === "AbortError") return;

        setHealth({
          status: "error",
          message: "Unable to connect to the backend. Check that FastAPI is running.",
        });
      }
    }

    checkBackend();

    return () => controller.abort();
  }, []);

  return (
    <div
      role="status"
      style={{
        position: "fixed",
        bottom: 12,
        right: 12,
        zIndex: 9999,
        padding: "8px 12px",
        borderRadius: 8,
        background: health.status === "error" ? "#fee2e2" : "#f1f5f9",
        color: health.status === "error" ? "#991b1b" : "#334155",
        fontSize: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {health.message}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <BackendHealthCheck />

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
