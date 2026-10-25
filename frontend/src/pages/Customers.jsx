import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  PieChart as PieIcon,
  MapPin,
  Sparkles,
  BarChart3,
  Award,
} from 'lucide-react';
import PlotlyChart from '../components/PlotlyChart';
import { api } from '../services/api';
import { useDataset } from '../layouts/AppLayout';

export default function Customers() {
  const { datasetInfo } = useDataset();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    age_group: 'All',
    gender: 'All',
    location: 'All',
    subscription_status: 'All',
    use_cleaned: true,
  });

  const fetchCustomerAnalytics = async (appliedFilters = filters) => {
    try {
      setLoading(true);
      const payload = {
        age_group: appliedFilters.age_group === 'All' ? null : appliedFilters.age_group,
        gender: appliedFilters.gender === 'All' ? null : appliedFilters.gender,
        location: appliedFilters.location === 'All' ? null : appliedFilters.location,
        subscription_status: appliedFilters.subscription_status === 'All' ? null : appliedFilters.subscription_status,
        use_cleaned: appliedFilters.use_cleaned,
      };

      const res = await api.getCustomerAnalytics(payload);
      setData(res);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error fetching customer analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerAnalytics();
  }, [datasetInfo]);

  const handleApply = () => {
    fetchCustomerAnalytics(filters);
  };

  const filterOptions = datasetInfo?.available_filters || {};

  // Chart 1: Customers by Age Group (Bar)
  const ageDist = data?.age_distribution || { groups: [], counts: [] };
  const ageBarData = [
    {
      x: ageDist.groups,
      y: ageDist.counts,
      type: 'bar',
      marker: {
        color: ['#1769FF', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B'],
        borderRadius: 8,
      },
      text: ageDist.counts.map((v) => v.toLocaleString()),
      textposition: 'outside',
      cliponaxis: false,
    },
  ];

  // Chart 2: Customers by Location (Horizontal Bar)
  const locDist = data?.location_distribution || { locations: [], counts: [] };
  const locationBarData = [
    {
      y: [...locDist.locations].reverse(),
      x: [...locDist.counts].reverse(),
      type: 'bar',
      orientation: 'h',
      marker: {
        color: '#1769FF',
        borderRadius: 6,
      },
      text: [...locDist.counts].reverse().map((v) => `${v}`),
      textposition: 'outside',
      cliponaxis: false,
    },
  ];

  // Chart 3: Gender Distribution (Donut)
  const genderDist = data?.gender_distribution || { labels: [], counts: [] };
  const genderDonutData = [
    {
      labels: genderDist.labels,
      values: genderDist.counts,
      type: 'pie',
      hole: 0.65,
      marker: {
        colors: ['#0284C7', '#EC4899', '#8B5CF6'],
      },
      textinfo: 'percent',
      hoverinfo: 'label+value+percent',
    },
  ];

  // Chart 4: Subscription Status (Donut)
  const subDist = data?.subscription_distribution || { labels: [], counts: [] };
  const subDonutData = [
    {
      labels: subDist.labels.map((l) => (l.toLowerCase() === 'yes' ? 'Subscribed' : 'Non-Subscribed')),
      values: subDist.counts,
      type: 'pie',
      hole: 0.65,
      marker: {
        colors: ['#10B981', '#CBD5E1'],
      },
      textinfo: 'percent',
      hoverinfo: 'label+value+percent',
    },
  ];

  // Chart 5: Previous Purchases Distribution (Bar)
  const prevDist = data?.previous_purchases_distribution || { ranges: [], counts: [] };
  const prevPurchasesBarData = [
    {
      x: prevDist.ranges,
      y: prevDist.counts,
      type: 'bar',
      marker: {
        color: '#7C3AED',
        borderRadius: 6,
      },
      text: prevDist.counts.map((v) => v.toLocaleString()),
      textposition: 'outside',
      cliponaxis: false,
    },
  ];

  return (
    <div>
      <div className="welcome-banner">
        <h1>Customer Analytics</h1>
        <p>Understand your customer demographics, loyalty, subscriptions, and spending behavior</p>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'flex-end',
          padding: '16px 20px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8EEF5',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
          marginBottom: '24px',
        }}
      >
        <div style={{ flex: '1', minWidth: '150px' }}>
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '6px' }}>
            AGE GROUP
          </label>
          <select
            value={filters.age_group}
            onChange={(e) => setFilters({ ...filters, age_group: e.target.value })}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
          >
            <option value="All">All Age Groups</option>
            <option value="18-25">18 - 25</option>
            <option value="26-35">26 - 35</option>
            <option value="36-45">36 - 45</option>
            <option value="46-55">46 - 55</option>
            <option value="56+">56+</option>
          </select>
        </div>

        <div style={{ flex: '1', minWidth: '150px' }}>
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '6px' }}>
            GENDER
          </label>
          <select
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
          >
            <option value="All">All Genders</option>
            {filterOptions.genders?.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1', minWidth: '150px' }}>
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '6px' }}>
            LOCATION
          </label>
          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
          >
            <option value="All">All Locations</option>
            {filterOptions.locations?.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1', minWidth: '150px' }}>
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '6px' }}>
            SUBSCRIPTION
          </label>
          <select
            value={filters.subscription_status}
            onChange={(e) => setFilters({ ...filters, subscription_status: e.target.value })}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
          >
            <option value="All">All Statuses</option>
            {filterOptions.subscription_statuses?.map((st) => (
              <option key={st} value={st}>{st === 'Yes' ? 'Subscribed' : 'Non-Subscribed'}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleApply}
          style={{
            padding: '9px 24px',
            backgroundColor: '#1769FF',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13.5px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            height: '38px',
          }}
        >
          <Search size={16} />
          <span>Apply</span>
        </button>
      </div>

      {/* Row 1: Age Distribution & Location Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <Users size={18} className="title-icon" />
              <h3>Customers by Age Group</h3>
            </div>
            <span className="select-pill">5 Brackets</span>
          </div>
          <PlotlyChart
            data={ageBarData}
            layout={{
              yaxis: { title: 'Customer Count' },
              xaxis: { title: 'Age Group' },
              margin: { t: 25, r: 20, b: 40, l: 50 },
            }}
            style={{ height: '280px' }}
          />
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <MapPin size={18} className="title-icon" color="#10B981" />
              <h3>Customers by Location (Top 10 States)</h3>
            </div>
            <span className="select-pill">Top States</span>
          </div>
          <PlotlyChart
            data={locationBarData}
            layout={{
              xaxis: { title: 'Customer Count' },
              yaxis: { automargin: true },
              margin: { t: 20, r: 35, b: 40, l: 80 },
            }}
            style={{ height: '280px' }}
          />
        </div>
      </div>

      {/* Row 2: Gender Distribution, Subscription Status, Previous Purchases */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <PieIcon size={18} className="title-icon" color="#0284C7" />
              <h3>Gender Distribution</h3>
            </div>
          </div>
          <PlotlyChart
            data={genderDonutData}
            layout={{
              showlegend: true,
              legend: { orientation: 'h', x: 0.15, y: -0.1 },
              margin: { t: 10, r: 10, b: 30, l: 10 },
            }}
            style={{ height: '240px' }}
          />
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <Award size={18} className="title-icon" color="#10B981" />
              <h3>Subscription Status</h3>
            </div>
          </div>
          <PlotlyChart
            data={subDonutData}
            layout={{
              showlegend: true,
              legend: { orientation: 'h', x: 0.1, y: -0.1 },
              margin: { t: 10, r: 10, b: 30, l: 10 },
            }}
            style={{ height: '240px' }}
          />
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <BarChart3 size={18} className="title-icon" color="#7C3AED" />
              <h3>Previous Purchases</h3>
            </div>
          </div>
          <PlotlyChart
            data={prevPurchasesBarData}
            layout={{
              yaxis: { title: 'Customers' },
              xaxis: { title: 'Prior Orders' },
              margin: { t: 20, r: 20, b: 40, l: 45 },
            }}
            style={{ height: '240px' }}
          />
        </div>
      </div>

      {/* Age Group Breakdown Summary Table */}
      <div className="chart-card" style={{ marginBottom: '24px' }}>
        <div className="chart-card-header">
          <div className="chart-card-title">
            <Users size={18} className="title-icon" />
            <h3>Demographic Performance Matrix (By Age Group)</h3>
          </div>
        </div>

        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Age Group</th>
                <th>Customers</th>
                <th>Share %</th>
                <th>Total Spend ($)</th>
                <th>Avg Spend ($)</th>
                <th>Avg Review Rating</th>
                <th>Subscription Rate</th>
              </tr>
            </thead>
            <tbody>
              {data?.age_group_summary_table?.map((row, i) => (
                <tr key={i}>
                  <td><strong>{row.age_group}</strong></td>
                  <td>{row.customer_count.toLocaleString()}</td>
                  <td>{row.pct_of_total}%</td>
                  <td><strong>${row.total_spend.toLocaleString()}</strong></td>
                  <td>${row.avg_spend.toFixed(2)}</td>
                  <td>
                    <span style={{ color: '#D97706', fontWeight: '700' }}>
                      ★ {row.avg_rating.toFixed(1)}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-yes">{row.subscription_rate}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actionable Insights */}
      {data?.insights && data.insights.length > 0 && (
        <div className="chart-card">
          <div className="chart-card-title" style={{ marginBottom: '12px' }}>
            <Sparkles size={18} color="#7C3AED" />
            <h3>Customer Intelligence &amp; Observations</h3>
          </div>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.insights.map((ins, i) => (
              <li key={i} style={{ fontSize: '13.5px', color: '#334155' }}>
                {ins}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
