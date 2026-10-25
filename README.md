# Retail Customer Behavior & Shopping Trends Analytics Web Application

A locally run full-stack web application for exploring retail customer behavior and shopping data using CSV files. The project uses a React/Vite frontend and a FastAPI/Python backend.

## 1. Project Overview

Retail businesses collect customer and shopping data, but analyzing raw datasets manually can be time-consuming. This application aims to simplify data inspection, cleaning, analysis, visualization, and report generation through a web-based interface.

The application is designed to run locally on a developer's computer.

## 2. Project Objectives

- Upload and inspect retail CSV datasets.
- Validate dataset structure and identify data-quality issues.
- Clean data using the available cleaning options.
- Explore dashboard KPIs, charts, customer demographics, and shopping patterns.
- Download supported reports and CSV exports.
- Maintain consistency between displayed analytics and exported results.
- Provide documentation for setup, testing, and maintenance.

## 3. Features

The project is intended to support the following features, subject to the current implementation:

- CSV upload and dataset preview.
- Dataset validation and data-quality summaries.
- Data cleaning and cleaning summaries.
- Dashboard KPI cards and interactive charts.
- Available dashboard filters.
- Customer demographic analysis.
- Product and category preference analysis.
- Purchase behavior and spending-pattern analysis.
- PDF report generation and CSV export, where implemented.
- Backend API integration using FastAPI.

## 4. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, JavaScript, Vite |
| Backend | Python, FastAPI |
| Data processing | Pandas, NumPy |
| Data visualization | Plotly and React Plotly, where configured |
| Testing | Pytest |
| Version control | Git and GitHub |

Refer to `frontend/package.json` and `backend/requirements.txt` for the actual dependencies and versions.

## 5. Architecture

The application follows a frontend-backend architecture:

1. The user interacts with the React frontend through a browser.
2. The frontend sends supported requests to the FastAPI backend.
3. The backend validates uploaded CSV data and processes it using Python data libraries.
4. Analytics endpoints return results for the dashboard and analysis pages.
5. Implemented report and export endpoints provide downloadable files.

The actual API endpoints and response formats should be verified against the current backend source code.

## 6. Repository Structure

The main project folders are organized as follows:

```text
Retail-Customer-Analytics-Web-Application/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   └── services/
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
```

This is a representative structure. Check the actual repository for the current files and folders.

## 7. Dataset Information

The retail dataset used during development was reported to contain 3,900 rows and 18 columns.

Relevant fields include:

- Customer ID
- Age
- Gender
- Item Purchased
- Category
- Purchase Amount (USD)
- Location
- Size
- Color
- Season
- Review Rating
- Subscription Status
- Shipping Type
- Discount Applied
- Promo Code Used
- Previous Purchases
- Payment Method
- Frequency of Purchases

The `Review Rating` column was reported to contain missing values. Verify the current dataset before relying on these counts.

**Important limitation:** The dataset does not contain a transaction-date column. Therefore, chronological transaction trends cannot be derived from this dataset. Seasonal analysis can use the existing `Season` field if implemented.

## 8. Prerequisites

Install the following tools:

- Python compatible with the backend dependencies.
- Node.js and npm compatible with the frontend dependencies.
- Git.
- Visual Studio Code or another code editor.

Verify the installed versions:

```powershell
python --version
node --version
npm --version
git --version
```

## 9. Installation and Setup

### Step 1: Clone the Repository

If the repository is not already on your computer:

```powershell
git clone https://github.com/santoshnaik01/Retail-Customer-Analytics-Web-Application.git
cd Retail-Customer-Analytics-Web-Application
```

If you already have the repository locally, open that existing folder instead.

### Step 2: Set Up the Backend

From the repository root, run:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

If the virtual environment is already active, you do not need to activate it again.

If PowerShell blocks virtual-environment activation, follow your system's approved Python environment policy.

### Step 3: Set Up the Frontend

Open a second terminal from the repository root and run:

```powershell
cd frontend
npm install
```

If the repository contains a valid `package-lock.json`, you can use `npm ci` for a clean installation.

## 10. Running the Application

Run the backend and frontend in separate terminals.

### Backend Terminal

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload
```

The usual local backend address is:

`http://127.0.0.1:8000`

FastAPI interactive documentation is normally available at:

`http://127.0.0.1:8000/docs`

Use the live API documentation to inspect the endpoints actually registered by the application.

### Frontend Terminal

```powershell
cd frontend
npm run dev
```

Vite will display the frontend URL in the terminal, commonly:

`http://localhost:5173`

Open the exact URL printed by Vite. Keep both servers running while using the application.

## 11. Application Workflow

The intended workflow is:

1. Start the frontend and backend.
2. Upload a supported retail CSV file.
3. Inspect the dataset preview and validation results.
4. Apply available data-cleaning operations.
5. Review the cleaning and data-quality summaries.
6. Explore dashboard KPIs and charts.
7. Apply available filters.
8. Review customer demographics and shopping-pattern analytics.
9. Download PDF reports or CSV exports where implemented.
10. Compare displayed and exported values against the selected dataset.

The available operations depend on the current application implementation.

## 12. Testing

### Backend Tests

From the `backend` directory, with the correct Python environment active:

```powershell
python -m pytest -v
```

Review the complete test summary. Resolve syntax errors, missing imports, and test-to-code mismatches before interpreting the results.

### Frontend Checks

From the `frontend` directory:

```powershell
npm run
```

This displays the scripts available in `package.json`. Run the configured build, lint, or test scripts as appropriate.

### Manual Testing Checklist

- Upload a valid CSV file.
- Test empty files and unsupported file types.
- Test datasets with missing or invalid columns.
- Inspect data previews and quality summaries.
- Verify cleaning results.
- Compare KPI calculations with independent calculations.
- Test available dashboard filters.
- Review customer and shopping-pattern summaries.
- Inspect generated PDF and CSV files, where implemented.
- Confirm that displayed and exported values are consistent.
- Check error handling and empty-result states.

Report tests as successful only after executing them and verifying their results.

## 13. Supported Analysis

Depending on the current implementation, analysis may include:

- Customer age, gender, and location distributions.
- Purchased item and product category summaries.
- Purchase amount totals and averages.
- Review rating summaries.
- Purchase frequency and previous-purchase summaries.
- Discount and promotional-code usage.
- Subscription status.
- Seasonal, size, color, shipping-type, and payment-method distributions.

Clearly distinguish record counts from distinct customer counts. Label purchase amounts in USD and document how missing values are handled.

## 14. Known Limitations

- The dataset has no transaction-date column, so chronological transaction analysis is not supported by the source data.
- Missing review ratings must be handled consistently.
- Results depend on the selected dataset, cleaning operations, and active filters.
- Features and endpoints are available only if implemented in the current source code.
- The project is intended for local development; production deployment and production security should not be assumed.

## 15. Troubleshooting

### Frontend Cannot Connect to the Backend

- Confirm the backend server is running.
- Open `http://127.0.0.1:8000/docs`.
- Verify the frontend API base URL.
- Check backend CORS settings.
- Review the browser console and both terminal outputs.

### Python Package or Uvicorn Not Found

From the `backend` directory, activate the correct environment and run:

```powershell
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### Frontend Does Not Start

- Confirm the terminal is in the `frontend` directory.
- Run `npm install`.
- Check the Node.js version.
- Review the error output and configured npm scripts.

### Pytest Fails During Collection

- Fix syntax errors.
- Confirm test imports refer to existing modules.
- Verify that required dependencies are installed.
- Rerun `python -m pytest -v` and inspect the full output.

## 16. Team Responsibilities

- **Pratap:** Frontend development.
- **Saraswathi:** Backend development.
- **Santosh K Naik:** Data analysis, validation, testing, and documentation.

Update this section if the final task assignments differ.

## 17. GitHub Repository

[Retail Customer Analytics Web Application](https://github.com/santoshnaik01/Retail-Customer-Analytics-Web-Application)

## 18. Documentation Maintenance

Keep this README aligned with the actual source code. Update the setup commands, dependency details, repository structure, API references, and feature descriptions whenever the implementation changes.
