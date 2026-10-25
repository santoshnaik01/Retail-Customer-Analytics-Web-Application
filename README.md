Retail Customer Behavior & Shopping Trends Analytics Web Application
A locally run full-stack web application for exploring retail customer behavior and shopping patterns from a CSV dataset. The application uses a React frontend and a FastAPI/Python backend to support data upload, validation, cleaning, analytics, and downloadable outputs.
Project status: Setup and feature descriptions should be verified against the current repository before this README is treated as final. This guide does not claim that unverified endpoints or tests have passed.

Table of Contents
- Project Overview
- Objectives
- Features
- Technology Stack
- Architecture
- Repository Structure
- Dataset
- Prerequisites
- Installation and Setup
- Running the Application
- API Documentation
- Testing
- Supported Analysis
- Known Limitations
- Troubleshooting
- Team Contributions
Project Overview
Retail teams can find it difficult to analyze raw customer and shopping data manually. This project provides a browser-based interface for inspecting a retail CSV, reviewing data quality, exploring analytical summaries, and exporting results.

The application is designed to run locally. It is not intended to be a hosted production service.
Objectives
- Make retail CSV data easier to inspect and analyze.
- Validate dataset structure and highlight data-quality issues.
- Provide a cleaning workflow and summarize its effects.
- Present customer and shopping-pattern summaries through KPIs and charts.
- Allow users to download supported report and export formats.
- Keep calculations traceable to the selected dataset and filters.
Features
The following are intended project capabilities. Availability depends on the implementation currently present in the repository:
- CSV upload and dataset preview.
- Dataset structure and quality validation.
- Data cleaning and cleaning-summary display.
- Dashboard KPI cards, charts, and available filters.
- Customer demographic analysis.
- Product, category, purchase-frequency, spending, discount, promotion, and subscription summaries.
- PDF report generation and CSV export, where implemented.
- FastAPI endpoints for frontend/backend communication.
Technology Stack
Layer	Technology
Frontend	React.js, JavaScript, Vite
Charts	Plotly / React Plotly integration, where used
Backend	Python, FastAPI
Data processing	Pandas, NumPy
Testing	Pytest
Version control	Git and GitHub


Check frontend/package.json and backend/requirements.txt for the exact installed dependencies and versions.
Architecture
1. The user interacts with the React frontend in a browser.
2. The frontend sends supported requests to the FastAPI backend.
3. The backend validates uploaded CSV content and processes data using Python data libraries.
4. Analytics endpoints return data for dashboard and analysis views.
5. Supported report/export endpoints return downloadable files.
The exact endpoint list and request/response schemas are defined by the current backend implementation and can be reviewed through the API documentation when the server is running.
Repository Structure
The repository is expected to contain the following main areas. The precise files may differ as development progresses.
Retail-Customer-Analytics-Web-Application/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   └── ...
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── data/
│   └── customer_shopping_behavior.csv
├── docs/
└── README.md
Use Get-ChildItem (PowerShell) or your editor's file explorer to confirm the current structure.
Dataset
The project dataset discussed during development is customer_shopping_behavior.csv, with approximately 3,900 records and 18 columns. It includes customer age and gender, purchased item, category, purchase amount in USD, location, size, color, season, review rating, subscription status, shipping type, discount/promo usage, previous purchases, payment method, and purchase frequency.

The Review Rating field has been reported to contain missing values. Recheck the actual CSV before relying on these counts, because the dataset may change.

Important: The dataset has no transaction-date column. Do not infer chronological trends from it. Seasonal comparisons should use the available Season field only.
Prerequisites
Install these tools before starting:
- Python 3.10 or another version supported by the project's backend dependencies.
- Node.js and npm versions compatible with the frontend dependencies.
- Git.
- A code editor such as Visual Studio Code.
Check installed versions:
python --version
node --version
npm --version
git --version
Installation and Setup
Run commands from the repository root unless a step says otherwise.
1. Get the repository
If you have not cloned the repository yet:
git clone https://github.com/santoshnaik01/Retail-Customer-Analytics-Web-Application.git
cd Retail-Customer-Analytics-Web-Application
If you already have the repository locally, open that existing folder instead of cloning into it again.
2. Set up the backend
cd backend
python -m venv .venv
Activate the virtual environment in Windows PowerShell:
.\.venv\Scripts\Activate.ps1
If PowerShell blocks activation, use your organization's approved Python environment policy or run the virtual-environment Python executable directly.

Install dependencies:
python -m pip install --upgrade pip
pip install -r requirements.txt
Return to the repository root before setting up the frontend:
cd ..
3. Set up the frontend
cd frontend
npm install
If the repository contains a committed lockfile, npm ci can be used for a clean, reproducible install. Do not delete or regenerate the lockfile without a reason.
Running the Application
Open two terminals in Visual Studio Code.
Terminal 1 — Backend
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
If your environment is already activated, omit the activation command. If the project uses a different documented entry point, follow the current backend configuration.

The usual local FastAPI address is:
- API base: http://127.0.0.1:8000
- Interactive API docs: http://127.0.0.1:8000/docs
Open the docs page to confirm the server is running and inspect the endpoints actually registered by the application.
Terminal 2 — Frontend
cd frontend
npm run dev
Vite usually prints the local frontend URL, commonly http://localhost:5173. Open the exact URL shown in your terminal.

Keep both terminal processes running while using the application.
API Documentation
When the backend is running, open:

http://127.0.0.1:8000/docs

Use this page to inspect the endpoints that are actually registered, their parameters, response formats, and error responses. Do not assume that a feature has an endpoint unless it appears in the running API or is documented by the current source code.
Testing
Backend tests
From the backend directory with the project's virtual environment active:
python -m pytest -v
Review the final summary. Do not report all tests as passed unless the command completes and confirms that result. If test collection fails, resolve import or syntax errors before interpreting test results.
Frontend checks
From the frontend directory:
npm run
This lists the scripts defined by the project. Run the available lint, test, or build scripts shown there; do not assume a test script exists.
Manual end-to-end checks
- Upload a valid CSV and inspect the preview.
- Test an empty file, unsupported file type, and invalid dataset structure.
- Review cleaning results and data-quality messages.
- Compare KPI values with independent calculations.
- Apply available filters and inspect updated charts and tables.
- Check customer and shopping-pattern summaries.
- Generate the PDF and inspect its readability and values, if PDF export is implemented.
- Export CSV and compare its headers, row count, and representative values with the selected dataset.
- Confirm errors and empty-result states are handled without crashing.
Supported Analysis
Analysis should be limited to columns and operations present in the dataset and application implementation. Examples include:
- Customer age, gender, and location distributions.
- Purchased item and product category summaries.
- Purchase amount totals and averages.
- Review rating summaries, with missing ratings handled consistently.
- Purchase frequency and previous-purchase summaries.
- Discount and promotional-code usage.
- Subscription status, season, size, color, shipping type, and payment-method distributions where implemented.
Clearly distinguish record counts from distinct-customer counts. Label purchase amounts in USD.
Known Limitations
- The dataset does not contain a transaction-date column, so chronological time-series analysis is not supported by the source data.
- Missing review ratings require explicit, consistent handling.
- Results depend on the selected dataset, cleaning operations, and active filters.
- Report generation, exports, filters, and analytics are only available to the extent that the current code implements them.
- This application is designed for local development; deployment, authentication, production security, and multi-user persistence should not be assumed.
Troubleshooting
Frontend cannot connect to the backend
- Confirm the backend server is running.
- Open http://127.0.0.1:8000/docs and check whether the API responds.
- Verify the frontend's configured API base URL and backend CORS settings.
- Read both terminal outputs and the browser console for the actual error.
uvicorn or a Python package is not found
- Confirm the backend virtual environment is activated.
- Run python -m pip install -r requirements.txt.
- Start the app using python -m uvicorn app.main:app --reload if the uvicorn command is not found.
npm run dev fails
- Confirm the terminal is in the frontend directory.
- Run npm install and retry.
- Check the error output and Node.js version against the project's dependencies.
Tests fail during collection
- Fix syntax errors and missing imports first.
- Ensure test imports match the actual modules in backend/app.
- Run python -m pytest -v again and review the full failure summary.
Team Contributions
- Pratap: Frontend development.
- Saraswathi: Backend development.
- Santosh K Naik: Data analysis, validation, testing, and project documentation.
Project Repository
GitHub: https://github.com/santoshnaik01/Retail-Customer-Analytics-Web-Application