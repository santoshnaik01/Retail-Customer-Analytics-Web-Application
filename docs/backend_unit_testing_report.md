Backend Unit Testing Report
Project: Retail Customer Behavior & Shopping Trends Analytics Web Application
Sprint: Sprint 006 – Testing, Bug Fixing & Final Delivery
Task: Task 001 – Create Backend Unit Tests
Owner: Santosh K Naik
1. Objective
Create and run Pytest unit tests for data validation, data cleaning, KPI calculations, analytical functions, and CSV export logic. Verify expected outputs using sample datasets and cover missing values, duplicates, invalid data, and empty inputs.
2. Test Scope
- Dataset structure and required-column validation.
- Missing values, duplicate rows, and invalid data handling.
- Data-cleaning behavior and cleaning summaries.
- KPI calculation functions.
- Customer and shopping-pattern analytical functions.
- CSV export content, column headers, and row counts.
- Empty inputs and invalid inputs.
3. Test Scenarios and Results
Test ID	Area	Expected Result	Status
UT-001	Valid dataset validation	Valid sample dataset is accepted	Success
UT-002	Missing required columns	Validation reports missing columns	Success
UT-003	Missing values	Missing values are detected and handled according to the cleaning rules	Success
UT-004	Duplicate rows	Duplicate rows are detected or handled according to the cleaning rules	Success
UT-005	Invalid data types or values	Invalid data is handled without incorrect calculations	Success
UT-006	Empty input	Empty input is handled safely	Success
UT-007	Data-cleaning functions	Output and cleaning summary match the defined rules	Success
UT-008	KPI calculations	Calculated values match independently verified sample results	Success
UT-009	Analytical functions	Customer and shopping-pattern outputs match expected results	Success
UT-010	CSV export logic	Export headers and contents match the expected dataset	Success


4. Test Execution
Run the backend tests from the backend directory:
python -m pytest -v
Confirm the final test summary, including passed, failed, and skipped tests. If a test fails, record the error, fix the relevant code or test, and rerun the suite.
5. Acceptance Criteria
- Unit tests cover validation, cleaning, KPI calculations, analytics, and CSV export logic.
- Tests include missing values, duplicates, invalid values, and empty inputs.
- Expected outputs are verified against known sample data.
- Tests run successfully with no unresolved failures.
- Any defect discovered during testing is documented and retested after correction.
6. Final Result
Overall Result: SUCCESS

The backend unit-testing task is considered successful when the Pytest suite runs successfully, the required areas and edge cases are covered, and the test summary confirms that all applicable tests pass with no unresolved failures.
7. Conclusion
This report documents the backend unit-testing scope for the retail analytics application. The tests are intended to protect dataset validation, cleaning behavior, KPI calculations, analytical functions, and CSV export logic against regressions.