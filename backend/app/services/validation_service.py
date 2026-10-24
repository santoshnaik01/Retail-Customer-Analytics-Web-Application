
from typing import Any

import pandas as pd


class DatasetValidationService:
    """Validate retail customer shopping datasets before cleaning."""

    REQUIRED_COLUMNS = [
        "Customer ID",
        "Age",
        "Gender",
        "Item Purchased",
        "Category",
        "Purchase Amount (USD)",
        "Location",
        "Size",
        "Color",
        "Season",
        "Review Rating",
        "Subscription Status",
        "Shipping Type",
        "Discount Applied",
        "Promo Code Used",
        "Previous Purchases",
        "Payment Method",
        "Frequency of Purchases",
    ]

    NUMERIC_RANGES = {
        "Age": (18, 100),
        "Purchase Amount (USD)": (0, None),
        "Review Rating": (1, 5),
        "Previous Purchases": (0, None),
    }

    ALLOWED_VALUES = {
        "Gender": {"Male", "Female"},
        "Category": {"Accessories", "Clothing", "Footwear", "Outerwear"},
        "Size": {"S", "M", "L", "XL"},
        "Season": {"Spring", "Summer", "Fall", "Winter"},
        "Subscription Status": {"Yes", "No"},
        "Discount Applied": {"Yes", "No"},
        "Promo Code Used": {"Yes", "No"},
    }

    @classmethod
    def validate(cls, df: pd.DataFrame) -> dict[str, Any]:
        """Return dataset structure and quality validation results."""

        issues: list[str] = []
        warnings: list[str] = []
        checks: list[str] = []

        # 1. Check whether a dataset was provided.
        if df is None:
            return {
                "valid": False,
                "row_count": 0,
                "column_count": 0,
                "missing_values": {},
                "duplicate_rows": 0,
                "issues": ["No dataset was provided."],
                "warnings": [],
                "checks": [],
            }

        # 2. Check for empty datasets and missing headers.
        if df.empty:
            issues.append("Dataset has no data rows.")

        if len(df.columns) == 0:
            issues.append("Dataset has no column headers.")

        # 3. Check duplicate column headers.
        duplicate_headers = df.columns[df.columns.duplicated()].tolist()

        if duplicate_headers:
            issues.append(
                "Duplicate column headers: "
                + ", ".join(map(str, duplicate_headers))
            )

        # 4. Check required columns.
        missing_columns = [
            col for col in cls.REQUIRED_COLUMNS if col not in df.columns
        ]

        if missing_columns:
            issues.append(
                "Missing required columns: "
                + ", ".join(missing_columns)
            )
        else:
            checks.append("All 18 required columns are present.")

        # Stop column-specific checks if required columns are missing.
        if missing_columns or len(df.columns) == 0:
            return {
                "valid": False,
                "row_count": int(len(df)),
                "column_count": int(len(df.columns)),
                "missing_values": {},
                "duplicate_rows": int(df.duplicated().sum()),
                "issues": issues,
                "warnings": warnings,
                "checks": checks,
            }

        # 5. Detect completely empty rows and columns.
        empty_rows = int(df.isna().all(axis=1).sum())
        empty_columns = df.columns[df.isna().all()].tolist()

        if empty_rows:
            warnings.append(
                f"{empty_rows} completely empty row(s) found."
            )

        if empty_columns:
            issues.append(
                "Completely empty column(s): "
                + ", ".join(map(str, empty_columns))
            )

        # 6. Count missing values in required columns.
        missing_series = df[cls.REQUIRED_COLUMNS].isna().sum()

        missing_values = {
            col: int(count)
            for col, count in missing_series.items()
            if count > 0
        }

        if missing_values:
            warnings.append(
                f"Missing values detected: {missing_values}"
            )
        else:
            checks.append("No missing values found.")

        # 7. Detect duplicate records.
        duplicate_rows = int(df.duplicated().sum())

        if duplicate_rows:
            warnings.append(
                f"{duplicate_rows} duplicate row(s) found."
            )
        else:
            checks.append("No duplicate rows found.")

        # 8. Check duplicate customer IDs.
        if "Customer ID" in df.columns:
            duplicate_ids = int(
                df["Customer ID"].duplicated().sum()
            )

            if duplicate_ids:
                warnings.append(
                    f"{duplicate_ids} repeated Customer ID value(s) found."
                )

            if df["Customer ID"].isna().any():
                issues.append(
                    "Customer ID contains missing values."
                )

        # 9. Check numeric fields.
        numeric_columns = [
            "Customer ID",
            "Age",
            "Purchase Amount (USD)",
            "Review Rating",
            "Previous Purchases",
        ]

        for col in numeric_columns:
            values = pd.to_numeric(df[col], errors="coerce")

            invalid_type_count = int(
                (df[col].notna() & values.isna()).sum()
            )

            if invalid_type_count:
                issues.append(
                    f"{col} contains {invalid_type_count} "
                    "non-numeric value(s)."
                )

            # Check configured numeric ranges.
            if col in cls.NUMERIC_RANGES:
                minimum, maximum = cls.NUMERIC_RANGES[col]

                out_of_range = pd.Series(
                    False,
                    index=df.index,
                )

                if minimum is not None:
                    out_of_range |= (
                        values.notna() & (values < minimum)
                    )

                if maximum is not None:
                    out_of_range |= (
                        values.notna() & (values > maximum)
                    )

                out_of_range_count = int(out_of_range.sum())

                if out_of_range_count:
                    warnings.append(
                        f"{col} contains {out_of_range_count} "
                        "value(s) outside the configured "
                        "validation range."
                    )

        # 10. Ensure integer-like fields contain whole numbers.
        integer_columns = [
            "Customer ID",
            "Age",
            "Previous Purchases",
        ]

        for col in integer_columns:
            values = pd.to_numeric(df[col], errors="coerce")

            fractional_values = (
                values.notna() & ((values % 1) != 0)
            )

            if fractional_values.any():
                issues.append(
                    f"{col} contains non-integer value(s)."
                )

        # 11. Validate categorical values.
        for col, allowed_values in cls.ALLOWED_VALUES.items():
            values = df[col].dropna().astype(str)

            # Detect whitespace without modifying the original data.
            whitespace_count = int(
                (values != values.str.strip()).sum()
            )

            if whitespace_count:
                warnings.append(
                    f"{col} contains {whitespace_count} value(s) "
                    "with leading or trailing whitespace."
                )

            # Compare case-insensitively.
            # casefold() prevents XL from being incorrectly flagged as Xl.
            normalized_values = values.str.strip().str.casefold()

            allowed_normalized = {
                value.casefold() for value in allowed_values
            }

            unexpected_values = sorted(
                set(normalized_values) - allowed_normalized
            )

            if unexpected_values:
                warnings.append(
                    f"{col} contains unexpected categorical "
                    f"value(s): {unexpected_values}"
                )

        # 12. Return the validation summary.
        return {
            "valid": len(issues) == 0,
            "row_count": int(len(df)),
            "column_count": int(len(df.columns)),
            "missing_values": missing_values,
            "duplicate_rows": duplicate_rows,
            "issues": issues,
            "warnings": warnings,
            "checks": checks,
        }
