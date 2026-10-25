Technical Documentation
Retail Customer Behavior & Shopping Trends Analytics Web Application
Document purpose: Technical reference for application workflow, API contracts, data cleaning, KPI calculations, reporting, testing, and contribution practices.
Source basis: Project ZIP retail-customer-analytics.zip, including its README.md, docs/api-design.md, docs/architecture.md, docs/workflow.md, docs/testing.md, and backend service modules.
Implementation note: This document reflects the project ZIP. Confirm that the same routes, modules, and behavior exist in the working GitHub repository before treating this as a verified description of the current branch.

1. System Overview
The application is a locally run, full-stack retail analytics application. It accepts a retail CSV file, validates and inspects the data, creates a cleaned dataset, calculates analytical summaries, displays interactive dashboards, and provides PDF and CSV downloads.
Objectives
- Upload and validate retail CSV data.
- Inspect schema, missing values, duplicates, and data quality.
- Clean data using transparent operations.
- Calculate KPIs and group-level analytics from the selected dataset.
- Explore customer demographics and shopping patterns.
- Search, filter, sort, and paginate dataset records.
- Generate a PDF analytics report and CSV exports.
- Support repeatable testing and local development.
2. Technology Stack
Layer	Technologies described in the ZIP
Frontend	React 19, JavaScript, Vite, React Router v7, HTML5, CSS3
Visualizations and icons	Plotly.js, react-plotly.js, Lucide React
Backend	Python 3.11, FastAPI, Uvicorn, Pydantic v2
Data processing	Pandas, NumPy
Upload support	Python-Multipart
Reports and exports	ReportLab, Python CSV/Pandas
Testing	Pytest, HTTPX TestClient
Version control	Git and GitHub


The ZIP's frontend/package.json and backend/requirements.txt are the authoritative places to check installed dependencies and versions.
3. Architecture
The application uses a separated frontend/backend design.
1. React frontend: Presents navigation, upload controls, preview tables, filters, KPI cards, charts, analytics pages, and download actions.
2. FastAPI backend: Receives requests, validates input, routes requests to service functions, and returns JSON or downloadable files.
3. Dataset manager: Maintains the original and cleaned datasets in memory during the running backend session.
4. Cleaning service: Produces a cleaned dataset and records cleaning outcomes.
5. Analytics service: Calculates dashboard KPIs, customer demographics, and shopping-pattern aggregations.
6. Report service: Generates a PDF report and CSV output.
7. Dataset files: The ZIP describes data/shopping_trends.csv as the default dataset.
Data flow
CSV upload or default dataset
          |
          v
File and schema validation
          |
          v
Original dataset held in memory
          |
          v
Cleaning service -> cleaned dataset
          |
          v
Analytics service -> KPIs, charts, tables, insights
          |
          +----> React dashboard and analysis pages
          |
          +----> Report service -> PDF / CSV downloads
Storage boundary
The ZIP describes in-memory dataset management, not permanent database storage. Treat uploaded/cleaned dataset state as session/runtime state unless the current implementation explicitly provides persistence. Authentication, online deployment, permanent database storage, and predictive analytics are described as future enhancements rather than initial-release requirements.
4. Repository Structure
The ZIP describes the following principal files and directories:
Retail-Customer-Analytics-Web-Application/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes_upload.py
│   │   │   ├── routes_dashboard.py
│   │   │   ├── routes_analytics.py
│   │   │   ├── routes_explorer.py
│   │   │   └── routes_reports.py
│   │   ├── schemas/
│   │   ├── services/
│   │   │   ├── dataset_manager.py
│   │   │   ├── cleaning_service.py
│   │   │   ├── analytics_service.py
│   │   │   └── report_service.py
│   │   ├── config.py
│   │   └── main.py
│   ├── tests/
│   │   └── test_all_endpoints.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── data/
│   └── shopping_trends.csv
├── docs/
│   ├── architecture.md
│   ├── workflow.md
│   ├── api-design.md
│   └── testing.md
└── README.md
Use the actual checked-out repository to resolve any differences in file names or structure.
5. Local Setup and Execution
Prerequisites
- Python version compatible with backend/requirements.txt (the ZIP README specifies Python 3.11).
- Node.js and npm compatible with the frontend dependencies.
- Git.
- Visual Studio Code or another code editor.
Check installed tools:
python --version
node --version
npm --version
git --version
Backend setup
From the repository root:
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
Backend base URL: http://localhost:8000
Interactive API documentation: http://localhost:8000/docs
Frontend setup
Open a second terminal from the repository root:
cd frontend
npm install
npm run dev
Vite's development URL is usually http://localhost:5173; use the exact URL printed by the terminal.

Keep both servers running while using the application.
6. Application Workflow
The ZIP's workflow documentation defines these steps:
1. Run locally: Start the FastAPI backend and Vite frontend.
2. Upload and clean: Upload a CSV or use the default shopping_trends.csv; inspect dataset quality; run cleaning; compare original and cleaned previews.
3. Overview dashboard: Review KPIs, category spending, gender distribution, top products, ratings, insights, and available filters.
4. Customer analytics: Review age groups, location distribution, gender, subscription status, previous-purchase groups, and demographic summary tables.
5. Shopping patterns: Review category spending, product rankings, purchase-frequency categories, discount use, payment methods, and shipping preferences.
6. Data explorer: Search records, filter supported fields, sort columns, switch original/cleaned data, and paginate.
7. Reports center: Download a PDF analytics report, cleaned dataset CSV, and summary analytics CSV.
8. Verification: Run automated tests and manually check calculations, API responses, error handling, and downloaded output.
7. API Endpoint Reference
The following routes are documented by the ZIP's docs/api-design.md. Confirm their availability through /docs on the running backend.
Method	Endpoint	Purpose
GET	/	API status and dataset metadata
GET	/api/health	Health and dataset readiness
POST	/api/upload	Upload CSV using multipart/form-data with field file
GET	/api/dataset/summary	Dataset dimensions, schema, types, and filter options
GET	/api/dataset/quality	Missing values, duplicate count, and data-health summary
POST	/api/dataset/clean	Run configured data-cleaning operations
POST	/api/dataset/reset	Reset to the default dataset
POST	/api/dashboard	Calculate dashboard KPIs, charts, and insights for filter parameters
POST	/api/analytics/customers	Customer demographic analytics
POST	/api/analytics/shopping-patterns	Shopping-pattern summaries and product rankings
POST	/api/dataset/data	Search, filter, sort, and paginate dataset records
GET	/api/reports/pdf?use_cleaned=true	Download PDF analytics report
GET	/api/exports/cleaned-csv	Download cleaned dataset CSV
GET	/api/exports/summary-csv?use_cleaned=true	Download summary analytics CSV


API notes
- Upload requests use multipart/form-data; the uploaded file field is named file.
- The ZIP API design states that unsupported file extensions and empty uploads return 400 Bad Request.
- Analytics endpoints accept filter parameters. The documented filter fields include category, gender, location, season, subscription status, payment method, and whether to use cleaned data.
- The data explorer request includes page number, page size, search query, sort column/direction, original-versus-cleaned selection, and supported category/gender/season filters.
- PDF and CSV endpoints return downloadable content rather than ordinary dashboard JSON.
- Consult the live OpenAPI documentation for exact schemas and error response bodies.
8. Data Cleaning Rules
The ZIP's cleaning service describes these operations:
1. Keep the original dataset separate from the cleaned dataset.
2. Impute missing Review Rating values using a configurable strategy.
3. Supported rating imputation strategies in the API contract include:
   - category_mean
   - category_median
4. Trim leading and trailing whitespace from text values.
5. Remove exact duplicate rows when that option is enabled.
6. Validate numeric values and preserve a cleaning log/summary.
7. Report before-and-after quality information so users can understand the impact of cleaning.
Example clean request from the ZIP
{
  "impute_missing_rating": true,
  "imputation_strategy": "category_mean",
  "trim_whitespace": true,
  "remove_duplicates": true
}
Use the exact field names and accepted values implemented by the current backend. Do not assume an operation ran successfully until the API response or test output confirms it.
9. KPI Definitions and Calculation Rules
The ZIP's backend/app/services/analytics_service.py defines the following dashboard calculations.
KPI	Definition
Total Customers	Distinct count of Customer ID (nunique) when the column exists; otherwise the record count is used
Total Purchase Amount (USD)	Sum of Purchase Amount (USD)
Average Purchase Amount (USD)	Mean of Purchase Amount (USD), rounded to 2 decimal places
Average Review Rating	Mean of non-missing Review Rating, rounded to 2 decimal places
Total Records	Number of rows in the currently analyzed dataframe


Calculation and interpretation rules
- KPI calculations must use the dataset selected for analysis and the active filters.
- Total Purchase Amount is the sum of recorded purchase amounts; it should not be described as audited corporate revenue.
- Distinct customer count is not necessarily the same as the number of purchase records.
- The average rating should exclude missing rating values unless the implementation explicitly imputes them in the selected cleaned dataset.
- Group percentages should use the corresponding valid-record denominator, and category totals should be reconciled with the filtered dataset.
- Use source data and computed results, not illustrative values from UI reference images.
10. Supported Analytics
The ZIP describes these analytical views:
Overview dashboard
- KPI cards for customer count, total purchase amount, average purchase, average review rating, and record count.
- Purchase amount by category.
- Customer distribution by gender.
- Top products by purchase amount.
- Review ratings by category.
- Summary insights such as leading location, category, payment method, and shipping type.
- Available filters for category, gender, location, season, subscription status, and payment method.
Customer analytics
- Age group distribution (18–25, 26–35, 36–45, 46–55, 56+).
- Geographic distribution.
- Gender and subscription summaries.
- Previous-purchase distribution.
- Demographic summary table with customer counts, share, spending, and subscription rate.
Shopping patterns
- Purchase amount by category and product.
- Purchase-frequency distribution.
- Discount and promotional-code usage.
- Payment-method and shipping-type preferences.
- Product ranking tables.
Data explorer
- Original/cleaned dataset selection.
- Global text search.
- Supported categorical filters.
- Column sorting.
- Pagination with page sizes described in the ZIP as 10, 25, 50, and 100.
11. PDF and CSV Reporting
The ZIP's report service uses ReportLab for PDF generation and Pandas/CSV utilities for exports.
- PDF analytics report: Executive KPI summary, category spending, customer demographic summaries, product rankings, insights, and methodology/limitations notes.
- Cleaned dataset CSV: Tabular cleaned dataset without a dataframe index.
- Summary analytics CSV: Aggregated KPI and analytics summaries.
Export verification
For each export, verify:
1. The request returns a successful status.
2. PDF content has a valid PDF signature and opens in a PDF reader.
3. CSV headers and columns are present and correctly labeled.
4. Row counts and representative values match the selected dataset state.
5. Filters or cleaned/original selection are applied consistently where supported.
6. Missing values and monetary values are represented consistently and accurately.
12. Testing Approach
The ZIP places backend tests in backend/tests/test_all_endpoints.py.

Run the backend tests from the backend directory:
cd backend
python -m pytest tests/test_all_endpoints.py -v
The ZIP's docs/testing.md lists coverage for:
- Root and health endpoints.
- Dataset summary and quality.
- Cleaning endpoint.
- Dashboard KPIs, charts, and filters.
- Customer analytics.
- Shopping-pattern analytics.
- Data explorer pagination, sorting, and search.
- Invalid upload and empty-file errors.
- PDF and CSV downloads.
Build the frontend using the script defined by the current frontend/package.json; the ZIP README specifies:
cd frontend
npm run build
Test reporting rule: The ZIP's test document records a historical result of 12 passing backend test suites and a successful frontend build. Re-run tests in the current working repository before reporting that result as current. A report or checklist is not proof that tests passed.
13. Analytical Limitations and Data Integrity
- The ZIP states that the retail dataset contains no transaction-date timestamp column. Daily, weekly, monthly, and historical revenue time-series must not be inferred or fabricated.
- Season is an independent categorical attribute, not a transaction date.
- All displayed metrics should be calculated from the active dataset; illustrative values in design references must not be copied into results.
- The ZIP describes in-memory dataset handling; permanent storage across server restarts should not be assumed.
- Authentication, online deployment, database persistence, and predictive analytics are outside the initial scope described in the ZIP.
- Metric labels should use precise wording such as Total Purchase Amount, not audited corporate revenue.
14. Git and Contribution Workflow
The ZIP uses Git/GitHub for source control and assigns work as follows:
- Pratap: Frontend components, navigation, responsive UI, charts, filters, data explorer, and download controls.
- Sarswati: Backend APIs, CSV validation, cleaning pipeline, PDF generator, CSV exports, and CORS configuration.
- Santosh K Naik: Dataset inspection, analytical correctness, KPI definitions, automated testing, and documentation.
Recommended workflow
1. Pull the latest shared branch before starting work.
2. Check git status and identify files relevant to the assigned task.
3. Make task-scoped changes and run the relevant tests.
4. Review staged changes before committing.
5. Use a descriptive commit message.
6. Push only after resolving any branch divergence and checking that unrelated changes are not included.
Example commands (adapt to your actual branch state):
git status --short
git add docs/TECHNICAL_DOCUMENTATION.md
git diff --cached --stat
git commit -m "Sprint 006 Task 008 - Finalize Technical Documentation"
git push origin main
If main is behind origin/main, synchronize carefully before pushing. Inspect local changes before pulling; do not overwrite teammates' uncommitted work.
15. Maintenance Checklist
Update this document whenever any of the following changes:
- API route names, methods, request fields, or response schemas.
- Data-cleaning options or imputation strategies.
- KPI formulas or denominator rules.
- Dataset schema or data-quality characteristics.
- Frontend routes, navigation, or supported filters.
- Report contents, export columns, or download behavior.
- Setup commands, dependencies, or test commands.
Before marking the technical-documentation task complete, compare this document with the source code in the current repository and correct any differences.