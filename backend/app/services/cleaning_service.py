import pandas as pd

REQUIRED_COLUMNS = [
    "Customer ID", "Age", "Gender", "Item Purchased", "Category",
    "Purchase Amount (USD)", "Location", "Size", "Color", "Season",
    "Review Rating", "Subscription Status", "Shipping Type",
    "Discount Applied", "Promo Code Used", "Previous Purchases",
    "Payment Method", "Frequency of Purchases",
]

NUMERIC_COLUMNS = [
    "Customer ID", "Age", "Purchase Amount (USD)",
    "Review Rating", "Previous Purchases",
]

TEXT_COLUMNS = [c for c in REQUIRED_COLUMNS if c not in NUMERIC_COLUMNS]


def _missing_by_column(df):
    counts = df.isna().sum()
    return {col: int(n) for col, n in counts.items() if n > 0}


def clean_dataset(df, impute_missing_rating=None):
    """Clean the uploaded data and return (cleaned_df, summary).

    Rules (based on the dataset quality report):
    1. Required columns must exist.
    2. Trim leading/trailing spaces in text columns.
    3. Convert numeric columns to numbers; invalid values become missing.
    4. Remove exact duplicate rows only.
    5. Missing Review Rating values are kept by default (analytics skip them).
       Optionally fill them with "median" or "mean".
    The original data is never changed: a copy is cleaned.
    """
    if impute_missing_rating not in (None, "median", "mean"):
        raise ValueError("impute_missing_rating must be None, 'median' or 'mean'.")

    missing_cols = [c for c in REQUIRED_COLUMNS if c not in df.columns]
    if missing_cols:
        raise ValueError("Missing required columns: " + ", ".join(missing_cols))

    cleaned = df.copy()
    actions = []

    rows_before = int(len(cleaned))
    missing_before = _missing_by_column(cleaned)

    # 1. Trim whitespace in text columns
    trimmed_columns = {}
    for col in TEXT_COLUMNS:
        original = cleaned[col]
        stripped = original.str.strip()
        changed = int(((original != stripped) & original.notna()).sum())
        if changed > 0:
            cleaned[col] = stripped
            trimmed_columns[col] = changed
    if trimmed_columns:
        actions.append(f"Trimmed extra spaces in {len(trimmed_columns)} text column(s).")

    # 2. Convert numeric columns
    invalid_values = {}
    for col in NUMERIC_COLUMNS:
        if not pd.api.types.is_numeric_dtype(cleaned[col]):
            converted = pd.to_numeric(cleaned[col], errors="coerce")
            bad = int(converted.isna().sum() - cleaned[col].isna().sum())
            cleaned[col] = converted
            invalid_values[col] = bad
    if invalid_values:
        total_bad = sum(invalid_values.values())
        actions.append(
            f"Converted {len(invalid_values)} column(s) to numbers; "
            f"{total_bad} invalid value(s) set to missing."
        )

    # 3. Remove exact duplicate rows
    duplicates_removed = int(cleaned.duplicated().sum())
    if duplicates_removed > 0:
        cleaned = cleaned.drop_duplicates().reset_index(drop=True)
        actions.append(f"Removed {duplicates_removed} exact duplicate row(s).")

    # 4. Optional handling of missing ratings
    ratings_filled = 0
    ratings_missing = int(cleaned["Review Rating"].isna().sum())
    if ratings_missing > 0:
        if impute_missing_rating in ("median", "mean"):
            fill_value = getattr(cleaned["Review Rating"], impute_missing_rating)()
            cleaned["Review Rating"] = cleaned["Review Rating"].fillna(fill_value)
            ratings_filled = ratings_missing
            actions.append(
                f"Filled {ratings_filled} missing Review Rating value(s) "
                f"with the {impute_missing_rating} ({round(float(fill_value), 2)})."
            )
        else:
            actions.append(
                f"Kept {ratings_missing} missing Review Rating value(s) as missing; "
                "they are excluded from rating averages."
            )

    if not actions:
        actions.append("No cleaning was required.")

    summary = {
        "rows_before": rows_before,
        "rows_after": int(len(cleaned)),
        "duplicates_removed": duplicates_removed,
        "missing_before": missing_before,
        "missing_after": _missing_by_column(cleaned),
        "whitespace_trimmed": trimmed_columns,
        "invalid_values_set_to_missing": invalid_values,
        "ratings_filled": ratings_filled,
        "actions": actions,
    }
    return cleaned, summary