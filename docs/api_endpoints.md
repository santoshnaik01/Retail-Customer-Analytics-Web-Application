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

More endpoints (upload, KPIs, analytics, reports) will be added in later sprints.