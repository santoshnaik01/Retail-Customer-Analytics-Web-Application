import io
import os
from typing import Optional, Dict, Any, List
import pandas as pd
import numpy as np

from app.config import DEFAULT_DATASET
from app.services.cleaning_service import CleaningService
from app.schemas.models import FilterParams, ColumnInfo, DatasetSummaryResponse, DataQualityResponse


class DatasetManager:
    _instance: Optional["DatasetManager"] = None

    def __init__(self):
        self.filename: str = "shopping_trends.csv"
        self.file_size_bytes: int = 0
        self.original_df: Optional[pd.DataFrame] = None
        self.cleaned_df: Optional[pd.DataFrame] = None
        self.is_cleaned: bool = False
        self.cleaning_summary: Optional[Dict[str, Any]] = None
        self._initialize_default()

    @classmethod
    def get_instance(cls) -> "DatasetManager":
        if cls._instance is None:
            cls._instance = DatasetManager()
        return cls._instance

    def _initialize_default(self):
        if DEFAULT_DATASET.exists():
            try:
                self.load_from_path(str(DEFAULT_DATASET), "shopping_trends.csv")
                # Automatically run initial clean on default dataset so the app starts fully functional
                self.run_cleaning()
            except Exception as e:
                print(f"Error loading default dataset: {e}")

    def load_from_bytes(self, content: bytes, filename: str) -> None:
        if len(content) == 0:
            raise ValueError("Uploaded file is empty.")
        
        try:
            df = pd.read_csv(io.BytesIO(content))
        except Exception as e:
            raise ValueError(f"Unable to parse CSV file: {str(e)}")

        if df.empty or len(df.columns) == 0:
            raise ValueError("Uploaded CSV has no records or columns.")

        self.filename = filename
        self.file_size_bytes = len(content)
        self.original_df = df
        self.cleaned_df = None
        self.is_cleaned = False
        self.cleaning_summary = None

    def load_from_path(self, path: str, filename: Optional[str] = None) -> None:
        if not os.path.exists(path):
            raise FileNotFoundError(f"Dataset path does not exist: {path}")
        
        self.original_df = pd.read_csv(path)
        self.file_size_bytes = os.path.getsize(path)
        self.filename = filename or os.path.basename(path)
        self.cleaned_df = None
        self.is_cleaned = False
        self.cleaning_summary = None

    def run_cleaning(
        self,
        impute_missing_rating: bool = True,
        imputation_strategy: str = "category_mean",
        trim_whitespace: bool = True,
        remove_duplicates: bool = True,
    ) -> Dict[str, Any]:
        if self.original_df is None:
            raise ValueError("No dataset loaded to clean.")

        cleaned_df, summary = CleaningService.clean_dataset(
            self.original_df,
            impute_missing_rating=impute_missing_rating,
            imputation_strategy=imputation_strategy,
            trim_whitespace=trim_whitespace,
            remove_duplicates=remove_duplicates,
        )

        self.cleaned_df = cleaned_df
        self.is_cleaned = True
        self.cleaning_summary = summary
        return summary

    def get_df(self, use_cleaned: bool = True) -> pd.DataFrame:
        if use_cleaned and self.cleaned_df is not None:
            return self.cleaned_df
        if self.original_df is not None:
            return self.original_df
        raise ValueError("No dataset is currently loaded.")

    def apply_filters(self, df: pd.DataFrame, filters: FilterParams) -> pd.DataFrame:
        filtered = df.copy()

        if filters.category and filters.category != "All Categories" and "Category" in filtered.columns:
            filtered = filtered[filtered["Category"].str.lower() == filters.category.lower()]

        if filters.gender and filters.gender != "All Gender" and "Gender" in filtered.columns:
            filtered = filtered[filtered["Gender"].str.lower() == filters.gender.lower()]

        if filters.location and filters.location != "All Locations" and "Location" in filtered.columns:
            filtered = filtered[filtered["Location"].str.lower() == filters.location.lower()]

        if filters.season and filters.season != "All Seasons" and "Season" in filtered.columns:
            filtered = filtered[filtered["Season"].str.lower() == filters.season.lower()]

        if (
            filters.subscription_status
            and filters.subscription_status != "All Status"
            and "Subscription Status" in filtered.columns
        ):
            filtered = filtered[filtered["Subscription Status"].str.lower() == filters.subscription_status.lower()]

        if (
            filters.payment_method
            and filters.payment_method != "All Methods"
            and "Payment Method" in filtered.columns
        ):
            filtered = filtered[filtered["Payment Method"].str.lower() == filters.payment_method.lower()]

        if (
            filters.shipping_type
            and filters.shipping_type != "All Types"
            and "Shipping Type" in filtered.columns
        ):
            filtered = filtered[filtered["Shipping Type"].str.lower() == filters.shipping_type.lower()]

        if filters.discount_applied and filters.discount_applied != "All" and "Discount Applied" in filtered.columns:
            filtered = filtered[filtered["Discount Applied"].str.lower() == filters.discount_applied.lower()]

        if filters.promo_code_used and filters.promo_code_used != "All" and "Promo Code Used" in filtered.columns:
            filtered = filtered[filtered["Promo Code Used"].str.lower() == filters.promo_code_used.lower()]

        if filters.age_group and filters.age_group != "All" and "Age" in filtered.columns:
            if filters.age_group == "18-25":
                filtered = filtered[(filtered["Age"] >= 18) & (filtered["Age"] <= 25)]
            elif filters.age_group == "26-35":
                filtered = filtered[(filtered["Age"] >= 26) & (filtered["Age"] <= 35)]
            elif filters.age_group == "36-45":
                filtered = filtered[(filtered["Age"] >= 36) & (filtered["Age"] <= 45)]
            elif filters.age_group == "46-55":
                filtered = filtered[(filtered["Age"] >= 46) & (filtered["Age"] <= 55)]
            elif filters.age_group == "56+":
                filtered = filtered[filtered["Age"] >= 56]

        return filtered

    def get_summary(self) -> DatasetSummaryResponse:
        df = self.get_df(use_cleaned=self.is_cleaned)

        columns_info: List[ColumnInfo] = []
        for col in df.columns:
            sample_vals = df[col].dropna().unique()[:5].tolist()
            # Convert numpy types to python types for clean serialization
            safe_samples = [int(v) if isinstance(v, (np.integer, int)) else float(v) if isinstance(v, (np.floating, float)) else str(v) for v in sample_vals]
            columns_info.append(
                ColumnInfo(
                    name=col,
                    dtype=str(df[col].dtype),
                    non_null_count=int(df[col].count()),
                    null_count=int(df[col].isnull().sum()),
                    unique_count=int(df[col].nunique()),
                    sample_values=safe_samples,
                )
            )

        # Extract available filter choices
        available_filters: Dict[str, List[str]] = {}
        filter_keys = [
            ("Category", "categories"),
            ("Gender", "genders"),
            ("Location", "locations"),
            ("Season", "seasons"),
            ("Subscription Status", "subscription_statuses"),
            ("Payment Method", "payment_methods"),
            ("Shipping Type", "shipping_types"),
            ("Discount Applied", "discounts"),
            ("Promo Code Used", "promo_codes"),
        ]
        for col_name, key in filter_keys:
            if col_name in df.columns:
                unique_vals = sorted(df[col_name].dropna().unique().tolist())
                available_filters[key] = unique_vals

        return DatasetSummaryResponse(
            filename=self.filename,
            row_count=len(df),
            column_count=len(df.columns),
            file_size_kb=round(self.file_size_bytes / 1024, 2),
            is_cleaned=self.is_cleaned,
            columns=columns_info,
            available_filters=available_filters,
        )

    def get_quality_report(self) -> DataQualityResponse:
        target_df = self.original_df if self.original_df is not None else self.get_df()

        missing_dict = {col: int(target_df[col].isnull().sum()) for col in target_df.columns}
        total_missing = sum(missing_dict.values())
        dup_rows = int(target_df.duplicated().sum())
        
        dup_ids = 0
        if "Customer ID" in target_df.columns:
            dup_ids = int(target_df["Customer ID"].duplicated().sum())

        total_cells = len(target_df) * len(target_df.columns)
        health_score = round(max(0.0, 100.0 - ((total_missing + dup_rows * 5) / max(total_cells, 1)) * 100), 1)

        column_quality = []
        for col in target_df.columns:
            null_count = int(target_df[col].isnull().sum())
            null_pct = round((null_count / len(target_df)) * 100, 2)
            column_quality.append({
                "column": col,
                "dtype": str(target_df[col].dtype),
                "null_count": null_count,
                "null_pct": null_pct,
                "status": "Healthy" if null_count == 0 else "Needs Cleaning"
            })

        return DataQualityResponse(
            missing_values=missing_dict,
            total_missing_cells=total_missing,
            duplicate_rows=dup_rows,
            duplicate_customer_ids=dup_ids,
            inconsistent_values=0,
            data_types_fixed=len(target_df.columns) if self.is_cleaned else 0,
            health_score=health_score,
            column_quality=column_quality,
        )
