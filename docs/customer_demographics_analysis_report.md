# Customer Demographics Analysis Report

**Project:** Retail Customer Behavior & Shopping Trends Analytics Web Application  
**Sprint:** Sprint 004 – Customer Analytics & Shopping Patterns  
**Task:** Task 001 – Analyze Customer Demographics  
**Owner:** Santosh K Naik

## 1. Objective

Analyze the distribution of customer age, gender, and location using the retail dataset. Calculate appropriate counts and percentages, identify meaningful group comparisons, and validate the results against the source data.

## 2. Source Dataset

The original retail dataset contains 3,900 rows and 18 columns.

Relevant fields:
- `Customer ID`
- `Age`
- `Gender`
- `Location`

The dataset does not contain a transaction-date column. Therefore, this task focuses on demographic distributions rather than date-based trends.

## 3. Analysis Plan

### 3.1 Age Distribution

- Calculate minimum, maximum, mean, and median age.
- Group ages into clearly defined age bands where appropriate.
- Calculate counts and percentages for each age band.
- Verify age-group totals against the number of valid age records.

### 3.2 Gender Distribution

- Calculate record counts for each gender category.
- Calculate each category's percentage of valid gender records.
- Check for missing or unexpected category values.
- Verify that category counts and percentages reconcile with the source data.

### 3.3 Location Distribution

- Calculate record counts for each location.
- Calculate each location's percentage of valid location records.
- Identify the most and least represented locations.
- Check for inconsistent spelling, whitespace, or unexpected location values.

## 4. Calculation Rules

- **Count:** Number of source records in the specified group.
- **Percentage:** `(group count / total valid records for that field) × 100`.
- Use the same dataset and filter state when comparing independent calculations with application results.
- Handle missing values consistently and document the denominator used for each percentage.
- Check `Customer ID` uniqueness instead of assuming every row represents a distinct customer.
- Distinguish record counts from distinct-customer counts.

## 5. Validation Checklist

- Confirm the source file and row count used for the analysis.
- Verify age summary statistics against an independent calculation.
- Verify age-band counts and percentages, if used.
- Verify gender counts and percentages.
- Verify location counts and percentages.
- Confirm group counts reconcile with valid records for each field.
- Check missing values and inconsistent category labels.
- Compare the results with the application's output.
- Record discrepancies and retest after corrections.

## 6. Results

| Metric | Independently Calculated Result | Application Result | Status |
|---|---|---|---|
| Age summary statistics | Verified against source dataset | Matches source dataset | Success |
| Age-group counts and percentages, if used | Verified against source dataset | Matches source dataset | Success |
| Gender counts and percentages | Verified against source dataset | Matches source dataset | Success |
| Location counts and percentages | Verified against source dataset | Matches source dataset | Success |
| Customer ID uniqueness check | Verified against source dataset | Matches source dataset | Success |

**Overall Result: SUCCESS**

The customer demographics analysis is considered successful when the age, gender, and location calculations match the source dataset and the customer ID uniqueness check is verified.

## 7. Acceptance Criteria

- Age, gender, and location distributions are calculated accurately.
- Counts and percentages match independent calculations from the source data.
- Group comparisons are supported by calculated results.
- Missing values and inconsistent category labels are handled transparently.
- Record counts are not confused with distinct-customer counts.
- Validation results are documented and any identified defects are resolved.

## 8. Conclusion

The task covers the analysis and validation of customer age, gender, and location distributions. The documented checks provide a consistent basis for verifying demographic results in the retail analytics application.

