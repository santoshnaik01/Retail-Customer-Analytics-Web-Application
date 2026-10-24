# API Endpoints and Response Format

## Success response
{ "status": "success", "data": { }, "message": "OK" }

## Error response
{ "status": "error", "error": { "code": "INVALID_REQUEST", "message": "The request data is invalid." } }

## Endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | / | Confirms the API is running |
| GET | /api/health | Health check |
| POST | /api/upload | Upload a CSV file; returns row count, column count, column names and data types |
| GET | /api/dataset/summary | Dataset name, status, row and column counts |
| GET | /api/dataset/quality | Validation report from the validation service (valid, issues, warnings, checks) |
| POST | /api/dataset/clean | Clean the dataset; optional body {"impute_missing_rating": "median" or "mean"} |
| GET | /api/dataset/preview | Table rows: version=original or cleaned, page, page_size |

More endpoints (upload, KPIs, analytics, reports) will be added in later sprints.