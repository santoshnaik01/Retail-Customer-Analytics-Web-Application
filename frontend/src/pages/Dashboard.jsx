import React, { useState, useEffect } from 'react';
import {
  Users,
  ShoppingCart,
  CreditCard,
  Star,
  ShoppingBag,
  Filter,
  Search,
  FileDown,
  Download,
  BarChart2,
  TrendingUp,
  MapPin,
  Truck,
  RotateCcw,
} from 'lucide-react';
import PlotlyChart from '../components/PlotlyChart';
import { api } from '../services/api';
import { useDataset } from '../layouts/AppLayout';

export default function Dashboard() {
  const { datasetInfo } = useDataset();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    category: 'All Categories',
    gender: 'All Gender',
    location: 'All Locations',
    season: 'All Seasons',
    subscription_status: 'All Status',
    payment_method: 'All Methods',
    use_cleaned: true,
  });

  const fetchDashboard = async (appliedFilters = filters) => {
    try {
      setLoading(true);
      const payload = {
        category: appliedFilters.category === 'All Categories' ? null : appliedFilters.category,
        gender: appliedFilters.gender === 'All Gender' ? null : appliedFilters.gender,
        location: appliedFilters.location === 'All Locations' ? null : appliedFilters.location,
        season: appliedFilters.season === 'All Seasons' ? null : appliedFilters.season,
        subscription_status: appliedFilters.subscription_status === 'All Status' ? null : appliedFilters.subscription_status,
        payment_method: appliedFilters.payment_method === 'All Methods' ? null : appliedFilters.payment_method,
        use_cleaned: appliedFilters.use_cleaned,
      };

      const res = await api.getDashboardData(payload);
      setDashboardData(res);
      setError(null);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(err.message || 'Error fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [datasetInfo]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    fetchDashboard(filters);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      category: 'All Categories',
      gender: 'All Gender',
      location: 'All Locations',
      season: 'All Seasons',
      subscription_status: 'All Status',
      payment_method: 'All Methods',
      use_cleaned: true,
    };
    setFilters(defaultFilters);
    fetchDashboard(defaultFilters);
  };

  const kpis = dashboardData?.kpis;
  const insights = dashboardData?.insights || [];
  const filterOptions = datasetInfo?.available_filters || {};

  // Chart 1: Purchase Amount by Category
  const catChart = dashboardData?.purchase_by_category || { categories: [], amounts: [] };
  const categoryBarData = [
    {
      x: catChart.categories,
      y: catChart.amounts,
      type: 'bar',
      marker: {
        color: ['#1769FF', '#7C3AED', '#06B6D4', '#EC4899', '#10B981'],
        borderRadius: 8,
      },
      text: catChart.amounts.map((v) => `$${Math.round(v / 1000)}K`),
      textposition: 'outside',
      cliponaxis: false,
      hoverinfo: 'x+y',
    },
  ];

  // Chart 2: Customer Distribution by Gender
  const genderChart = dashboardData?.customer_distribution_gender || { labels: [], values: [] };
  const genderDonutData = [
    {
      labels: genderChart.labels,
      values: genderChart.values,
      type: 'pie',
      hole: 0.72,
      marker: {
        colors: ['#0284C7', '#EC4899', '#8B5CF6'],
      },
      textinfo: 'none',
      hoverinfo: 'label+value+percent',
    },
  ];

  // Chart 3: Top 5 Products by Purchase Amount
  const topProd = dashboardData?.top_products || { products: [], amounts: [] };
  const topProductsBarData = [
    {
      y: topProd.products,
      x: topProd.amounts,
      type: 'bar',
      orientation: 'h',
      marker: {
        color: ['#10B981', '#EC4899', '#F59E0B', '#8B5CF6', '#1769FF'],
        borderRadius: 6,
      },
      text: topProd.amounts.map((v) => `$${v.toLocaleString()}`),
      textposition: 'outside',
      cliponaxis: false,
    },
  ];

  // Chart 4: Review Ratings by Category
  const ratingCat = dashboardData?.review_ratings_by_category || { categories: [], ratings: [] };
  const ratingLineData = [
    {
      x: ratingCat.categories,
      y: ratingCat.ratings,
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#1769FF', width: 3, shape: 'spline' },
      marker: { color: '#1769FF', size: 8, symbol: 'circle' },
      fill: 'tozeroy',
      fillcolor: 'rgba(23, 105, 255, 0.1)',
      text: ratingCat.ratings.map((v) => `${v.toFixed(1)}`),
      textposition: 'top center',
    },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div className="welcome-banner">
        <h1>
          Welcome to <span>Retail Analytics</span>
        </h1>
        <p>Explore customer behavior, purchase patterns and key insights from your retail data</p>
      </div>

      {/* 5 KPI Cards Row */}
      <div className="kpi-grid">
        {/* KPI 1 */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Total Customers</span>
            <div className="kpi-icon-wrapper kpi-icon-blue">
              <Users size={20} />
            </div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-value">{loading ? '...' : kpis?.total_customers?.toLocaleString()}</div>
            <span className="kpi-change-pill">
              <TrendingUp size={12} /> +12%
            </span>
          </div>
          {/* Sparkline wave */}
          <svg className="kpi-sparkline" viewBox="0 0 100 25" preserveAspectRatio="none">
            <path d="M0,20 Q25,5 50,15 T100,5 L100,25 L0,25 Z" fill="#EFF6FF" />
            <path d="M0,20 Q25,5 50,15 T100,5" fill="none" stroke="#1769FF" strokeWidth="2" />
          </svg>
        </div>

        {/* KPI 2 */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Total Purchase Amount</span>
            <div className="kpi-icon-wrapper kpi-icon-green">
              <ShoppingCart size={20} />
            </div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-value">{loading ? '...' : `$${Math.round(kpis?.total_purchase_amount || 0).toLocaleString()}`}</div>
            <span className="kpi-change-pill">
              <TrendingUp size={12} /> +18%
            </span>
          </div>
          <svg className="kpi-sparkline" viewBox="0 0 100 25" preserveAspectRatio="none">
            <path d="M0,22 Q25,18 50,8 T100,2 L100,25 L0,25 Z" fill="#ECFDF5" />
            <path d="M0,22 Q25,18 50,8 T100,2" fill="none" stroke="#10B981" strokeWidth="2" />
          </svg>
        </div>

        {/* KPI 3 */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Average Purchase</span>
            <div className="kpi-icon-wrapper kpi-icon-purple">
              <CreditCard size={20} />
            </div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-value">{loading ? '...' : `$${kpis?.avg_purchase_amount?.toFixed(2)}`}</div>
            <span className="kpi-change-pill">
              <TrendingUp size={12} /> +7%
            </span>
          </div>
          <svg className="kpi-sparkline" viewBox="0 0 100 25" preserveAspectRatio="none">
            <path d="M0,18 Q30,22 60,10 T100,8 L100,25 L0,25 Z" fill="#F5F3FF" />
            <path d="M0,18 Q30,22 60,10 T100,8" fill="none" stroke="#7C3AED" strokeWidth="2" />
          </svg>
        </div>

        {/* KPI 4 */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Average Review Rating</span>
            <div className="kpi-icon-wrapper kpi-icon-gold">
              <Star size={20} />
            </div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-value">{loading ? '...' : `${kpis?.avg_review_rating?.toFixed(1)} / 5`}</div>
            <span className="kpi-change-pill">
              <TrendingUp size={12} /> +9%
            </span>
          </div>
          <svg className="kpi-sparkline" viewBox="0 0 100 25" preserveAspectRatio="none">
            <path d="M0,15 Q35,5 70,18 T100,4 L100,25 L0,25 Z" fill="#FEFCE8" />
            <path d="M0,15 Q35,5 70,18 T100,4" fill="none" stroke="#F59E0B" strokeWidth="2" />
          </svg>
        </div>

        {/* KPI 5 */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Total Records</span>
            <div className="kpi-icon-wrapper kpi-icon-pink">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-value">{loading ? '...' : kpis?.total_records?.toLocaleString()}</div>
            <span className="kpi-change-pill">
              <TrendingUp size={12} /> +15%
            </span>
          </div>
          <svg className="kpi-sparkline" viewBox="0 0 100 25" preserveAspectRatio="none">
            <path d="M0,22 Q30,8 60,16 T100,6 L100,25 L0,25 Z" fill="#FDF2F8" />
            <path d="M0,22 Q30,8 60,16 T100,6" fill="none" stroke="#EC4899" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Main Grid: Charts on Left (72%), Filters on Right (28%) */}
      <div className="dashboard-grid">
        <div className="charts-column">
          {/* Row 1 Charts */}
          <div className="charts-row">
            {/* Chart 1: Purchase Amount by Category */}
            <div className="chart-card">
              <div className="chart-card-header">
                <div className="chart-card-title">
                  <BarChart2 size={18} className="title-icon" />
                  <h3>Purchase Amount by Category</h3>
                </div>
                <span className="select-pill">Purchase Amount</span>
              </div>
              <PlotlyChart
                data={categoryBarData}
                layout={{
                  yaxis: { title: 'Amount (USD)', tickformat: '$,.0f' },
                  xaxis: { tickangle: 0 },
                  margin: { t: 30, r: 15, b: 40, l: 50 },
                }}
                style={{ height: '280px' }}
              />
            </div>

            {/* Chart 2: Customer Distribution by Gender */}
            <div className="chart-card">
              <div className="chart-card-header">
                <div className="chart-card-title">
                  <Users size={18} className="title-icon" />
                  <h3>Customer Distribution by Gender</h3>
                </div>
                <span className="select-pill">Gender</span>
              </div>
              <div style={{ position: 'relative' }}>
                <PlotlyChart
                  data={genderDonutData}
                  layout={{
                    showlegend: true,
                    legend: { orientation: 'h', x: 0.1, y: -0.15 },
                    margin: { t: 10, r: 10, b: 35, l: 10 },
                    annotations: [
                      {
                        font: { size: 14, weight: 'bold', color: '#0F172A' },
                        showarrow: false,
                        text: `<b>${kpis?.total_customers?.toLocaleString() || 0}</b><br><span style="font-size:10px;color:#64748B;">Customers</span>`,
                        x: 0.5,
                        y: 0.5,
                      },
                    ],
                  }}
                  style={{ height: '280px' }}
                />
              </div>
            </div>
          </div>

          {/* Row 2 Charts */}
          <div className="charts-row">
            {/* Chart 3: Top 5 Products */}
            <div className="chart-card">
              <div className="chart-card-header">
                <div className="chart-card-title">
                  <ShoppingBag size={18} className="title-icon" color="#10B981" />
                  <h3>Top 5 Products by Purchase Amount</h3>
                </div>
                <span className="select-pill">Top 5</span>
              </div>
              <PlotlyChart
                data={topProductsBarData}
                layout={{
                  xaxis: { title: 'Purchase Amount (USD)', tickformat: '$,.0f' },
                  yaxis: { automargin: true },
                  margin: { t: 20, r: 40, b: 40, l: 90 },
                }}
                style={{ height: '280px' }}
              />
            </div>

            {/* Chart 4: Review Ratings by Category */}
            <div className="chart-card">
              <div className="chart-card-header">
                <div className="chart-card-title">
                  <Star size={18} className="title-icon" color="#F59E0B" />
                  <h3>Review Ratings by Category</h3>
                </div>
                <span className="select-pill">All Categories</span>
              </div>
              <PlotlyChart
                data={ratingLineData}
                layout={{
                  yaxis: { title: 'Average Rating', range: [2.0, 5.0] },
                  xaxis: { tickangle: 0 },
                  margin: { t: 25, r: 20, b: 40, l: 45 },
                }}
                style={{ height: '280px' }}
              />
            </div>
          </div>

          {/* Customer Insights Section */}
          <div className="customer-insights-section">
            <h3 className="insights-header">Customer Insights</h3>
            <div className="insights-grid">
              {insights.map((ins, idx) => {
                let icon = <MapPin size={22} color="#10B981" />;
                let iconBg = '#ECFDF5';
                if (ins.category === 'category') {
                  icon = <ShoppingBag size={22} color="#EC4899" />;
                  iconBg = '#FDF2F8';
                } else if (ins.category === 'payment') {
                  icon = <CreditCard size={22} color="#7C3AED" />;
                  iconBg = '#F5F3FF';
                } else if (ins.category === 'shipping') {
                  icon = <Truck size={22} color="#F59E0B" />;
                  iconBg = '#FEFCE8';
                }

                return (
                  <div key={idx} className="insight-card">
                    <div className="insight-icon" style={{ backgroundColor: iconBg }}>
                      {icon}
                    </div>
                    <div className="insight-info">
                      <h4>{ins.title}</h4>
                      <div className="insight-title">{ins.value}</div>
                      <p>{ins.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Filter & Quick Actions Panel */}
        <div className="filter-column">
          <div className="filter-panel-card">
            <div className="filter-panel-header">
              <div className="filter-panel-title">
                <Filter size={18} color="#1769FF" />
                <span>Filters</span>
              </div>
              <button className="clear-filters-btn" onClick={handleClearFilters}>
                Clear All
              </button>
            </div>

            {/* Category Select */}
            <div className="filter-field">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="All Categories">All Categories</option>
                {filterOptions.categories?.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender Select */}
            <div className="filter-field">
              <label>Gender</label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
              >
                <option value="All Gender">All Gender</option>
                {filterOptions.genders?.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Select */}
            <div className="filter-field">
              <label>Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                <option value="All Locations">All Locations</option>
                {filterOptions.locations?.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Season Select */}
            <div className="filter-field">
              <label>Season</label>
              <select
                value={filters.season}
                onChange={(e) => handleFilterChange('season', e.target.value)}
              >
                <option value="All Seasons">All Seasons</option>
                {filterOptions.seasons?.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Subscription Status Select */}
            <div className="filter-field">
              <label>Subscription Status</label>
              <select
                value={filters.subscription_status}
                onChange={(e) => handleFilterChange('subscription_status', e.target.value)}
              >
                <option value="All Status">All Status</option>
                {filterOptions.subscription_statuses?.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Select */}
            <div className="filter-field">
              <label>Payment Method</label>
              <select
                value={filters.payment_method}
                onChange={(e) => handleFilterChange('payment_method', e.target.value)}
              >
                <option value="All Methods">All Methods</option>
                {filterOptions.payment_methods?.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>

            <button className="apply-filters-btn" onClick={handleApplyFilters}>
              <Search size={16} />
              <span>Apply Filters</span>
            </button>
          </div>

          {/* Quick Actions Panel */}
          <div className="quick-actions-card">
            <div className="quick-actions-title">
              <TrendingUp size={16} color="#F59E0B" />
              <span>Quick Actions</span>
            </div>

            <a
              href={api.getPdfReportUrl(filters.use_cleaned)}
              target="_blank"
              rel="noreferrer"
              className="action-btn action-btn-pdf"
            >
              <FileDown size={16} />
              <span>Download PDF Report</span>
            </a>

            <a
              href={api.getCleanedCsvUrl()}
              target="_blank"
              rel="noreferrer"
              className="action-btn action-btn-csv"
            >
              <Download size={16} />
              <span>Export Cleaned Data (CSV)</span>
            </a>

            <a
              href={api.getSummaryCsvUrl(filters.use_cleaned)}
              target="_blank"
              rel="noreferrer"
              className="action-btn action-btn-summary"
            >
              <BarChart2 size={16} />
              <span>Export Summary (CSV)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
