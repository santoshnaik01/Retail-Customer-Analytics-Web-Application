Purchase Behavior and Spending Patterns Analysis Report
Project: Retail Customer Behavior & Shopping Trends Analytics Web Application
Sprint: Sprint 004 – Customer Analytics & Shopping Patterns
Task: Task 005 – Analyze Purchase Behavior and Spending Patterns
Owner: Santosh K Naik
1. Objective
Analyze purchase amounts, purchase-frequency categories, previous-purchase counts, and spending differences across available customer groups. Examine discount usage, promotional-code usage, and subscription status where relevant. Document calculation rules and avoid treating the dataset as transaction history unless supported by its structure.
2. Source Dataset
The original retail dataset contains 3,900 rows and 18 columns. Relevant fields include:
- Purchase Amount (USD)
- Frequency of Purchases
- Previous Purchases
- Discount Applied
- Promo Code Used
- Subscription Status
- Gender
- Age
- Category
The dataset does not contain a transaction-date column. This report therefore covers the available purchase attributes and spending patterns, not time-based purchase trends or a chronological transaction history.
3. Analysis Plan
3.1 Purchase Amounts and Spending
- Calculate total and average Purchase Amount (USD).
- Compare purchase amounts across relevant groups such as category, gender, or subscription status where useful.
- Use the same dataset state and filters for independent calculations and application comparisons.
3.2 Purchase Frequency
- Group records by Frequency of Purchases.
- Calculate counts and percentages for each frequency category.
- Describe these as recorded frequency categories, not observed transaction timelines.
3.3 Previous Purchases
- Summarize Previous Purchases using count, mean, median, minimum, and maximum where appropriate.
- Compare previous-purchase counts across selected customer groups if relevant.
- Do not infer dates or transaction sequences from this field.
3.4 Discounts and Promotional Codes
- Calculate counts and percentages for Discount Applied and Promo Code Used.
- Compare average purchase amounts for the recorded groups where appropriate.
- Check for missing values and inconsistent category labels.
3.5 Subscription Status
- Calculate counts and percentages by Subscription Status.
- Compare purchase amounts across subscription groups, if meaningful.
- Report descriptive differences without claiming causation.
4. Calculation Rules
- Total purchase amount: Sum of valid values in Purchase Amount (USD).
- Average purchase amount: Mean of valid values in Purchase Amount (USD).
- Category count: Number of records in each specified category.
- Category percentage: (category count / total valid records for that field) × 100.
- Previous-purchase summary: Descriptive statistics calculated from Previous Purchases.
- Use a consistent source dataset and filter state for independent calculations and application results.
- Handle missing values and inconsistent labels consistently.
- Describe group differences as associations, not proof that a discount or subscription caused a spending change.
5. Validation Checklist
- [ ] Confirm the dataset state used for the analysis.
- [ ] Verify total and average purchase amounts against independent calculations.
- [ ] Verify purchase-frequency counts and percentages.
- [ ] Verify previous-purchase summary statistics.
- [ ] Verify discount and promotional-code counts and percentages.
- [ ] Verify subscription-status counts and group spending comparisons.
- [ ] Check missing values and inconsistent category labels.
- [ ] Compare independent calculations with application results.
- [ ] Record discrepancies and retest after corrections.
6. Results
Metric	Independently Calculated Result	Application Result	Status
Total and average purchase amount	Verified against the analyzed dataset	Matches analyzed dataset	Success
Purchase-frequency counts and percentages	Verified against the analyzed dataset	Matches analyzed dataset	Success
Previous-purchase summary statistics	Verified against the analyzed dataset	Matches analyzed dataset	Success
Discount and promotional-code usage	Verified against the analyzed dataset	Matches analyzed dataset	Success
Subscription status and group spending comparisons	Verified against the analyzed dataset	Matches analyzed dataset	Success


Overall Result: SUCCESS

The purchase behavior and spending patterns analysis is considered successful when the reported calculations match independent calculations from the same dataset state and the results are interpreted according to the available columns.
7. Acceptance Criteria
- Purchase amounts and frequency categories are summarized accurately.
- Previous-purchase counts are analyzed without inventing transaction history.
- Discount, promotional-code, and subscription groups are compared using consistent calculations.
- Missing values and inconsistent labels are handled transparently.
- Results match independent calculations from the same dataset state.
- Differences between groups are described without unsupported causal claims.
8. Conclusion
The task documents purchase amounts, recorded purchase-frequency categories, previous-purchase counts, discount and promotional-code usage, and subscription status. The validation checks provide a consistent basis for reviewing these calculations in the retail analytics application. No date-based purchase trends are included because the dataset has no transaction-date column.