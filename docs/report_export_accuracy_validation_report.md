Report and Export Accuracy Validation Report
Project: Retail Customer Behavior & Shopping Trends Analytics Web Application
Sprint: Sprint 005 – Reports, Exports & Integration
Task: Task 006 – Verify Report and Export Accuracy
Owner: Santosh K Naik
1. Objective
Verify that PDF report values and exported CSV data agree with the cleaned dataset and verified analytics calculations. Check column headers, row counts, numerical precision, missing values, filtered summaries where supported, and report readability.
2. Validation Scope
- PDF report values against the cleaned dataset and verified analytics.
- Exported CSV column headers and row counts.
- Numerical precision and formatting.
- Missing-value representation.
- Filtered summaries where filtering is supported by the export workflow.
- PDF readability, labels, and report structure.
3. Validation Checklist
- [ ] Compare PDF KPI values with independently calculated values.
- [ ] Verify PDF purchase amounts are labelled in USD.
- [ ] Verify exported CSV headers match the intended schema.
- [ ] Verify exported CSV row counts against the dataset being exported.
- [ ] Compare representative exported values with the cleaned dataset.
- [ ] Check numeric precision and rounding.
- [ ] Check how missing values are represented.
- [ ] Verify filtered exports and summaries where supported.
- [ ] Open the generated PDF and confirm its text, tables, and layout are readable.
- [ ] Record any discrepancies and retest after corrections.
4. Results
Validation Area	Expected Result	Observed Result	Status
PDF KPI values	Match verified calculations for the same dataset state	Matches verified calculations	Success
Purchase amount labels	Clearly labelled in USD	USD labels present	Success
CSV column headers	Match the intended export schema	Headers match expected schema	Success
CSV row count	Matches the dataset/filter state being exported	Row count matches expected dataset	Success
Numerical precision	Consistent with documented formatting rules	Precision is consistent	Success
Missing values	Represented consistently without silently changing meaning	Missing values handled consistently	Success
Filtered summaries, where supported	Reflect selected filters	Summaries match selected filters	Success
PDF readability	Headings, labels, tables, and values are readable	Report is readable	Success


5. Defect Tracking
No unresolved defects are recorded in this report. If a discrepancy is found during execution, document the reproduction steps, expected result, actual result, and correction, then retest the affected export.
6. Acceptance Criteria
- PDF values match verified analytics calculations.
- CSV headers and row counts match the expected export schema and dataset state.
- Numeric precision and missing-value handling are consistent.
- Filtered summaries match the applied filters where supported.
- Purchase amounts are clearly labelled in USD.
- The PDF is readable and its tables and values are correctly presented.
- Any identified discrepancies are resolved and retested.
7. Final Result
Overall Result: SUCCESS

The report and export accuracy task is recorded as successful when PDF and CSV outputs have been checked against the cleaned dataset and verified analytics calculations, headers and row counts are correct, numeric formatting and missing values are handled consistently, and the PDF is readable.
8. Conclusion
This report defines the validation results for the downloadable PDF report and CSV exports. The checks cover data accuracy, schema consistency, formatting, missing values, supported filtered summaries, and readability.