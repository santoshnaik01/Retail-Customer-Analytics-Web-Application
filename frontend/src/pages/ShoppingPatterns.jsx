import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  PieChart as PieIcon,
  CreditCard,
  Truck,
  Sparkles,
  BarChart2,
  TrendingUp,
} from 'lucide-react';
import PlotlyChart from '../components/PlotlyChart';
import { api } from '../services/api';
import { useDataset } from '../layouts/AppLayout';

export default function ShoppingPatterns() {
  const { datasetInfo } = useDataset();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    category: 'All',
    season: 'All',
    payment_method: 'All',
    shipping_type: 'All',
    use_cleaned: true,
  });

  const fetchShoppingPatterns = async (appliedFilters = filters) => {
    try {
      setLoading(true);
      const payload = {
        category: appliedFilters.category === 'All' ? null : appliedFilters.category,
        season: appliedFilters.season === 'All' ? null : appliedFilters.season,
        payment_method: appliedFilters.payment_method === 'All' ? null : appliedFilters.payment_method,
        shipping_type: appliedFilters.shipping_type === 'All' ? null : appliedFilters.shipping_type,
        use_cleaned: appliedFilters.use_cleaned,
      };

      const res = await api.getShoppingPatterns(payload);
      setData(res);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error fetching shopping patterns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShoppingPatterns();
  }, [datasetInfo]);

  const handleApply = () => {
    fetchShoppingPatterns(filters);
  };

  const filterOptions = datasetInfo?.available_filters || {};

  // Chart 1: Top 10 Products by Purchase Amount (Horizontal Bar)
  const topItems = data?.top_items || { items: [], amounts: [] };
  const topProductsBarData = [
    {
      y: [...topItems.items].reverse(),
      x: [...topItems.amounts].reverse(),
      type: 'bar',
      orientation: 'h',
      marker: {
        color: ['#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#1769FF'].reverse(),
        borderRadius: 6,
      },
      text: [...topItems.amounts].reverse().map((v) => `$${v.toLocaleString()}`),
      textposition: 'outside',
      cliponaxis: false,
    },
  ];

  // Chart 2: Purchase Frequency (Donut)
  const freqData = data?.purchase_frequency || { labels: [], counts: [] };
  const freqDonutData = [
    {
      labels: freqData.labels,
      values: freqData.counts,
      type: 'pie',
      hole: 0.65,
      marker: {
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4', '#64748B'],
      },
      textinfo: 'percent',
      hoverinfo: 'label+value+percent',
    },
  ];

  // Chart 3: Average Spend by Category (Line/Area)
  const catSales = data?.category_sales || { categories: [], avg_spend: [] };
  const avgSpendData = [
    {
      x: catSales.categories,
      y: catSales.avg_spend,
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#06B6D4', width: 3, shape: 'spline' },
      marker: { color: '#06B6D4', size: 9 },
      fill: 'tozeroy',
      fillcolor: 'rgba(6, 182, 212, 0.1)',
      text: catSales.avg_spend.map((v) => `$${v.toFixed(2)}`),
      textposition: 'top center',
    },
  ];

  // Chart 4: Discount Usage (Donut)
  const discData = data?.discount_vs_regular || { labels: [], counts: [] };
  const discDonutData = [
    {
      labels: discData.labels,
      values: discData.counts,
      type: 'pie',
      hole: 0.65,
      marker: {
        colors: ['#EC4899', '#CBD5E1'],
      },
      textinfo: 'percent',
      hoverinfo: 'label+value+percent',
    },
  ];

  // Chart 5: Payment Methods (Bar)
  const pmData = data?.payment_methods || { methods: [], amounts: [] };
  const paymentBarData = [
    {
      x: pmData.methods,
      y: pmData.amounts,
      type: 'bar',
      marker: {
        color: '#7C3AED',
        borderRadius: 6,
      },
      text: pmData.amounts.map((v) => `$${Math.round(v / 1000)}K`),
      textposition: 'outside',
      cliponaxis: false,
    },
  ];

  return (
    <div>
      <div className="welcome-banner">
        <h1>Shopping Patterns</h1>
        <p>Explore product popularity, category revenue, payment methods, and discount behavior</p>
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
            CATEGORY
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
          >
            <option value="All">All Categories</option>
            {filterOptions.categories?.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1', minWidth: '150px' }}>
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '6px' }}>
            SEASON
          </label>
          <select
            value={filters.season}
            onChange={(e) => setFilters({ ...filters, season: e.target.value })}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
          >
            <option value="All">All Seasons</option>
            {filterOptions.seasons?.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1', minWidth: '150px' }}>
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '6px' }}>
            PAYMENT METHOD
          </label>
          <select
            value={filters.payment_method}
            onChange={(e) => setFilters({ ...filters, payment_method: e.target.value })}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
          >
            <option value="All">All Methods</option>
            {filterOptions.payment_methods?.map((pm) => (
              <option key={pm} value={pm}>{pm}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1', minWidth: '150px' }}>
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '6px' }}>
            SHIPPING TYPE
          </label>
          <select
            value={filters.shipping_type}
            onChange={(e) => setFilters({ ...filters, shipping_type: e.target.value })}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
          >
            <option value="All">All Types</option>
            {filterOptions.shipping_types?.map((st) => (
              <option key={st} value={st}>{st}</option>
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

      {/* Row 1: Top Products by Revenue & Purchase Frequency */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', marginBottom: '20px' }}>
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <ShoppingBag size={18} className="title-icon" color="#10B981" />
              <h3>Top 10 Products by Purchase Amount</h3>
            </div>
            <span className="select-pill">Top Products</span>
          </div>
          <PlotlyChart
            data={topProductsBarData}
            layout={{
              xaxis: { title: 'Purchase Amount (USD)', tickformat: '$,.0f' },
              yaxis: { automargin: true },
              margin: { t: 20, r: 40, b: 40, l: 95 },
            }}
            style={{ height: '300px' }}
          />
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <PieIcon size={18} className="title-icon" color="#3B82F6" />
              <h3>Purchase Frequency</h3>
            </div>
          </div>
          <PlotlyChart
            data={freqDonutData}
            layout={{
              showlegend: true,
              legend: { orientation: 'h', x: 0, y: -0.15 },
              margin: { t: 10, r: 10, b: 35, l: 10 },
            }}
            style={{ height: '300px' }}
          />
        </div>
      </div>

      {/* Row 2: Average Purchase Amount by Category, Discount Usage, Payment Methods */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <TrendingUp size={18} className="title-icon" color="#06B6D4" />
              <h3>Average Spend by Category</h3>
            </div>
          </div>
          <PlotlyChart
            data={avgSpendData}
            layout={{
              yaxis: { title: 'Average Spend ($)', range: [50, 70] },
              xaxis: { tickangle: 0 },
              margin: { t: 25, r: 20, b: 40, l: 45 },
            }}
            style={{ height: '240px' }}
          />
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <BarChart2 size={18} className="title-icon" color="#EC4899" />
              <h3>Discount Usage</h3>
            </div>
          </div>
          <PlotlyChart
            data={discDonutData}
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
              <CreditCard size={18} className="title-icon" color="#7C3AED" />
              <h3>Payment Methods Volume</h3>
            </div>
          </div>
          <PlotlyChart
            data={paymentBarData}
            layout={{
              yaxis: { title: 'Total Volume ($)', tickformat: '$,.0f' },
              xaxis: { tickangle: -20 },
              margin: { t: 25, r: 20, b: 45, l: 50 },
            }}
            style={{ height: '240px' }}
          />
        </div>
      </div>

      {/* Full 25 Product Ranking Table */}
      <div className="chart-card" style={{ marginBottom: '24px' }}>
        <div className="chart-card-header">
          <div className="chart-card-title">
            <ShoppingBag size={18} className="title-icon" />
            <h3>Complete Product Catalog Performance (All 25 Items)</h3>
          </div>
        </div>

        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Item Purchased</th>
                <th>Category</th>
                <th>Total Spend ($)</th>
                <th>Transactions</th>
                <th>Avg Spend ($)</th>
                <th>Avg Rating</th>
              </tr>
            </thead>
            <tbody>
              {data?.items_ranking_table?.map((item) => (
                <tr key={item.rank}>
                  <td>
                    <span
                      style={{
                        fontWeight: '700',
                        color: item.rank <= 3 ? '#1769FF' : '#64748B',
                      }}
                    >
                      #{item.rank}
                    </span>
                  </td>
                  <td><strong>{item.item}</strong></td>
                  <td>
                    <span className={`badge badge-${item.category.toLowerCase()}`}>
                      {item.category}
                    </span>
                  </td>
                  <td><strong>${item.total_spend.toLocaleString()}</strong></td>
                  <td>{item.purchase_count.toLocaleString()}</td>
                  <td>${item.avg_spend.toFixed(2)}</td>
                  <td>
                    <span style={{ color: '#D97706', fontWeight: '700' }}>
                      ★ {item.avg_rating.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Observations */}
      {data?.insights && data.insights.length > 0 && (
        <div className="chart-card">
          <div className="chart-card-title" style={{ marginBottom: '12px' }}>
            <Sparkles size={18} color="#06B6D4" />
            <h3>Purchasing Pattern Insights</h3>
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
