# Dashboard Calculations and Filters — Test Report

**Project:** Retail Customer Behavior & Shopping Trends Analytics Web Application  
**Sprint:** Sprint 003 — KPIs & Main Dashboard  
**Task:** Task 008 — Test Dashboard Calculations and Filters  
**Assigned to:** Santosh K Naik

## 1. Objective

Verify dashboard KPI calculations, chart aggregations, filter combinations, empty results, invalid values, and frontend/backend responses.

## 2. Test Cases

| Test ID | Test scenario | Expected result | Status |
|---|---|---|---|
| TC-001 | Verify total purchase amount | Matches an independent calculation from the same dataset | Success |
| TC-002 | Verify average purchase amount | Matches the manually verified mean | Success |
| TC-003 | Verify customer count | Matches the distinct customer ID count | Success |
| TC-004 | Verify average review rating | Missing ratings are handled correctly | Success |
| TC-005 | Verify purchase-record count | Matches the number of analyzed records | Success |
| TC-006 | Verify chart aggregations | Chart totals and category values match the source data | Success |
| TC-007 | Apply individual filters | Results reflect the selected filter | Success |
| TC-008 | Apply multiple filters | Results satisfy all selected filter conditions | Success |
| TC-009 | Test filters with no matching records | Empty state is handled without an application crash | Success |
| TC-010 | Submit invalid filter values | API handles invalid input appropriately | Success |
| TC-011 | Verify frontend/backend responses | UI displays the returned data and errors correctly | Success |

## 3. Test Execution Results

All listed test cases are marked Success.

## 4. Defect Tracking

No defects recorded.

Corrections and retesting can be coordinated with Pratap (frontend) and Sarswati (backend), if required.

## 5. Acceptance Criteria

- KPI values match independent calculations.
- Chart aggregations are accurate.
- Individual and combined filters behave correctly.
- Empty results and invalid values are handled safely.
- Frontend displays backend responses correctly.
- Defects are recorded and retested after correction.