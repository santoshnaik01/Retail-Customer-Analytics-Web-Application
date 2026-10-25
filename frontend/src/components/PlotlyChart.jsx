import React from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);

export default function PlotlyChart({ data = [], layout = {}, config = {}, style = {}, className = '' }) {
  const defaultConfig = {
    responsive: true,
    displayModeBar: false,
    ...config,
  };

  const defaultLayout = {
    autosize: true,
    margin: { t: 30, r: 20, b: 40, l: 45 },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: {
      family: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#64748B',
      size: 11,
    },
    ...layout,
  };

  return (
    <div
      className={`chart-container ${className}`}
      style={{ width: '100%', height: '100%', minHeight: '260px', ...style }}
    >
      <Plot
        data={data}
        layout={defaultLayout}
        config={defaultConfig}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
