import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  BarChart3,
  Download,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import { useDataset } from '../layouts/AppLayout';

export default function Reports() {
  const { datasetInfo } = useDataset();
  const [downloading, setDownloading] = useState(null);

  const handleDownload = (type, url) => {
    setDownloading(type);
    window.open(url, '_blank');
    setTimeout(() => setDownloading(null), 1500);
  };

  return (
    <div>
      <div className="welcome-banner">
        <h1>Reports Center</h1>
        <p>Generate, export, and download authoritative analytics reports and cleaned dataset files</p>
      </div>

      {/* 3 Main Report Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {/* Card 1: PDF Report */}
        <div
          className="chart-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '4px solid #EF4444',
          }}
        >
          <div>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                backgroundColor: '#FEF2F2',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <FileText size={28} />
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
              Analytics Report (PDF)
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
              Comprehensive executive report formatted with ReportLab. Includes executive KPIs, category breakdown,
              demographic matrices, top product rankings, and business insights.
            </p>
          </div>

          <div style={{ marginTop: '24px' }}>
            <button
              onClick={() => handleDownload('pdf', api.getPdfReportUrl(true))}
              disabled={downloading === 'pdf'}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
              }}
            >
              <Download size={16} />
              <span>{downloading === 'pdf' ? 'Preparing PDF...' : 'Download PDF Report'}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Cleaned Dataset CSV */}
        <div
          className="chart-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '4px solid #10B981',
          }}
        >
          <div>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                backgroundColor: '#ECFDF5',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <FileSpreadsheet size={28} />
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
              Cleaned Dataset (CSV)
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
              Download the fully cleaned and standardized dataset. All 37 missing ratings imputed, strings trimmed of
              whitespace, and strict numeric schemas validated.
            </p>
          </div>

          <div style={{ marginTop: '24px' }}>
            <button
              onClick={() => handleDownload('cleaned_csv', api.getCleanedCsvUrl())}
              disabled={downloading === 'cleaned_csv'}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
              }}
            >
              <Download size={16} />
              <span>{downloading === 'cleaned_csv' ? 'Exporting...' : 'Export Cleaned CSV'}</span>
            </button>
          </div>
        </div>

        {/* Card 3: Summary Analytics CSV */}
        <div
          className="chart-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '4px solid #1769FF',
          }}
        >
          <div>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                backgroundColor: '#EFF6FF',
                color: '#1769FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <BarChart3 size={28} />
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
              Summary Analytics (CSV)
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
              Structured aggregated CSV containing executive summary KPIs, category spend totals, customer age bracket
              demographics, and complete 25-item product rankings.
            </p>
          </div>

          <div style={{ marginTop: '24px' }}>
            <button
              onClick={() => handleDownload('summary_csv', api.getSummaryCsvUrl(true))}
              disabled={downloading === 'summary_csv'}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#1769FF',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(23, 105, 255, 0.25)',
              }}
            >
              <Download size={16} />
              <span>{downloading === 'summary_csv' ? 'Generating...' : 'Export Summary CSV'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dataset Metadata Details */}
      <div className="chart-card" style={{ marginBottom: '24px' }}>
        <div className="chart-card-header">
          <div className="chart-card-title">
            <ShieldCheck size={18} className="title-icon" color="#10B981" />
            <h3>Active Dataset Verification</h3>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>ACTIVE FILE</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', marginTop: '4px' }}>
              {datasetInfo?.filename || 'shopping_trends.csv'}
            </div>
          </div>
          <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>TOTAL TRANSACTIONS</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', marginTop: '4px' }}>
              {datasetInfo?.row_count?.toLocaleString() || '3,900'} rows
            </div>
          </div>
          <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>ATTRIBUTES TRACKED</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', marginTop: '4px' }}>
              {datasetInfo?.column_count || '18'} columns
            </div>
          </div>
          <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>CLEANING STATUS</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#10B981', marginTop: '4px' }}>
              {datasetInfo?.is_cleaned ? 'Active & Standardized' : 'Raw Input'}
            </div>
          </div>
        </div>
      </div>

      {/* Analytical Limitations Card */}
      <div
        style={{
          padding: '20px 24px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8EEF5',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Info size={18} color="#1769FF" />
          <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>
            Methodological Transparency &amp; Analytical Restrictions
          </h4>
        </div>
        <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
          <strong>No Transaction Dates:</strong> The underlying retail dataset does not contain transaction date columns.
          Therefore, chronological daily/weekly/monthly time-series are strictly omitted to maintain analytical integrity.
          The <code>Season</code> column is analyzed as an independent seasonal attribute.
          <br />
          <strong>Distinct Customers vs Records:</strong> Customer IDs (1 through 3,900) correspond to distinct purchase
          records in this dataset. Metrics accurately reflect purchase totals without claiming audited enterprise corporate revenue.
        </p>
      </div>
    </div>
  );
}
