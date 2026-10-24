import pandas as pd

from app.services.kpi_service import KPI_LABELS, calculate_kpis

FILTER_COLUMNS = {
    "category": "Category",
    "gender": "Gender",
    "season": "Season",
    "location": "Location",
    "subscription_status": "Subscription Status",
    "payment_method": "Payment Method",
}

SEASON_ORDER = ["Spring", "Summer", "Fall", "Winter"]

AGE_BINS = [0, 24, 34, 44, 54, 64, 200]
AGE_LABELS = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]

RATING_BINS = [0, 2, 3, 4, 5.0001]
RATING_LABELS = ["Below 2.0", "2.0-2.9", "3.0-3.9", "4.0-5.0"]

NOTES = [
    "Purchase amounts are recorded values, not audited company revenue.",
    "The dataset has no transaction date, so trends over time are not available.",
    "Missing review ratings are excluded from rating calculations.",
]


def get_filter_options(df):
    """Return the available values for each dashboard filter."""
    options = {}
    for key, column in FILTER_COLUMNS.items():
        if column in df.columns:
            options[key] = sorted(df[column].dropna().astype(str).unique().tolist())
        else:
            options[key] = []
    return options


def apply_filters(df, filters):
    """Keep only the rows that match the selected filter values."""
    filtered = df
    for key, values in (filters or {}).items():
        if key not in FILTER_COLUMNS:
            raise ValueError(f"Unknown filter: {key}")
        if not values:
            continue
        column = FILTER_COLUMNS[key]
        if column not in filtered.columns:
            continue
        filtered = filtered[filtered[column].astype(str).isin([str(v) for v in values])]
    return filtered


def _chart(chart_type, title, field, data, unit=None):
    return {
        "chart_type": chart_type,
        "title": title,
        "field": field,
        "unit": unit,
        "available": len(data) > 0,
        "data": data,
    }


def _counts(df, column, order=None, top=None):
    if column not in df.columns:
        return []
    counts = df[column].dropna().astype(str).value_counts()
    if order:
        ordered = [item for item in order if item in counts.index]
        extra = [item for item in counts.index if item not in order]
        counts = counts.reindex(ordered + extra)
    if top:
        counts = counts.head(top)
    return [{"label": str(label), "value": int(value)} for label, value in counts.items()]


def _binned_counts(series, bins, labels):
    values = pd.to_numeric(series, errors="coerce").dropna()
    if values.empty:
        return []
    binned = pd.cut(values, bins=bins, labels=labels)
    counts = binned.value_counts(sort=False)
    return [{"label": str(label), "value": int(value)} for label, value in counts.items()]


def _amount_by_category(df, how):
    if "Category" not in df.columns or "Purchase Amount (USD)" not in df.columns:
        return []
    amounts = pd.to_numeric(df["Purchase Amount (USD)"], errors="coerce")
    grouped = amounts.groupby(df["Category"].astype(str))
    result = grouped.sum() if how == "sum" else grouped.mean()
    result = result.dropna().sort_values(ascending=False)
    return [{"label": str(label), "value": round(float(value), 2)} for label, value in result.items()]


def build_charts(df):
    """Chart-ready data for the charts listed in the KPI and chart requirements."""
    return {
        "gender_distribution": _chart(
            "donut", "Gender Distribution", "Gender", _counts(df, "Gender"), "customers"
        ),
        "age_distribution": _chart(
            "histogram", "Age Distribution", "Age",
            _binned_counts(df["Age"], AGE_BINS, AGE_LABELS) if "Age" in df.columns else [],
            "customers",
        ),
        "spending_by_category": _chart(
            "bar", "Total Purchase Amount by Category", "Category",
            _amount_by_category(df, "sum"), "USD",
        ),
        "average_spending_by_category": _chart(
            "bar", "Average Purchase Amount by Category", "Category",
            _amount_by_category(df, "mean"), "USD",
        ),
        "purchases_by_season": _chart(
            "bar", "Purchases by Season", "Season",
            _counts(df, "Season", order=SEASON_ORDER), "records",
        ),
        "purchase_frequency": _chart(
            "bar", "Purchase Frequency", "Frequency of Purchases",
            _counts(df, "Frequency of Purchases"), "records",
        ),
        "ratings_distribution": _chart(
            "histogram", "Review Ratings Distribution", "Review Rating",
            _binned_counts(df["Review Rating"], RATING_BINS, RATING_LABELS)
            if "Review Rating" in df.columns else [],
            "records",
        ),
        "payment_methods": _chart(
            "donut", "Payment Methods", "Payment Method",
            _counts(df, "Payment Method"), "records",
        ),
        "shipping_types": _chart(
            "bar", "Shipping Types", "Shipping Type",
            _counts(df, "Shipping Type"), "records",
        ),
        "subscription_status": _chart(
            "donut", "Subscription Status", "Subscription Status",
            _counts(df, "Subscription Status"), "customers",
        ),
        "discount_usage": _chart(
            "donut", "Discount Usage", "Discount Applied",
            _counts(df, "Discount Applied"), "records",
        ),
        "product_preferences": _chart(
            "bar", "Top 10 Items Purchased", "Item Purchased",
            _counts(df, "Item Purchased", top=10), "records",
        ),
    }


def build_dashboard(df, filters=None):
    """KPIs and chart data for the (optionally filtered) dataset."""
    filtered = apply_filters(df, filters)
    return {
        "record_count": int(len(filtered)),
        "total_records_available": int(len(df)),
        "applied_filters": {k: v for k, v in (filters or {}).items() if v},
        "kpis": calculate_kpis(filtered),
        "kpi_labels": KPI_LABELS,
        "charts": build_charts(filtered),
        "notes": NOTES,
    }