# Testing & Verification Documentation

This project enforces rigorous automated testing for data handling, cleaning logic, analytics accuracy, report generation, and error conditions.

---

## 1. Automated Test Suite (Pytest)

The test suite is located in `backend/tests/test_all_endpoints.py` and executed via:

```bash
cd backend
python -m pytest tests/test_all_endpoints.py -v
```

### Test Coverage Summary:

| Test Case | Endpoint / Target | Verification Focus | Result |
| :--- | :--- | :--- | :--- |
| `test_root_endpoint` | `GET /` | Returns API status, loaded dataset info, 3,900 count | **PASSED** |
| `test_health_endpoint` | `GET /api/health` | Validates health status & dataset readiness | **PASSED** |
| `test_dataset_summary` | `GET /api/dataset/summary` | Verifies 3,900 rows, 18 columns, available filter lists | **PASSED** |
| `test_dataset_quality` | `GET /api/dataset/quality` | Confirms missing values identification & health score | **PASSED** |
| `test_clean_dataset_endpoint` | `POST /api/dataset/clean` | Validates rating imputation (37 values), whitespace trim | **PASSED** |
| `test_dashboard_kpis_and_charts` | `POST /api/dashboard` | Confirms KPIs (customers, spend, ratings) & 4 charts | **PASSED** |
| `test_dashboard_with_filters` | `POST /api/dashboard` | Tests filtering (Clothing + Male) & dynamic recalculation | **PASSED** |
| `test_customer_analytics` | `POST /api/analytics/customers` | Verifies age brackets, gender donut, location ranking | **PASSED** |
| `test_shopping_patterns` | `POST /api/analytics/shopping-patterns` | Checks category revenue, 25-item ranking, frequencies | **PASSED** |
| `test_data_explorer_pagination_and_search` | `POST /api/dataset/data` | Tests pagination, column sorting, global text search | **PASSED** |
| `test_upload_validation_errors` | `POST /api/upload` | Tests rejection of `.txt` and empty CSV files (400 errors) | **PASSED** |
| `test_report_downloads` | `GET /api/reports/pdf`, `/api/exports/*` | Verifies valid PDF binary (`%PDF`) & CSV exports | **PASSED** |

**Execution Result**: `12 passed in 12.79s (100% success rate)`.

---

## 2. Frontend Build & Type Validation

Executed via:
```bash
cd frontend
npm run build
```

- **Vite Production Compiler**: Built without errors in `6.59s`.
- Output bundles: `dist/index.html`, `dist/assets/*.css`, `dist/assets/*.js`.
