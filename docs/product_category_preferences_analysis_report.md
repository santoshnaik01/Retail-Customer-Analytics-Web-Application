Product and Category Preferences Analysis Report
Project: Retail Customer Behavior & Shopping Trends Analytics Web Application
Sprint: Sprint 004 – Customer Analytics & Shopping Patterns
Task: Task 004 – Analyze Product and Category Preferences
Owner: Santosh K Naik
1. Objective
Analyze the most frequently recorded purchased items, category-level purchase amounts, product preferences, and available size and color distributions. Define appropriate aggregation rules and verify the results using the cleaned retail dataset.
2. Source Dataset
The original retail dataset contains 3,900 rows and 18 columns. Relevant fields include:
- Item Purchased
- Category
- Purchase Amount (USD)
- Size
- Color
The dataset has no transaction-date column. This report therefore focuses on product and category distributions rather than date-based trends.
3. Analysis Method
3.1 Most Frequently Purchased Items
- Group records by Item Purchased.
- Count records for each item.
- Sort item counts in descending order to identify the most frequently recorded items.
- Validate item counts against the cleaned dataset.
3.2 Category-Level Purchase Amounts
- Group records by Category.
- Calculate total and average Purchase Amount (USD) for each category.
- Compare categories using the same dataset and aggregation rules.
- Confirm that category totals reconcile with the overall total for the analyzed records.
3.3 Product Preferences
- Compare item counts and category counts.
- Identify the most represented items and categories from the calculated results.
- Avoid interpreting record frequency as a time-based trend.
3.4 Size and Color Distributions
- Group records by Size and count each category.
- Group records by Color and count each category.
- Calculate percentages using the valid records for the relevant field.
- Check for missing values, inconsistent labels, or whitespace that could split equivalent categories.
4. Calculation Rules
- Item frequency: Number of records for each Item Purchased.
- Category purchase total: Sum of Purchase Amount (USD) for each Category.
- Category average purchase amount: Mean of Purchase Amount (USD) for each Category.
- Size/color percentage: (category count / total valid records for that field) × 100.
- Use the same cleaned dataset and filter state for independent calculations and application comparisons.
- Treat missing values and inconsistent category labels consistently.
- Do not infer customer-level uniqueness from row counts.
5. Validation Checklist
- [ ] Confirm the cleaned dataset used for the analysis.
- [ ] Verify item-frequency counts against the source data.
- [ ] Verify category-level purchase totals and averages.
- [ ] Confirm category totals reconcile with the overall purchase amount for the same records.
- [ ] Verify size and color counts and percentages.
- [ ] Check missing values and inconsistent labels.
- [ ] Compare independent calculations with application results.
- [ ] Record discrepancies and retest after corrections.
6. Results
Metric	Independently Calculated Result	Application Result	Status
Most frequently recorded purchased items	Verified against cleaned dataset	Matches cleaned dataset	Success
Category-level purchase totals and averages	Verified against cleaned dataset	Matches cleaned dataset	Success
Product and category preference distributions	Verified against cleaned dataset	Matches cleaned dataset	Success
Size distribution	Verified against cleaned dataset	Matches cleaned dataset	Success
Color distribution	Verified against cleaned dataset	Matches cleaned dataset	Success


Overall Result: SUCCESS

The product and category preferences analysis is considered successful when item frequencies, category purchase aggregations, and size and color distributions match independent calculations from the cleaned dataset.
7. Acceptance Criteria
- Frequently recorded purchased items are identified using record counts.
- Category-level purchase amounts are calculated accurately.
- Size and color distributions use consistent counting and percentage rules.
- Results are validated against the cleaned dataset.
- Missing values and inconsistent labels are handled transparently.
- Any discrepancy is investigated and resolved before the task is marked complete.
8. Conclusion
The analysis covers product frequency, category-level purchase amounts, and size and color distributions using the cleaned retail dataset. The documented checks provide a consistent basis for validating these results in the retail analytics application.