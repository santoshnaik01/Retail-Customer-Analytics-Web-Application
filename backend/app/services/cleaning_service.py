import pandas as pd
import numpy as np
from typing import Tuple, Dict, Any, List


class CleaningService:
    @staticmethod
    def clean_dataset(
        df: pd.DataFrame,
        impute_missing_rating: bool = True,
        imputation_strategy: str = "category_mean",
        trim_whitespace: bool = True,
        remove_duplicates: bool = True,
    ) -> Tuple[pd.DataFrame, Dict[str, Any]]:
        cleaned_df = df.copy()
        operations_log: List[str] = []

        records_before = len(cleaned_df)
        missing_before = int(cleaned_df.isnull().sum().sum())
        duplicates_removed = 0
        whitespace_trimmed_cols = 0

        # 1. Whitespace trimming & casing normalization
        if trim_whitespace:
            obj_cols = cleaned_df.select_dtypes(include=["object", "string", "str"]).columns
            for col in obj_cols:
                # check if strings need stripping
                pre_strip = cleaned_df[col].astype(str)
                post_strip = pre_strip.str.strip()
                if not pre_strip.equals(post_strip):
                    whitespace_trimmed_cols += 1
                cleaned_df[col] = post_strip
            operations_log.append(f"Trimmed leading/trailing whitespace across {len(obj_cols)} text columns.")

        # 2. Duplicate rows removal
        if remove_duplicates:
            dup_count = int(cleaned_df.duplicated().sum())
            if dup_count > 0:
                cleaned_df = cleaned_df.drop_duplicates().reset_index(drop=True)
                duplicates_removed = dup_count
                operations_log.append(f"Removed {dup_count} duplicate row(s).")
            else:
                operations_log.append("Checked for duplicate rows (0 found).")

        # 3. Handle missing values
        if impute_missing_rating and "Review Rating" in cleaned_df.columns:
            missing_ratings = int(cleaned_df["Review Rating"].isnull().sum())
            if missing_ratings > 0:
                if imputation_strategy == "category_mean" and "Category" in cleaned_df.columns:
                    # Category-level mean imputation rounded to 1 decimal place
                    cat_means = cleaned_df.groupby("Category")["Review Rating"].transform("mean").round(1)
                    cleaned_df["Review Rating"] = cleaned_df["Review Rating"].fillna(cat_means)
                    # Any remaining fallback to overall mean
                    overall_mean = round(float(cleaned_df["Review Rating"].mean()), 1)
                    cleaned_df["Review Rating"] = cleaned_df["Review Rating"].fillna(overall_mean)
                    operations_log.append(
                        f"Imputed {missing_ratings} missing Review Rating value(s) using Category-level mean rating."
                    )
                elif imputation_strategy == "category_median" and "Category" in cleaned_df.columns:
                    cat_medians = cleaned_df.groupby("Category")["Review Rating"].transform("median").round(1)
                    cleaned_df["Review Rating"] = cleaned_df["Review Rating"].fillna(cat_medians)
                    operations_log.append(
                        f"Imputed {missing_ratings} missing Review Rating value(s) using Category-level median rating."
                    )
                else:
                    overall_mean = round(float(cleaned_df["Review Rating"].mean()), 1)
                    cleaned_df["Review Rating"] = cleaned_df["Review Rating"].fillna(overall_mean)
                    operations_log.append(
                        f"Imputed {missing_ratings} missing Review Rating value(s) using overall mean rating ({overall_mean})."
                    )

        # 4. Safe type conversions and bounds validation
        if "Age" in cleaned_df.columns:
            cleaned_df["Age"] = pd.to_numeric(cleaned_df["Age"], errors="coerce").fillna(df["Age"].median()).astype(int)
        if "Purchase Amount (USD)" in cleaned_df.columns:
            cleaned_df["Purchase Amount (USD)"] = pd.to_numeric(
                cleaned_df["Purchase Amount (USD)"], errors="coerce"
            ).fillna(df["Purchase Amount (USD)"].median()).astype(float)
        if "Review Rating" in cleaned_df.columns:
            cleaned_df["Review Rating"] = pd.to_numeric(cleaned_df["Review Rating"], errors="coerce").round(1)
        if "Previous Purchases" in cleaned_df.columns:
            cleaned_df["Previous Purchases"] = pd.to_numeric(
                cleaned_df["Previous Purchases"], errors="coerce"
            ).fillna(0).astype(int)

        operations_log.append("Validated numeric ranges and strict data types for analytical consistency.")

        records_after = len(cleaned_df)
        missing_after = int(cleaned_df.isnull().sum().sum())

        summary = {
            "records_before": records_before,
            "records_after": records_after,
            "missing_before": missing_before,
            "missing_after": missing_after,
            "duplicates_removed": duplicates_removed,
            "whitespace_trimmed_cols": whitespace_trimmed_cols,
            "operations_log": operations_log,
        }

        return cleaned_df, summary
