# Dataset Quality Inspection Report

## Task Information
- Sprint: 001 - Project Setup & Data Analysis Foundation
- Task ID: 001
- Task: Inspect Retail Dataset and Identify Data Quality Issues
- Dataset: `data/customer_shopping_behavior.csv`
- Inspection type: Read-only exploratory data analysis

## 1. Dataset Overview
- Total rows: 3,900
- Total columns: 18
- Exact duplicate rows: 0
- Unique Customer IDs: 3,900
- Repeated Customer IDs: 0

## 2. Column Inventory

| Column | Observed data type |
|---|---|
| Customer ID | Integer |
| Age | Integer |
| Gender | String |
| Item Purchased | String |
| Category | String |
| Purchase Amount (USD) | Integer |
| Location | String |
| Size | String |
| Color | String |
| Season | String |
| Review Rating | Float |
| Subscription Status | String |
| Shipping Type | String |
| Discount Applied | String |
| Promo Code Used | String |
| Previous Purchases | Integer |
| Payment Method | String |
| Frequency of Purchases | String |

## 3. Missing Values

Only `Review Rating` contains missing values.
- Missing review ratings: 37
- Non-missing review ratings: 3,863
- Missing proportion: approximately 0.95%
- All other columns: 0 missing values

No values were imputed or removed during inspection.

## 4. Duplicate Checks
- Exact duplicate rows: 0
- Unique Customer IDs: 3,900
- Repeated Customer IDs: 0

## 5. Observed Numeric Ranges

| Column | Minimum | Maximum |
|---|---:|---:|
| Age | 18 | 70 |
| Purchase Amount (USD) | 20 | 100 |
| Review Rating | 2.5 | 5.0 |
| Previous Purchases | 1 | 50 |

These are observed dataset ranges, not independently established business validation rules.

## 6. Categorical Inspection

| Column | Unique values |
|---|---:|
| Gender | 2 |
| Item Purchased | 25 |
| Category | 4 |
| Location | 50 |
| Size | 4 |
| Color | 25 |
| Season | 4 |
| Subscription Status | 2 |
| Shipping Type | 6 |
| Discount Applied | 2 |
| Promo Code Used | 2 |
| Payment Method | 6 |
| Frequency of Purchases | 7 |

No leading or trailing whitespace was detected in the inspected categorical columns.

The observed categorical values appeared consistently formatted. Further domain-specific validation may still be appropriate.

## 7. Discount and Promo-Code Consistency

The two fields match for every inspected record:
- Discount Applied = No and Promo Code Used = No: 2,223 records
- Discount Applied = Yes and Promo Code Used = Yes: 1,677 records

This perfect correspondence may limit the ability to compare discount usage and promo-code usage as independent factors. The relationship should be documented, not automatically classified as an error.

## 8. Data Limitations
- There is no transaction date column.
- Transaction-date-based trends and time-series analysis are not supported by the available fields.
- Purchase frequency is a categorical field and does not provide actual transaction dates.
- The meaning of each row should be confirmed before interpreting totals as distinct orders or transactions.

## 9. Suggested Analysis Opportunities
- Customer demographics by age, gender, and location.
- Purchase amount by category, item, season, and customer segment.
- Product preferences by size and color.
- Average purchase amount and total recorded purchase amount.
- Review-rating summaries, accounting for missing ratings.
- Subscription status comparisons.
- Payment-method and shipping-type distributions.
- Previous-purchase and purchase-frequency segmentation.
- Discount and promo-code usage summaries, noting their perfect correspondence.

## 10. Candidate KPIs
- Total records in the dataset.
- Total recorded purchase amount.
- Average purchase amount.
- Average available review rating.
- Review-rating completeness percentage.
- Subscription-status distribution.
- Category and item purchase distribution.
- Discount and promo-code usage proportions.
- Payment-method distribution.
- Shipping-type distribution.
- Customer age-group distribution.

These are candidate analytical metrics. Their definitions and business interpretations should be confirmed before implementation.

## 11. Conclusion
The initial inspection found 3,900 records and 18 columns, 37 missing review ratings, no exact duplicate rows, no repeated Customer IDs, and no leading or trailing whitespace in categorical values. Discount and promo-code indicators match exactly across the dataset.

The original CSV was not modified. Missing-value handling and any additional cleaning should be performed in the designated data-cleaning task.

## 12. Reproducibility
The findings were obtained using Python and Pandas with read-only inspection commands. The reported results reflect the inspected local CSV file.
