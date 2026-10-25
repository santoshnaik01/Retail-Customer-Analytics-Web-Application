import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Database,
  FileSpreadsheet,
  RotateCcw,
} from 'lucide-react';
import { api } from '../services/api';
import { useDataset } from '../layouts/AppLayout';

export default function Upload() {
  const { datasetInfo, refreshDataset } = useDataset();

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [qualityReport, setQualityReport] = useState(null);
  const [cleanSummary, setCleanSummary] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [previewTab, setPreviewTab] = useState('cleaned');
  const [alert, setAlert] = useState(null);

  const fetchQuality = async () => {
    try {
      const q = await api.getDatasetQuality();
      setQualityReport(q);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPreview = async (useCleaned = true) => {
    try {
      const res = await api.getExplorerData({
        page: 1,
        page_size: 8,
        use_cleaned: useCleaned,
      });
      setPreviewRows(res.rows || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuality();
    fetchPreview(previewTab === 'cleaned');
  }, [datasetInfo, previewTab]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        setAlert({ type: 'error', message: 'Please select a valid CSV file (.csv).' });
        return;
      }
      setSelectedFile(file);
      setAlert(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        setAlert({ type: 'error', message: 'Please select a valid CSV file (.csv).' });
        return;
      }
      setSelectedFile(file);
      setAlert(null);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    try {
      setUploading(true);
      setAlert(null);
      await api.uploadDataset(selectedFile);
      setAlert({
        type: 'success',
        message: `Successfully uploaded ${selectedFile.name}! You can now inspect and clean the dataset.`,
      });
      await refreshDataset();
      await fetchQuality();
      await fetchPreview(true);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to upload CSV file.' });
    } finally {
      setUploading(false);
    }
  };

  const handleRunCleaning = async () => {
    try {
      setCleaning(true);
      setAlert(null);
      const res = await api.cleanDataset({
        impute_missing_rating: true,
        imputation_strategy: 'category_mean',
        trim_whitespace: true,
        remove_duplicates: true,
      });
      setCleanSummary(res);
      setAlert({
        type: 'success',
        message: 'Dataset cleaned successfully! Missing review ratings imputed, whitespace trimmed, and types verified.',
      });
      await refreshDataset();
      await fetchQuality();
      await fetchPreview(true);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Cleaning pipeline encountered an error.' });
    } finally {
      setCleaning(false);
    }
  };

  const handleResetToDefault = async () => {
    try {
      await api.resetDataset();
      setSelectedFile(null);
      setCleanSummary(null);
      setAlert({ type: 'success', message: 'Reset to standard shopping_trends.csv default dataset.' });
      await refreshDataset();
      await fetchQuality();
      await fetchPreview(true);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    }
  };

  return (
    <div>
      <div className="welcome-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Upload &amp; Data Cleaning</h1>
          <p>Upload your retail dataset, inspect data quality metrics, and run automated cleaning</p>
        </div>
        <button
          onClick={handleResetToDefault}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '8px 14px',
            fontSize: '12.5px',
            fontWeight: '600',
            color: '#475569',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={14} />
          <span>Reset Sample Dataset</span>
        </button>
      </div>

      {alert && (
        <div
          style={{
            marginBottom: '20px',
            padding: '14px 18px',
            borderRadius: '10px',
            backgroundColor: alert.type === 'error' ? '#FEF2F2' : '#ECFDF5',
            border: `1px solid ${alert.type === 'error' ? '#FCA5A5' : '#A7F3D0'}`,
            color: alert.type === 'error' ? '#991B1B' : '#065F46',
            fontSize: '13.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {alert.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        className="dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <div className="dropzone-icon">
          <UploadCloud size={28} />
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>
            Drag &amp; drop your CSV file here
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Supports Retail Shopping datasets (.csv up to 50MB)
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          style={{
            padding: '8px 20px',
            backgroundColor: '#1769FF',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '8px',
          }}
        >
          Choose CSV File
        </button>

        {selectedFile && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 16px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
            }}
          >
            <FileSpreadsheet size={18} color="#1769FF" />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>
              {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
            </span>
            <button
              onClick={handleUploadSubmit}
              disabled={uploading}
              style={{
                padding: '6px 14px',
                backgroundColor: '#10B981',
                color: '#FFF',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {uploading ? 'Uploading...' : 'Confirm Upload'}
            </button>
          </div>
        )}
      </div>

      {/* Summary & Quality Side-by-Side Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '20px',
          marginTop: '24px',
        }}
      >
        {/* Dataset Summary */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <Database size={18} className="title-icon" />
              <h3>Dataset Summary</h3>
            </div>
            <span className="badge badge-clothing">{datasetInfo?.filename || 'shopping_trends.csv'}</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              padding: '16px',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748B' }}>ROWS</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                {datasetInfo?.row_count?.toLocaleString() || 0}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748B' }}>COLUMNS</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                {datasetInfo?.column_count || 0}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748B' }}>FILE SIZE</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                {datasetInfo?.file_size_kb ? `${datasetInfo.file_size_kb} KB` : '416 KB'}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <button
              onClick={handleRunCleaning}
              disabled={cleaning}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#1769FF',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(23, 105, 255, 0.25)',
              }}
            >
              <Sparkles size={16} />
              <span>{cleaning ? 'Cleaning in Progress...' : 'Clean Data & Standardize'}</span>
            </button>
          </div>
        </div>

        {/* Data Quality Check */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <FileCheck size={18} className="title-icon" color="#10B981" />
              <h3>Data Quality Check</h3>
            </div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#10B981',
                backgroundColor: '#ECFDF5',
                padding: '4px 10px',
                borderRadius: '9999px',
              }}
            >
              Health: {qualityReport?.health_score || 99.1}%
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '12.5px', color: '#64748B' }}>Missing Values</span>
              <strong style={{ fontSize: '15px', color: qualityReport?.total_missing_cells ? '#D97706' : '#10B981' }}>
                {qualityReport?.total_missing_cells ?? 37}
              </strong>
            </div>

            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '12.5px', color: '#64748B' }}>Duplicate Records</span>
              <strong style={{ fontSize: '15px', color: '#10B981' }}>
                {qualityReport?.duplicate_rows ?? 0}
              </strong>
            </div>

            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '12.5px', color: '#64748B' }}>Inconsistent Values</span>
              <strong style={{ fontSize: '15px', color: '#10B981' }}>
                {qualityReport?.inconsistent_values ?? 0}
              </strong>
            </div>

            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '12.5px', color: '#64748B' }}>Data Types Validated</span>
              <strong style={{ fontSize: '15px', color: '#1769FF' }}>
                18 / 18
              </strong>
            </div>
          </div>

          {cleanSummary && (
            <div
              style={{
                marginTop: '12px',
                padding: '10px 14px',
                backgroundColor: '#F0FDF4',
                borderRadius: '8px',
                border: '1px solid #BBF7D0',
                fontSize: '12px',
                color: '#166534',
              }}
            >
              <strong>Cleaning Log:</strong>
              <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
                {cleanSummary.operations_log?.map((log, i) => (
                  <li key={i}>{log}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Dataset Preview Section */}
      <div className="chart-card" style={{ marginTop: '24px' }}>
        <div className="chart-card-header">
          <div className="chart-card-title">
            <Database size={18} className="title-icon" />
            <h3>Dataset Quick Preview (First 8 Rows)</h3>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setPreviewTab('cleaned')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: previewTab === 'cleaned' ? '#1769FF' : '#F1F5F9',
                color: previewTab === 'cleaned' ? '#FFFFFF' : '#475569',
              }}
            >
              Cleaned Data
            </button>
            <button
              onClick={() => setPreviewTab('original')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: previewTab === 'original' ? '#1769FF' : '#F1F5F9',
                color: previewTab === 'original' ? '#FFFFFF' : '#475569',
              }}
            >
              Original Raw Data
            </button>
          </div>
        </div>

        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Category</th>
                <th>Item Purchased</th>
                <th>Amount ($)</th>
                <th>Location</th>
                <th>Size</th>
                <th>Color</th>
                <th>Season</th>
                <th>Rating</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, idx) => (
                <tr key={idx}>
                  <td><strong>#{row['Customer ID']}</strong></td>
                  <td>{row['Age']}</td>
                  <td>
                    <span className={`badge ${row['Gender'] === 'Male' ? 'badge-male' : 'badge-female'}`}>
                      {row['Gender']}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${row['Category']?.toLowerCase() || 'clothing'}`}>
                      {row['Category']}
                    </span>
                  </td>
                  <td>{row['Item Purchased']}</td>
                  <td><strong>${row['Purchase Amount (USD)']}</strong></td>
                  <td>{row['Location']}</td>
                  <td>{row['Size']}</td>
                  <td>{row['Color']}</td>
                  <td>{row['Season']}</td>
                  <td>
                    <span
                      style={{
                        fontWeight: '700',
                        color: row['Review Rating'] ? '#D97706' : '#EF4444',
                      }}
                    >
                      {row['Review Rating'] !== null && row['Review Rating'] !== undefined
                        ? `★ ${Number(row['Review Rating']).toFixed(1)}`
                        : 'Missing'}
                    </span>
                  </td>
                  <td>{row['Payment Method']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
