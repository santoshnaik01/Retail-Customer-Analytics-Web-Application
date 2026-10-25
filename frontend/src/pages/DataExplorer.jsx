import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  ArrowUpDown,
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
} from 'lucide-react';
import { api } from '../services/api';
import { useDataset } from '../layouts/AppLayout';

export default function DataExplorer() {
  const { datasetInfo } = useDataset();

  const [loading, setLoading] = useState(true);
  const [useCleaned, setUseCleaned] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('Customer ID');
  const [sortDirection, setSortDirection] = useState('asc');

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [seasonFilter, setSeasonFilter] = useState('All');

  const [dataResponse, setDataResponse] = useState({
    total_rows: 0,
    page: 1,
    page_size: 10,
    total_pages: 1,
    columns: [],
    rows: [],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.getExplorerData({
        page,
        page_size: pageSize,
        search_query: searchQuery,
        sort_column: sortColumn,
        sort_direction: sortDirection,
        use_cleaned: useCleaned,
        category_filter: categoryFilter,
        gender_filter: genderFilter,
        season_filter: seasonFilter,
      });
      setDataResponse(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, sortColumn, sortDirection, useCleaned, categoryFilter, genderFilter, seasonFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleSort = (col) => {
    if (sortColumn === col) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
    setPage(1);
  };

  const filterOptions = datasetInfo?.available_filters || {};

  const startRecord = (dataResponse.page - 1) * dataResponse.page_size + 1;
  const endRecord = Math.min(dataResponse.page * dataResponse.page_size, dataResponse.total_rows);

  return (
    <div>
      <div className="welcome-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Data Explorer</h1>
          <p>Search, sort, filter, and inspect cleaned and original retail transaction records</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              setUseCleaned(true);
              setPage(1);
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: useCleaned ? '#1769FF' : '#FFFFFF',
              color: useCleaned ? '#FFFFFF' : '#475569',
              boxShadow: useCleaned ? '0 4px 12px rgba(23, 105, 255, 0.25)' : 'none',
              border: useCleaned ? 'none' : '1px solid #CBD5E1',
            }}
          >
            Cleaned Dataset
          </button>
          <button
            onClick={() => {
              setUseCleaned(false);
              setPage(1);
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: !useCleaned ? '#1769FF' : '#FFFFFF',
              color: !useCleaned ? '#FFFFFF' : '#475569',
              boxShadow: !useCleaned ? '0 4px 12px rgba(23, 105, 255, 0.25)' : 'none',
              border: !useCleaned ? 'none' : '1px solid #CBD5E1',
            }}
          >
            Original Raw Dataset
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8EEF5',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
          marginBottom: '20px',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: '1', minWidth: '260px', maxWidth: '420px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search records by ID, item, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 14px 8px 36px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#1769FF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
          >
            <option value="All">All Categories</option>
            {filterOptions.categories?.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            value={genderFilter}
            onChange={(e) => {
              setGenderFilter(e.target.value);
              setPage(1);
            }}
            style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
          >
            <option value="All">All Genders</option>
            {filterOptions.genders?.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {/* Season Filter */}
          <select
            value={seasonFilter}
            onChange={(e) => {
              setSeasonFilter(e.target.value);
              setPage(1);
            }}
            style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
          >
            <option value="All">All Seasons</option>
            {filterOptions.seasons?.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Page Size */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
          >
            <option value={10}>10 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
          </select>

          <a
            href={api.getCleanedCsvUrl()}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '7px 14px',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Main Records Table */}
      <div className="chart-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="custom-table-container" style={{ border: 'none', borderRadius: '0' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('Customer ID')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Customer ID</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => handleSort('Age')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Age</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>Gender</th>
                <th onClick={() => handleSort('Category')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Category</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => handleSort('Item Purchased')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Item Purchased</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => handleSort('Purchase Amount (USD)')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Amount ($)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>Location</th>
                <th>Size</th>
                <th>Color</th>
                <th>Season</th>
                <th onClick={() => handleSort('Review Rating')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Rating</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>Payment Method</th>
                <th>Shipping Type</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={13} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                    Loading records from server...
                  </td>
                </tr>
              ) : dataResponse.rows.length === 0 ? (
                <tr>
                  <td colSpan={13} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                    No records match the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                dataResponse.rows.map((row, idx) => (
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
                    <td><strong>{row['Item Purchased']}</strong></td>
                    <td>
                      <span style={{ fontWeight: '700', color: '#0F172A' }}>
                        ${row['Purchase Amount (USD)']}
                      </span>
                    </td>
                    <td>{row['Location']}</td>
                    <td>{row['Size']}</td>
                    <td>{row['Color']}</td>
                    <td>{row['Season']}</td>
                    <td>
                      <span style={{ fontWeight: '700', color: row['Review Rating'] ? '#D97706' : '#EF4444' }}>
                        {row['Review Rating'] !== null && row['Review Rating'] !== undefined
                          ? `★ ${Number(row['Review Rating']).toFixed(1)}`
                          : 'Missing'}
                      </span>
                    </td>
                    <td>{row['Payment Method']}</td>
                    <td>{row['Shipping Type']}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div style={{ fontSize: '13px', color: '#64748B' }}>
            Showing <strong>{dataResponse.total_rows > 0 ? startRecord : 0}</strong> to{' '}
            <strong>{endRecord}</strong> of <strong>{dataResponse.total_rows.toLocaleString()}</strong> records
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: page <= 1 ? '#CBD5E1' : '#1E293B',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12.5px',
              }}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <span style={{ padding: '0 8px', fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>
              Page {dataResponse.page} of {dataResponse.total_pages}
            </span>

            <button
              onClick={() => setPage(Math.min(dataResponse.total_pages, page + 1))}
              disabled={page >= dataResponse.total_pages}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: page >= dataResponse.total_pages ? '#CBD5E1' : '#1E293B',
                cursor: page >= dataResponse.total_pages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12.5px',
              }}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
