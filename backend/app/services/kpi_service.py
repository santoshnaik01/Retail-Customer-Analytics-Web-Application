import pandas as pd

KPI_LABELS = {
    "total_customers": "Total Customers",
    "total_purchase_amount": "Total Purchase Amount",
    "average_purchase_amount": "Average Purchase Amount",
    "average_review_rating": "Average Review Rating",
    "total_records": "Total Records",
    "subscription_rate": "Subscription Rate (%)",
    "discount_usage_rate": "Discount Usage Rate (%)",
    "average_previous_purchases": "Average Previous Purchases",
}


def _number(series):
    """Convert a column to numbers; invalid values become missing."""
    return pd.to_numeric(series, errors="coerce")


def _safe_mean(series):
    values = _number(series).dropna()
    if values.empty:
        return None
    return round(float(values.mean()), 2)


def _rate(df, column, total_customers):
    """Percentage of unique customers whose column value is 'Yes'."""
    if total_customers == 0:
        return 0.0
    is_yes = df[column].astype(str).str.strip().str.lower() == "yes"
    yes_customers = df.loc[is_yes, "Customer ID"].nunique()
    return round(yes_customers / total_customers * 100, 2)


def calculate_kpis(df):
    """Calculate the approved dashboard KPIs from a (cleaned) dataset.

    Definitions follow docs/kpi_and_chart_requirements.md.
    Purchase amounts are recorded values, not audited company revenue.
    """
    total_records = int(len(df))
    total_customers = int(df["Customer ID"].nunique())
    amounts = _number(df["Purchase Amount (USD)"])

    return {
        "total_customers": total_customers,
        "total_purchase_amount": round(float(amounts.sum()), 2),
        "average_purchase_amount": _safe_mean(df["Purchase Amount (USD)"]),
        "average_review_rating": _safe_mean(df["Review Rating"]),
        "total_records": total_records,
        "subscription_rate": _rate(df, "Subscription Status", total_customers),
        "discount_usage_rate": _rate(df, "Discount Applied", total_customers),
        "average_previous_purchases": _safe_mean(df["Previous Purchases"]),
        "missing_review_ratings": int(_number(df["Review Rating"]).isna().sum()),
    }