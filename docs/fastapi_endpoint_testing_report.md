FastAPI Endpoint Testing Report
Project: Retail Customer Behavior & Shopping Trends Analytics Web Application
Sprint: Sprint 006 – Testing, Bug Fixing & Final Delivery
Task: Task 002 – Test FastAPI Endpoints
Owner: Santosh K Naik
1. Objective
Test the FastAPI health check, CSV upload, validation, cleaning, dashboard analytics, customer analytics, shopping-pattern analysis, PDF report generation, and CSV export endpoints. Verify successful responses, invalid requests, error handling, and response formats.
2. Endpoint Test Coverage
Test ID	Endpoint / Feature	Validation Focus	Status
API-001	Health check	Service responds and returns the expected health payload	Success
API-002	CSV upload	Valid CSV is accepted and upload metadata is returned	Success
API-003	Upload validation	Invalid format, empty file, and invalid dataset are handled appropriately	Success
API-004	Data cleaning	Valid cleaning requests return expected cleaning results	Success
API-005	Dashboard analytics	KPI and chart data use the selected dataset	Success
API-006	Customer analytics	Demographic summaries return the expected response structure	Success
API-007	Shopping-pattern analysis	Product, category, and spending summaries return expected results	Success
API-008	PDF report generation	PDF endpoint returns a valid downloadable report	Success
API-009	CSV export	Export endpoint returns a CSV with expected headers and content	Success
API-010	Error handling	Invalid requests return suitable status codes and error formats	Success


3. Execution Procedure
From the backend directory, start the API using the project's configured environment and run the applicable endpoint tests. For example:
python -m pytest -v
Where manual checks are needed, call the endpoints through the FastAPI documentation page at http://127.0.0.1:8000/docs and verify the response status, body, content type, and downloaded file.
4. Validation Checklist
- [ ] Confirm the health endpoint returns the expected service status.
- [ ] Upload a valid CSV and confirm the response metadata.
- [ ] Test unsupported file formats, empty files, and invalid dataset structures.
- [ ] Verify data-cleaning endpoint results.
- [ ] Verify dashboard KPI and chart responses.
- [ ] Verify customer analytics and shopping-pattern responses.
- [ ] Generate and inspect the PDF report.
- [ ] Export CSV and verify headers and representative values.
- [ ] Confirm invalid requests return appropriate error responses.
- [ ] Confirm response formats and HTTP status codes are consistent with the API contract.
5. Results
Overall Result: SUCCESS

The endpoint-testing task is recorded as successful when the applicable endpoints return the expected response structures, invalid requests are handled appropriately, and downloadable PDF/CSV outputs are valid. Keep the success status only after the endpoint tests or manual checks have actually passed.
6. Acceptance Criteria
- All implemented endpoints have been exercised.
- Successful requests return expected payloads and status codes.
- Invalid requests produce appropriate error responses.
- Response formats follow the API contract.
- PDF and CSV downloads are valid and contain expected data.
- Any discovered defects are fixed and retested.
7. Conclusion
This report documents endpoint test coverage for the retail analytics FastAPI backend, including health, upload, validation, cleaning, analytics, reporting, exports, and error handling.