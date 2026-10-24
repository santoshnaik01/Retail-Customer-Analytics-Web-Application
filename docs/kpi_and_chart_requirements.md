# Retail KPI and Chart Requirements

## 1. Dataset Overview

- Total records: 3,900
- Total columns: 18
- Missing review ratings: 37
- Duplicate rows: 0
- Transaction date column: Not available

## 2. KPI Definitions

| KPI | Calculation | Purpose |
|---|---|---|
| Total Customers | Count of unique Customer ID | Measure customer base |
| Total Purchase Amount | Sum of Purchase Amount (USD) | Measure recorded purchase value |
| Average Purchase Amount | Mean of Purchase Amount (USD) | Measure average spending |
| Average Review Rating | Mean of non-missing Review Rating | Measure customer ratings |
| Total Records | Number of dataset rows | Measure available records |
| Subscription Rate | Subscribed customers / Total customers × 100 | Measure subscription adoption |
| Discount Usage Rate | Customers with Discount Applied = Yes / Total customers × 100 | Measure discount usage |
| Average Previous Purchases | Mean of Previous Purchases | Measure prior purchase activity |

## 3. Chart Requirements

| Analysis | Chart Type | Fields |
|---|---|---|
| Gender distribution | Donut chart | Gender |
| Age distribution | Histogram | Age |
| Spending by category | Bar chart | Category, Purchase Amount (USD) |
| Average spending by category | Bar chart | Category, Purchase Amount (USD) |
| Purchases by season | Bar chart | Season |
| Purchase frequency | Bar chart | Frequency of Purchases |
| Ratings distribution | Histogram | Review Rating |
| Payment methods | Donut chart | Payment Method |
| Shipping types | Bar chart | Shipping Type |
| Subscription status | Donut chart | Subscription Status |
| Discount usage | Donut chart | Discount Applied |
| Product preferences | Bar chart | Item Purchased |

## 4. Data Limitations

- The dataset has no transaction date column, so transaction-date trends cannot be calculated.
- Review Rating contains 37 missing values.
- Discount Applied and Promo Code Used match exactly in the inspected data.
- Recorded purchase amounts should not automatically be interpreted as audited company revenue.