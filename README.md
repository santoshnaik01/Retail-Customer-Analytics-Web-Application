# Retail Customer Behavior & Shopping Trends Analytics Web Application

A full-stack retail analytics web platform engineered with **React 19, Vite, Plotly.js, FastAPI, Pandas, and ReportLab**. The application provides automated data quality analysis, transparent cleaning pipelines, interactive dashboards, multidimensional customer and product analytics, and automated PDF/CSV report generation.

All metrics are authoritatively calculated in real-time from the uploaded retail dataset (3,900 rows & 18 columns).

## 🛠️ Mandatory Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, JavaScript, Vite, React Router v7, Plotly.js (`plotly.js-dist-min` + `react-plotly.js`), Lucide React, HTML5, CSS3 |
| **Backend** | Python 3.11, FastAPI, Uvicorn, Pandas, NumPy, Pydantic v2, Python-Multipart |
| **Reporting & Export** | ReportLab (Executive PDF generation), Python CSV/Pandas (Cleaned & Summary CSVs) |
| **Testing** | Pytest, HTTPX TestClient |

---

## 🚀 Quickstart & Local Setup

### 1. Backend Setup (FastAPI)
```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# Or on macOS/Linux:
# python3 -m venv venv && source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- Backend API: `http://localhost:8000`
- Interactive Swagger UI: `http://localhost:8000/docs`

---

### 2. Frontend Setup (React + Vite)
```bash
# In a new terminal, navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
- Frontend Web Application: `http://localhost:5173`

---

## 📊 Application Modules & Navigation

### 1. Overview Dashboard (`/`)
- **5 Executive KPI Cards**: Total Customers (`3,900`), Total Purchase Amount (`$233,081`), Average Purchase (`$59.76`), Average Review Rating (`3.8 / 5`), Total Records (`3,900`).
- **Interactive Visualizations**:
  - Purchase Amount by Category (Bar chart with outside amount labels).
  - Customer Distribution by Gender (Donut chart with center count).
  - Top 5 Products by Revenue (Horizontal bar chart).
  - Review Ratings by Category (Smooth area/line chart).
- **Customer Insights**: 4 dynamic summary cards (Top Location, Most Popular Category, Top Payment Method, Top Shipping Type).
- **Filter Panel**: Multi-criteria filtering by Category, Gender, Location, Season, Subscription, and Payment Method.

### 2. Upload & Data Cleaning (`/upload`)
- Drag-and-drop CSV upload with validation against unsupported files or empty documents.
- Dataset dimensions summary (Rows, Columns, File Size).
- Data Quality Audit: Detects 37 missing review ratings, verifies 0 duplicate rows, and audits 18 data types.
- Automated Data Cleaning: Imputes missing ratings via Category-level mean values, trims whitespace, standardizes casing, and validates numeric ranges.
- Dual-table preview: Toggle between Cleaned and Original raw datasets.

### 3. Customer Analytics (`/customers`)
- Age group distribution (`18-25`, `26-35`, `36-45`, `46-55`, `56+`).
- Geographic customer concentration across all 50 US states.
- Gender and subscription adoption rates.
- Previous purchase distribution bins (`1-10`, `11-20`, etc.).
- Comprehensive demographic performance matrix table.

### 4. Shopping Patterns (`/shopping-patterns`)
- Revenue by category and top-selling catalog items.
- Purchase frequency breakdown (Weekly, Monthly, Quarterly, Annually).
- Promotional discount usage analysis.
- Payment method and shipping type preference distributions.
- Complete 25-item product ranking table.

### 5. Data Explorer (`/data-explorer`)
- Toggle between original raw data and cleaned dataset.
- Real-time global text search across all columns.
- Multi-column sorting (ascending and descending).
- Column-specific filtering by Category, Gender, and Season.
- Pagination controls with selectable page sizes (10, 25, 50, 100 rows).

### 6. Reports Center (`/reports`)
- **PDF Analytics Report**: Formatted multi-page PDF generated via ReportLab with executive tables, KPI summaries, and methodology notes.
- **Cleaned Dataset CSV**: Instant download of the sanitized dataset.
- **Summary Analytics CSV**: Structured export of aggregated category metrics, demographics, and product rankings.

### 7. Settings & About (`/settings`)
- Live dataset session metadata and one-click sample dataset reset.
- Architecture and technology stack specifications.
- Team division of responsibilities.

---

## 🧪 Testing & Verification

Run the backend test suite:
```bash
cd backend
python -m pytest tests/test_all_endpoints.py -v
```
All 12 automated test suites verify health checks, dataset inspections, cleaning operations, filter combinations, pagination, error states, and ReportLab PDF downloads.

To test the frontend production build:
```bash
cd frontend
npm run build
```

---

## 👥 Team Responsibilities

- **Pratap — Frontend Development**: React components, routing, responsive design system, Plotly.js charts, filters, Data Explorer, and Reports download controls.
- **Sarswati — Backend Development**: FastAPI API design, CSV upload and validation, cleaning pipeline, ReportLab PDF generator, CSV exports, and CORS configuration.
- **Santosh — Data Analysis & Testing**: Dataset schema inspection, analytical correctness, KPI definitions, Pytest automated testing, and documentation.

---

## ⚖️ Analytical Limitations & Data Integrity

1. **No Transaction Dates**: The retail shopping dataset does not include transaction date timestamps. Daily, weekly, or monthly historical time-series trends are intentionally omitted to avoid fabricating data.
2. **Season Column**: The `Season` column is treated strictly as an independent categorical attribute rather than a chronological date.
3. **Revenue Definition**: The metric `Total Purchase Amount` represents the sum of recorded transaction amounts, not audited corporate revenue.
