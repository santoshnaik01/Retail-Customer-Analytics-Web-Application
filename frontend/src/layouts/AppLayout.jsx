import React, { useState, useEffect, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { api } from '../services/api';

export const DatasetContext = createContext(null);

export function useDataset() {
  return useContext(DatasetContext);
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDatasetSummary = async () => {
    try {
      setLoading(true);
      const summary = await api.getDatasetSummary();
      setDatasetInfo(summary);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch dataset summary:', err);
      setError(err.message || 'Failed to connect to backend analytics server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasetSummary();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <DatasetContext.Provider value={{ datasetInfo, refreshDataset: fetchDatasetSummary, loading, error }}>
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-wrapper">
          <Header onToggleSidebar={toggleSidebar} datasetInfo={datasetInfo} />
          {error && (
            <div
              style={{
                margin: '16px 32px 0 32px',
                padding: '12px 18px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '8px',
                color: '#991B1B',
                fontSize: '13px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>
                <strong>Connection Alert:</strong> {error}. Ensure FastAPI backend is running on <code>http://localhost:8000</code>.
              </span>
              <button
                onClick={fetchDatasetSummary}
                style={{
                  background: '#DC2626',
                  color: '#FFF',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
            </div>
          )}
          <main className="page-content">
            <Outlet />
          </main>
        </div>
      </div>
    </DatasetContext.Provider>
  );
}
