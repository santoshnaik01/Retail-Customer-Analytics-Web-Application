```jsx
import React from "react";
import Plot from "react-plotly.js";

export default function PlotlyChart({
  title,
  data = [],
  layout = {},
  loading = false,
  error = null,
  height = 350,
  emptyMessage = "No data available for this chart.",
}) {
  if (loading) {
    return (
      <div className="plotly-chart-state" role="status">
        Loading {title || "chart"}...
      </div>
    );
  }

  if (error) {
    return (
      <div className="plotly-chart-state plotly-chart-error" role="alert">
        {typeof error === "string"
          ? error
          : "Unable to load chart data."}
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="plotly-chart-state">
        {emptyMessage}
      </div>
    );
  }

  return (
    <section className="plotly-chart">
      {title && <h3 className="plotly-chart-title">{title}</h3>}

      <Plot
        data={data}
        layout={{
          autosize: true,
          height,
          margin: { t: 25, r: 20, b: 55, l: 60 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          font: {
            family: "Arial, sans-serif",
            size: 12,
            color: "#334155",
          },
          ...layout,
        }}
        config={{
          responsive: true,
          displaylogo: false,
          modeBarButtonsToRemove: ["lasso2d", "select2d"],
        }}
        useResizeHandler
        style={{ width: "100%", height }}
      />
    </section>
  );
}
```