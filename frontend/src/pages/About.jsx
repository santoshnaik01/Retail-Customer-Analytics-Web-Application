import React from 'react';
import {
  Info,
  Code2,
  Server,
  Layers,
  Users2,
  Terminal,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { api } from '../services/api';
import { useDataset } from '../layouts/AppLayout';

export default function About() {
  const { datasetInfo, refreshDataset } = useDataset();

  const handleReset = async () => {
    try {
      await api.resetDataset();
      await refreshDataset();
      alert('Dataset reset to default shopping_trends.csv successfully!');
    } catch (err) {
      alert(`Error resetting dataset: ${err.message}`);
    }
  };

  const techStack = [
    { name: 'React 19 + Vite', type: 'Frontend Framework', color: '#06B6D4' },
    { name: 'FastAPI (Python 3.11)', type: 'High-Performance API Backend', color: '#10B981' },
    { name: 'Pandas & NumPy', type: 'Data Science & Cleaning Pipeline', color: '#1769FF' },
    { name: 'Plotly.js', type: 'Interactive Visualizations', color: '#7C3AED' },
    { name: 'ReportLab', type: 'Executive PDF Generation Engine', color: '#EF4444' },
    { name: 'Pytest & HTTPX', type: 'Automated Test Suite', color: '#F59E0B' },
  ];

  const team = [
    {
      name: 'Pratap',
      role: 'Frontend Development Engineer',
      duties:
        'React architecture, responsive sidebar & navigation, interactive Plotly charts, KPI cards, filter panel, and Data Explorer.',
    },
    {
      name: 'Sarswati',
      role: 'Backend Development Engineer',
      duties:
        'FastAPI API endpoints, CSV file upload & validation, data cleaning pipeline, ReportLab PDF generation, and CSV export services.',
    },
    {
      name: 'Santosh',
      role: 'Data Analysis & QA Testing Engineer',
      duties:
        'Dataset inspection, data quality verification, KPI correctness, Pytest automated testing, and analytical documentation.',
    },
  ];

  return (
    <div>
      <div className="welcome-banner">
        <h1>Settings &amp; Project Documentation</h1>
        <p>System architecture, development environment, team responsibilities, and runtime details</p>
      </div>

      {/* Tech Stack Overview */}
      <div className="chart-card" style={{ marginBottom: '24px' }}>
        <div className="chart-card-header">
          <div className="chart-card-title">
            <Layers size={18} className="title-icon" />
            <h3>Mandatory Technology Stack</h3>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {techStack.map((tech, i) => (
            <div
              key={i}
              style={{
                padding: '16px',
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                borderLeft: `4px solid ${tech.color}`,
              }}
            >
              <h4 style={{ fontSize: '14.5px', fontWeight: '700', color: '#0F172A' }}>{tech.name}</h4>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>{tech.type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Responsibilities */}
      <div className="chart-card" style={{ marginBottom: '24px' }}>
        <div className="chart-card-header">
          <div className="chart-card-title">
            <Users2 size={18} className="title-icon" color="#7C3AED" />
            <h3>Project Team Responsibilities</h3>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {team.map((member, i) => (
            <div
              key={i}
              style={{
                padding: '18px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E8EEF5',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#EFF6FF',
                    color: '#1769FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '13px',
                  }}
                >
                  {member.name[0]}
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>{member.name}</h4>
                  <div style={{ fontSize: '11px', color: '#1769FF', fontWeight: '600' }}>{member.role}</div>
                </div>
              </div>
              <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.5' }}>{member.duties}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Local Setup & Run Commands */}
      <div className="chart-card" style={{ marginBottom: '24px' }}>
        <div className="chart-card-header">
          <div className="chart-card-title">
            <Terminal size={18} className="title-icon" color="#10B981" />
            <h3>Local Execution Commands</h3>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Backend Run */}
          <div style={{ padding: '16px', backgroundColor: '#0B1735', borderRadius: '10px', color: '#E2E8F0' }}>
            <h4 style={{ fontSize: '13px', color: '#38BDF8', fontWeight: '700', marginBottom: '8px' }}>
              Backend (FastAPI)
            </h4>
            <pre style={{ fontSize: '12px', fontFamily: 'Consolas, monospace', lineHeight: '1.6' }}>
              {`cd backend\npython -m venv venv\nvenv\\Scripts\\activate\npip install -r requirements.txt\npython -m uvicorn app.main:app --reload`}
            </pre>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '10px' }}>
              Runs at: <code>http://localhost:8000</code> &bull; Swagger: <code>http://localhost:8000/docs</code>
            </div>
          </div>

          {/* Frontend Run */}
          <div style={{ padding: '16px', backgroundColor: '#0B1735', borderRadius: '10px', color: '#E2E8F0' }}>
            <h4 style={{ fontSize: '13px', color: '#38BDF8', fontWeight: '700', marginBottom: '8px' }}>
              Frontend (React + Vite)
            </h4>
            <pre style={{ fontSize: '12px', fontFamily: 'Consolas, monospace', lineHeight: '1.6' }}>
              {`cd frontend\nnpm install\nnpm run dev`}
            </pre>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '10px' }}>
              Runs at: <code>http://localhost:5173</code>
            </div>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div
        style={{
          padding: '20px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8EEF5',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>Dataset Session State</h4>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Currently loaded: <strong>{datasetInfo?.filename || 'shopping_trends.csv'}</strong> (
            {datasetInfo?.row_count?.toLocaleString()} records)
          </p>
        </div>

        <button
          onClick={handleReset}
          style={{
            padding: '10px 18px',
            backgroundColor: '#F1F5F9',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            color: '#334155',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <RotateCcw size={16} />
          <span>Reset to Default Dataset</span>
        </button>
      </div>
    </div>
  );
}
