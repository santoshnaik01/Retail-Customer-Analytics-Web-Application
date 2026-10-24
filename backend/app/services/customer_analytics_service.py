import pandas as pd

from app.services.analytics_service import AGE_BINS, AGE_LABELS, apply_filters

NOTES = [
    "Customer ID is unique for every record in this dataset, so customers and records are equal.",
    "Purchase amounts are recorded values, not audited company revenue.",
    "The dataset has no transaction date, so trends over time are not available.",
]


def _yes(series):
    return series.astype(str).str.strip().str.lower() == "yes"


def _group_table(df, key, top=None):
    """Customers, share and purchase amounts for each value of `key`."""
    frame = pd.DataFrame(
        {
            "key": key,
            "amount": pd.to_numeric(df["Purchase Amount (USD)"], errors="coerce"),
            "id": df["Customer ID"],
        }
    ).dropna(subset=["key"])
    if frame.empty:
        return []

    table = frame.groupby("key", observed=False).agg(
        value=("id", "nunique"),
        total=("amount", "sum"),
        avg=("amount", "mean"),
    )
    if not isinstance(key.dtype, pd.CategoricalDtype):
        table = table.sort_index().sort_values("value", ascending=False, kind="stable")
    if top:
        table = table.head(top)

    total_customers = int(frame["id"].nunique())
    rows = []
    for label, row in table.iterrows():
        rows.append(
            {
                "label": str(label),
                "value": int(row["value"]),
                "percentage": round(row["value"] / total_customers * 100, 2),
                "total_purchase_amount": round(float(row["total"]), 2),
                "average_purchase_amount": (
                    None if pd.isna(row["avg"]) else round(float(row["avg"]), 2)
                ),
            }
        )
    return rows


def _chart(chart_type, title, field, data, **extra):
    result = {
        "chart_type": chart_type,
        "title": title,
        "field": field,
        "unit": "customers",
        "available": len(data) > 0,
        "data": data,
    }
    result.update(extra)
    return result


def _summary(df):
    ages = pd.to_numeric(df["Age"], errors="coerce").dropna()
    amounts = pd.to_numeric(df["Purchase Amount (USD)"], errors="coerce").dropna()
    return {
        "total_customers": int(df["Customer ID"].nunique()),
        "average_age": None if ages.empty else round(float(ages.mean()), 1),
        "median_age": None if ages.empty else round(float(ages.median()), 1),
        "youngest_age": None if ages.empty else int(ages.min()),
        "oldest_age": None if ages.empty else int(ages.max()),
        "average_purchase_amount": None if amounts.empty else round(float(amounts.mean()), 2),
    }


def _gender_subscription(df):
    rows = []
    for gender, part in df.groupby("Gender"):
        customers = int(part["Customer ID"].nunique())
        subscribed = int(part.loc[_yes(part["Subscription Status"]), "Customer ID"].nunique())
        rows.append(
            {
                "label": str(gender),
                "customers": customers,
                "subscribed": subscribed,
                "subscription_rate": round(subscribed / customers * 100, 2) if customers else 0.0,
            }
        )
    return rows


def build_customer_analytics(df, filters=None):
    """Customer demographics: age groups, gender and location summaries."""
    filtered = apply_filters(df, filters)

    if len(filtered) == 0:
        age_groups = pd.Series(dtype="object")
    else:
        ages = pd.to_numeric(filtered["Age"], errors="coerce")
        age_groups = pd.cut(ages, bins=AGE_BINS, labels=AGE_LABELS)

    locations = _group_table(filtered, filtered["Location"], top=10) if len(filtered) else []
    total_locations = int(filtered["Location"].nunique()) if len(filtered) else 0

    return {
        "record_count": int(len(filtered)),
        "total_records_available": int(len(df)),
        "applied_filters": {k: v for k, v in (filters or {}).items() if v},
        "summary": _summary(filtered),
        "gender": _chart(
            "donut", "Customers by Gender", "Gender",
            _group_table(filtered, filtered["Gender"]) if len(filtered) else [],
        ),
        "age_groups": _chart(
            "histogram", "Customers by Age Group", "Age",
            _group_table(filtered, age_groups) if len(filtered) else [],
        ),
        "locations": _chart(
            "bar", "Top 10 Locations by Customers", "Location", locations,
            total_locations=total_locations,
        ),
        "gender_subscription": _gender_subscription(filtered) if len(filtered) else [],
        "notes": NOTES,
    }