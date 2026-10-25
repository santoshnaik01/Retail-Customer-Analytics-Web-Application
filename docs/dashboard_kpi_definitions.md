Dashboard KPI Definitions and Validation
Project: Retail Customer Behavior & Shopping Trends Analytics Web Application
Sprint: 003 – KPIs & Main Dashboard
Task: 001 – Define and Verify Dashboard KPIs
1. Purpose
This document defines the key performance indicators (KPIs) used by the retail analytics dashboard and records how their calculations should be verified against the source dataset.
2. Source Dataset
The project dataset contains 3,900 records and 18 columns.
Data-quality item	Known result
Total records	3,900
Total columns	18
Missing Review Rating values	37
Duplicate rows	0


The dataset has no transaction-date column, so this KPI specification does not define date-based metrics or trends.
3. KPI Definitions
KPI	Definition	Calculation / validation rule
Total Purchase Amount	Sum of all valid values in Purchase Amount (USD) for the dataset currently being analyzed.	Compare the application result with the sum calculated directly from the same source DataFrame.
Average Purchase Amount	Mean of valid values in Purchase Amount (USD).	Compare the application result with the source DataFrame mean. Confirm the currency/unit is displayed consistently.
Customer Count	Number of distinct customer identifiers in Customer ID.	Calculate the distinct count and check whether customer IDs are unique in the dataset. Do not assume row count equals customer count without verifying uniqueness.
Average Review Rating	Mean of non-missing values in Review Rating.	Exclude missing ratings from the mean; verify the result against the source DataFrame mean. The source dataset has 37 missing ratings before cleaning.
Purchase-Record Count	Number of records included in the current analysis.	Normally equals the number of rows in the analyzed DataFrame. Clearly distinguish records from distinct customers.


4. Validation Procedure
1. Load the same dataset used by the application.
2. Calculate each KPI independently from the source DataFrame.
3. Retrieve the corresponding KPI values from the backend API or dashboard.
4. Compare the application values with the independently calculated values.
5. Check the distinct count of Customer ID rather than assuming every row represents a different customer.
6. Verify that missing Review Rating values do not incorrectly contribute to the average rating.
7. Confirm that displayed labels and numeric formatting match the metric being shown.
8. Record the observed results and any differences before marking the task complete.
5. Results Record
Fill in this table after running the application and validating its calculations. Do not mark a KPI as passed until the actual output has been checked.
KPI	Independently calculated value	Application value	Result
Total Purchase Amount	To be measured	To be measured	Pending
Average Purchase Amount	To be measured	To be measured	Pending
Customer Count (distinct Customer ID)	To be measured	To be measured	Pending
Average Review Rating (excluding missing values)	To be measured	To be measured	Pending
Purchase-Record Count	3,900 for the original dataset	To be measured	Pending


6. Acceptance Criteria
- KPI formulas and labels are clearly defined.
- KPI calculations match independently calculated values from the same dataset.
- Customer count is based on distinct Customer ID values and uniqueness is checked.
- Missing review ratings are handled consistently and transparently.
- Purchase-record count is not confused with distinct customer count.
- Any discrepancy is investigated before the task is marked complete.
7. Scope Notes
- Validate against the same dataset state used by the dashboard (original or cleaned); document which state was used.
- If cleaning or filtering changes the analyzed rows, the KPI results may change accordingly.
- No date-based KPIs or time trends are specified because the dataset does not contain a transaction-date column.