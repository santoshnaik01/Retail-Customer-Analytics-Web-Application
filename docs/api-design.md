# API Design & Contract Specification

The backend exposes a RESTful API powered by **FastAPI** with automated interactive documentation at `http://localhost:8000/docs`.

---

## 1. System Endpoints

### `GET /`
- **Description**: API root status and loaded dataset metadata.
- **Response**: `200 OK`
```json
{
  "name": "Retail Customer Behavior & Shopping Trends Analytics API",
  "version": "1.0.0",
  "status": "running",
  "docs_url": "/docs",
  "dataset_loaded": true,
  "dataset_name": "shopping_trends.csv",
  "records_count": 3900
}
```

### `GET /api/health`
- **Description**: Health check and dataset readiness.
- **Response**: `200 OK`
```json
{
  "status": "healthy",
  "dataset_loaded": true,
  "filename": "shopping_trends.csv",
  "row_count": 3900,
  "is_cleaned": true
}
```

---

## 2. Dataset Management Endpoints

### `POST /api/upload`
- **Content-Type**: `multipart/form-data`
- **Body**: `file`: CSV file binary
- **Validation**:
  - Rejects non-`.csv` extensions (`400 Bad Request`).
  - Rejects empty files (`400 Bad Request`).
- **Response**: `200 OK` with `DatasetSummaryResponse`.

### `GET /api/dataset/summary`
- **Description**: Returns dataset dimensions, schema columns, data types, and filter options.
- **Response**: `200 OK`

### `GET /api/dataset/quality`
- **Description**: Inspects missing values per column, duplicate records, and computes a data health score (0-100%).
- **Response**: `200 OK`

### `POST /api/dataset/clean`
- **Body**:
```json
{
  "impute_missing_rating": true,
  "imputation_strategy": "category_mean",
  "trim_whitespace": true,
  "remove_duplicates": true
}
```
- **Response**: `200 OK` with cleaning logs and record counts.

### `POST /api/dataset/reset`
- **Description**: Resets dataset to the standard `shopping_trends.csv`.

---

## 3. Analytics & Dashboard Endpoints

### `POST /api/dashboard`
- **Body**: `FilterParams`
```json
{
  "category": "Clothing",
  "gender": "Male",
  "location": "Montana",
  "season": "Winter",
  "subscription_status": "Yes",
  "payment_method": "Credit Card",
  "use_cleaned": true
}
```
- **Response**: `200 OK` with calculated KPIs, category bar chart, gender donut chart, top 5 products, ratings by category, and customer insights.

### `POST /api/analytics/customers`
- **Body**: `FilterParams`
- **Response**: `200 OK` with age group distributions, top locations, gender breakdown, subscription status, prior purchase bins, and matrix summary table.

### `POST /api/analytics/shopping-patterns`
- **Body**: `FilterParams`
- **Response**: `200 OK` with category revenue, top 10 items, purchase frequencies, discount usage, payment methods, shipping preferences, and 25-item ranking table.

---

## 4. Data Explorer Endpoints

### `POST /api/dataset/data`
- **Body**:
```json
{
  "page": 1,
  "page_size": 10,
  "search_query": "Blouse",
  "sort_column": "Purchase Amount (USD)",
  "sort_direction": "desc",
  "use_cleaned": true,
  "category_filter": "Clothing",
  "gender_filter": "Female",
  "season_filter": "Spring"
}
```
- **Response**: `200 OK` with `total_rows`, `page`, `page_size`, `total_pages`, `columns`, and `rows`.

---

## 5. Reports & Exports Endpoints

### `GET /api/reports/pdf?use_cleaned=true`
- **Response**: `200 OK` binary stream with `Content-Type: application/pdf` and `Content-Disposition: attachment; filename=retail_analytics_report.pdf`.

### `GET /api/exports/cleaned-csv`
- **Response**: `200 OK` binary stream with `Content-Type: text/csv` containing the cleaned dataset.

### `GET /api/exports/summary-csv?use_cleaned=true`
- **Response**: `200 OK` binary stream with `Content-Type: text/csv` containing structured summary metrics and ranking tables.
