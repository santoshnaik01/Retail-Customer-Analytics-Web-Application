
# Dataset Structure and Quality Validation

## Task
Sprint 002 — Task 003: Validate Dataset Structure and Quality

## Dataset
- File: customer_shopping_behavior.csv
- Expected rows: 3,900
- Expected columns: 18
- Expected missing Review Rating values: 37
- Expected duplicate rows: 0

## Validation Rules

1. Reject empty uploads and files without headers or data rows.
2. Confirm all 18 required column names are present.
3. Detect duplicate column headers.
4. Report missing values without automatically rejecting optional missing ratings.
5. Detect completely empty rows and columns.
6. Identify duplicate rows and repeated Customer ID values.
7. Check numeric fields for non-numeric and fractional values where integers are expected.
8. Flag values outside configured numeric ranges for review.
9. Detect unexpected categorical values, leading/trailing whitespace, and inconsistent spelling or casing.
10. Preserve the original uploaded data; validation must not modify it.

## Known Dataset Findings

- The original dataset contains 3,900 rows and 18 columns.
- Review Rating contains 37 missing values.
- The original dataset has no duplicate rows.
- Customer ID is unique in the inspected dataset.
- Review Rating values range from 2.5 to 5.0 among non-missing records.
- Age ranges from 18 to 70.
- Purchase Amount (USD) ranges from 20 to 100.
- Previous Purchases ranges from 1 to 50.
- Discount Applied and Promo Code Used match in the inspected dataset.

## Limitations

- Numeric ranges are configurable validation rules and should be reviewed against business requirements.
- Missing Review Rating values are warnings, not automatic upload failures.
- Validation does not perform cleaning or imputation.
- The dataset has no transaction date column, so date-based validation is not applicable.

## Verification

Run the validation service against the provided CSV and record the actual row count, column count, missing values, duplicate count, issues, and warnings. Do not mark a check as passed until it has been executed.
